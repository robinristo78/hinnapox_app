import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  PanResponder,
  GestureResponderEvent,
} from 'react-native';
import Svg, { Path, Line as SvgLine, G } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import {
  useFuelPricesHistory,
  //useElectricityHistory,
  type ChartData,
  useTodayElectricityPriceChart,
} from 'hooks/useFuelPrice';

interface PriceChartProps {
  fuelTypes?: ('95' | '98' | 'D' | 'EL')[];
}

const createMultiLinePath = (
  prices: number[],
  width: number,
  height: number,
  globalMin: number,
  globalMax: number,
  verticalPadding: number = 20,
  horizontalPadding: number = 15
): string => {
  if (!prices.length) return '';

  const range = globalMax - globalMin || 1;

  const usableWidth = width - 2 * horizontalPadding;
  const step = usableWidth / (prices.length - 1 || 1);
  const usableHeight = height - 2 * verticalPadding;

  let d = `M ${horizontalPadding} ${height - verticalPadding - ((prices[0] - globalMin) / range) * usableHeight}`;

  prices.forEach((val, i) => {
    const x = horizontalPadding + i * step;
    const y = height - verticalPadding - ((val - globalMin) / range) * usableHeight;
    d += ` L ${x} ${y}`;
  });

  return d;
};

// Find local maxima and minima with minimum distance between dots
const findPeaksAndValleys = (prices: number[], minDistance: number = 3): number[] => {
  if (prices.length < 3) return [0, prices.length - 1];

  const candidates: { index: number; isPeak: boolean; value: number }[] = [];

  // Add first point
  candidates.push({ index: 0, isPeak: false, value: prices[0] });

  for (let i = 1; i < prices.length - 1; i++) {
    const prev = prices[i - 1];
    const curr = prices[i];
    const next = prices[i + 1];

    // Peak (local maximum)
    if (curr > prev && curr > next) {
      candidates.push({ index: i, isPeak: true, value: curr });
    }
    // Valley (local minimum)
    else if (curr < prev && curr < next) {
      candidates.push({ index: i, isPeak: false, value: curr });
    }
  }

  // Add last point
  candidates.push({ index: prices.length - 1, isPeak: false, value: prices[prices.length - 1] });

  // Filter out candidates that are too close to each other
  const result: number[] = [];
  if (candidates.length > 0) {
    result.push(candidates[0].index);

    for (let i = 1; i < candidates.length; i++) {
      const lastAdded = result[result.length - 1];
      if (Math.abs(candidates[i].index - lastAdded) >= minDistance) {
        result.push(candidates[i].index);
      }
    }
  }

  return result;
};

