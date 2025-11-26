import { useQuery } from '@tanstack/react-query';
import { FuelType } from 'components/PriceCard';

export interface ChartData {
  fuel: string;
  prices: number[];
  label: string;
  color: string;
}

export const FuelConfig: Record<string, { label: string; color: string; apiKey: string }> = {
  '95': { label: 'petrol95', color: '#10B981', apiKey: '95' },
  '98': { label: 'petrol98', color: '#F59E0B', apiKey: '98' },
  D: { label: 'diesel', color: '#000000', apiKey: 'D' },
  EL: { label: 'electricity', color: '#3B82F6', apiKey: 'EL' },
};

interface FuelPriceData {
  data: {
    [key: string]: number;
  };
}

interface ElectricityData {
  data: {
    price: number[];
    time: string[];
  };
}

const STALE_TIME = 15 * 60000;
const CACHE_TIME = 60000 * 60;

const fetchFuelPrice = async (fuelType: FuelType): Promise<number> => {
  if (fuelType === 'EL') {
    const response = await fetch('https://www.err.ee/api/electricityMarketData/get');
    const result = (await response.json()) as ElectricityData[];

    const currentTime = new Date().toTimeString().slice(0, 5);
    const todayDataIndex = result[0].data.time.findIndex((timeRange: string) => {
      const startTime = timeRange.substring(0, 5);
      const endTime = timeRange.substring(8, 13);
      return currentTime >= startTime && currentTime <= endTime;
    });

    return todayDataIndex >= 0 ? result[0].data.price[todayDataIndex] || 0 : 0;
  }

  const response = await fetch('https://www.err.ee/api/gasPriceData/get');
  const result = (await response.json()) as FuelPriceData;
  return result.data[fuelType] || 0;
};

export const useFuelPrice = (fuelType: FuelType) => {
  return useQuery({
    queryKey: ['fuelPrice', fuelType],
    queryFn: () => fetchFuelPrice(fuelType),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  });
};

const fetchPricesHistory = async (
  fuelTypes: FuelType[] = ['95', '98', 'D']
): Promise<ChartData[]> => {
  const res = await fetch('https://hinnapox.marthaamer.ee/api/prices/30d');
  const json = await res.json();
  const fuelData = json.gas || [];

  if (!Array.isArray(fuelData) || fuelData.length === 0) return [];

  return fuelTypes
    .map((fuelType) => {
      const priceKey = `price_${fuelType.toLowerCase()}`;
      const prices = fuelData
        .map((item: any) => Number(item[priceKey]))
        .filter((v: number) => !isNaN(v) && v > 0);

      if (prices.length === 0) return null;

      const config = FuelConfig[fuelType];
      return { fuel: fuelType, prices, label: config.label, color: config.color } as ChartData;
    })
    .filter((item): item is ChartData => item !== null);
};

export const useFuelPricesHistory = (fuelTypes: FuelType[] = ['95', '98', 'D']) => {
  return useQuery({
    queryKey: ['pricesHistory', fuelTypes],
    queryFn: () => fetchPricesHistory(fuelTypes),
    staleTime: Infinity,
    gcTime: Infinity,
  });
}; //Robin on nox

const fetchElectricityHistory = async (): Promise<ChartData[]> => {
  const res = await fetch('https://hinnapox.marthaamer.ee/api/prices/30d');
  const json = await res.json();
  const elec = json.electricity || json.electricity_prices || json.el || json.data || [];

  if (!Array.isArray(elec) || elec.length === 0) return [];

  const prices = elec
    .map((item: any) => Number((item.avg_price / 10).toFixed(2)))
    .filter((v: number) => !isNaN(v) && v > 0);

  if (prices.length === 0) return [];

  const config = FuelConfig['EL'];
  return [{ fuel: 'EL', prices, label: config.label, color: config.color }];
};

export const useElectricityHistory = () => {
  return useQuery({
    queryKey: ['electricityHistory'],
    queryFn: fetchElectricityHistory,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
