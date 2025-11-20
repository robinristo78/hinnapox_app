import { useQuery } from '@tanstack/react-query';
import { FuelType } from 'components/PriceCard';

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

const fetchFuelPrice = async (fuelType: FuelType): Promise<number> => {
  if (fuelType === 'EL') {
    const response = await fetch('https://www.err.ee/api/electricityMarketData/get');
    const result = (await response.json()) as ElectricityData[];

    const currentData = new Date();
    const currentTime =
      currentData.getHours() + ':' + currentData.getMinutes().toString().padStart(2, '0');

    const todayDataIndex = result[0].data.time.findIndex((timeRange: string) => {
      const startTime = timeRange.substring(0, 5);
      const endTime = timeRange.substring(8, 13);
      return currentTime >= startTime && currentTime <= endTime;
    });

    if (!todayDataIndex && todayDataIndex !== 0) {
      return 0;
    }

    return result[0].data.price[todayDataIndex] || 0;
  }

  const response = await fetch('https://www.err.ee/api/gasPriceData/get');
  const result = (await response.json()) as FuelPriceData;
  return result.data[fuelType] || 0;
};

export const useFuelPrice = (fuelType: FuelType) => {
  return useQuery({
    queryKey: ['fuelPrice', fuelType],
    queryFn: () => fetchFuelPrice(fuelType),
    staleTime: 60000,
    gcTime: 1000 * 60 * 60,
  });
};