export default function PriceChart({ fuelTypes = ['95', 'D'] }: PriceChartProps) {
  const { t } = useTranslation();
  const [selectedDataIndex, setSelectedDataIndex] = useState<number | null>(null);
  const svgRef = useRef(null);

  const width = Dimensions.get('window').width - 60;
  const height = 250;
  const verticalPadding = 20;
  const horizontalPadding = 15;
  const usableWidth = width - 2 * horizontalPadding;

  // Fetch fuel and electricity data
  const fuelTypesFiltered = fuelTypes.filter((f) => f !== 'EL') as ('95' | '98' | 'D')[];
  const hasElectricity = fuelTypes.includes('EL');

  const {
    data: fuelChartData,
    isLoading: fuelLoading,
    error: fuelError,
  } = useFuelPricesHistory(fuelTypesFiltered);
  const {
    data: elecChartData,
    isLoading: elecLoading,
    error: elecError,
  } = useTodayElectricityPriceChart();

  // Combine data
  const chartData = [
    ...(fuelChartData || []),
    ...(hasElectricity && elecChartData ? elecChartData : []),
  ];

  const isLoading = fuelLoading || (hasElectricity && elecLoading);
  const error = fuelError || elecError;

  if (isLoading) {
    return (
      <View className="mt-6 px-5">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="mt-6 px-5">
        <Text style={{ color: '#EF4444' }}>{t('errorLoadingPrices')}</Text>
      </View>
    );
  }

  if (chartData.length === 0) {
    return (
      <View className="mt-6 px-5">
        <Text>{t('currentPrice')}</Text>
      </View>
    );
  }

  // Use the first fuel type's data length as x-axis reference
  const allPrices = chartData
    .flatMap((c) => c.prices)
    .filter((p) => typeof p === 'number' && !isNaN(p) && p > 0);

  if (allPrices.length === 0) {
    return (
      <View className="mt-6 px-5">
        <Text style={{ color: '#EF4444' }}>No valid price data available</Text>
      </View>
    );
  }

  //const globalMax = Math.max(...allPrices);
  //const globalMin = Math.min(...allPrices);
  //const globalRange = globalMax - globalMin || 1;

  return (
    <View className="mt-6 px-5">
      <Text className="mb-2 text-center text-xl font-semibold text-gray-700 dark:text-white">
        {hasElectricity ? t('todayPrices') : `${t('priceComparison')} - ${t('last30Days')}`}
      </Text>

      <View className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-glass-white">
        <View className="mb-4 flex-row flex-wrap gap-3">
          {chartData.map((chart) => (
            <View key={chart.fuel} className="flex-row items-center gap-2">
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 2,
                  backgroundColor: chart.color,
                }}
              />
              <Text className="text-xs text-gray-600">{t(chart.label)}</Text>
            </View>
          ))}
        </View>

        <View className="relative h-[270px] w-full items-center justify-center">
          {/* Chart */}
          <Svg width={width} height={height} style={{ backgroundColor: '#FFFFFF' }}>
            {Array.from({ length: 5 }).map((_, i) => {
              const y = (height / 4) * i;
              return (
                <SvgLine
                  key={`grid-${i}`}
                  x1="0"
                  y1={y}
                  x2={width}
                  y2={y}
                  stroke="#F0F0F0"
                  strokeWidth="1"
                />
              );
            })}

            {chartData.map((chart, idx) => {
              // Calculate global min/max across all fuel types
              const allPrices = chartData
                .flatMap((c) => c.prices)
                .filter((p) => typeof p === 'number' && !isNaN(p) && p > 0);
              const globalMin = Math.min(...allPrices);
              const globalMax = Math.max(...allPrices);

              const path = createMultiLinePath(
                chart.prices,
                width,
                height,
                globalMin,
                globalMax,
                verticalPadding,
                horizontalPadding
              );

              return (
                <Path
                  key={`path-${chart.fuel}`}
                  d={path}
                  stroke={chart.color}
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })}

            {/* Draggable vertical line */}
            {selectedDataIndex !== null && (
              <SvgLine
                x1={
                  horizontalPadding +
                  (selectedDataIndex / Math.max(1, chartData[0]?.prices.length - 1)) * usableWidth
                }
                y1={verticalPadding}
                x2={
                  horizontalPadding +
                  (selectedDataIndex / Math.max(1, chartData[0]?.prices.length - 1)) * usableWidth
                }
                y2={height - verticalPadding}
                stroke="#666"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            )}
          </Svg>

          {/* Touch overlay for dragging */}
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: width,
              height: height,
            }}
            onPress={(event) => {
              const touch = event.nativeEvent.locationX;
              if (chartData[0]?.prices) {
                const relativeX = touch - horizontalPadding;
                const index = Math.round(
                  (relativeX / usableWidth) * (chartData[0].prices.length - 1)
                );
                setSelectedDataIndex(Math.max(0, Math.min(index, chartData[0].prices.length - 1)));
              }
            }}
            activeOpacity={1}
          />
        </View>

        {/* Data info panel */}
        {selectedDataIndex !== null && (
          <View className="mt-4 rounded-lg bg-gray-50 p-4">
            {chartData.map((chart) => {
              const price = chart.prices[selectedDataIndex];
              if (!price) return null;

              return (
                <View key={chart.fuel} className="mb-3 flex-row justify-between">
                  <Text className="font-semibold text-gray-700">{t(chart.label)}</Text>
                  <View>
                    {chart.fuel === 'EL' ? (
                      <>
                        <Text className="text-right text-sm text-gray-600">
                          {Math.floor((selectedDataIndex / chart.prices.length) * 24)
                            .toString()
                            .padStart(2, '0')}
                          :00 -{' '}
                          {(Math.floor((selectedDataIndex / chart.prices.length) * 24) + 1)
                            .toString()
                            .padStart(2, '0')}
                          :00
                        </Text>
                        <Text className="text-right text-lg font-bold text-gray-900">
                          {price.toFixed(2)} {t('elecUnit')}
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text className="text-right text-sm text-gray-600">
                          {t('day')}{selectedDataIndex + 1}
                        </Text>
                        <Text className="text-right text-lg font-bold text-gray-900">
                          {price.toFixed(2)} €/L
                        </Text>
                      </>
                    )}
                  </View>
                </View>
              );
            })}
            <TouchableOpacity
              onPress={() => setSelectedDataIndex(null)}
              className="mt-3 items-center rounded-lg bg-gray-300 py-2">
              <Text className="font-semibold text-gray-700">{t('clearSelection')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Summary */}
      <View className="mt-4 gap-2">
        {chartData.map((chart: ChartData) => {
          if (!chart.prices || chart.prices.length === 0) return null;

          const validPrices = chart.prices.filter(
            (p: number) => typeof p === 'number' && !isNaN(p) && p > 0
          );
          if (validPrices.length === 0) return null;

          const avgPrice = (
            validPrices.reduce((a: number, b: number) => a + b, 0) / validPrices.length
          ).toFixed(2);
          const maxPrice = Math.max(...validPrices).toFixed(2);
          const minPrice = Math.min(...validPrices).toFixed(2);

          return (
            <View
              key={chart.fuel}
              className="rounded-lg bg-gray-50 p-3"
              style={{ borderWidth: 2, borderColor: chart.color }}>
              <Text className="font-semibold text-gray-800">{t(chart.label)}</Text>
              <View className="mt-1 flex-col justify-between text-xs text-gray-800">
                <Text>
                  {t('average')}: {avgPrice} {chart.fuel === 'EL' ? t('elecUnit') : '€/L'}
                </Text>
                <Text>
                  {t('maximum')}: {maxPrice} {chart.fuel === 'EL' ? t('elecUnit') : '€/L'}
                </Text>
                <Text>
                  {t('minimum')}: {minPrice} {chart.fuel === 'EL' ? t('elecUnit') : '€/L'}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
