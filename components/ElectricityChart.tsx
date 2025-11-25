import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Dimensions } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

export default function ElectricityChart() {
  const [electricity, setElectricity] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const width = Dimensions.get('window').width - 60;
  const height = 150;

  useEffect(() => {
    const load = async () => {
      try {
        const url = 'http://37.27.45.218:3020/api/prices/30d';
        const res = await fetch(url);
        const json = await res.json();

        const elec = json.electricity || json.electricity_prices || json.el || json.data || [];

        if (!Array.isArray(elec) || elec.length === 0) {
          console.log('No electricity array found');
          setLoading(false);
          return;
        }

        // Use DAILY AVERAGE (correct field)
        const values = elec
          .map((item: any) => Number(item.avg_price))
          .filter((v: number) => !isNaN(v));

        setElectricity(values);
      } catch (err) {
        console.log('FETCH ERROR:', err);
      }

      setLoading(false);
    };

    load();
  }, []);

  const createPath = (values: number[]) => {
    if (!values.length) return '';

    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;

    const step = width / (values.length - 1);
    let d = `M 0 ${height - ((values[0] - min) / range) * height}`;

    values.forEach((val, i) => {
      const x = i * step;
      const y = height - ((val - min) / range) * height;
      d += ` L ${x} ${y}`;
    });

    return d;
  };

  return (
    <View className="mt-6 px-6">
      <Text className="mb-3 text-sm text-gray-500">Viimase 30 päeva elekter</Text>

      {loading ? (
        <ActivityIndicator />
      ) : electricity.length === 0 ? (
        <Text style={{ color: 'red' }}>No electricity data found</Text>
      ) : (
        <View className="rounded-2xl border-2 border-black/5 bg-white p-4  shadow-lg">
          <Svg width={width} height={height}>
            <Path d={createPath(electricity)} stroke="#4F46E5" strokeWidth={3} fill="none" />

            <Circle
              cx={width}
              cy={
                height -
                ((electricity[electricity.length - 1] - Math.min(...electricity)) /
                  (Math.max(...electricity) - Math.min(...electricity) || 1)) *
                  height
              }
              r={5}
              fill="#4F46E5"
            />
          </Svg>
        </View>
      )}
    </View>
  );
}
