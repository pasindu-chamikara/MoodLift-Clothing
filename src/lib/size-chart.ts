export interface SizeChartEntry {
  size: string;
  shoulder: number;
  chest: number;
}

export const clothingSizeChart: SizeChartEntry[] = [
  { size: 'S', shoulder: 17, chest: 35 },
  { size: 'M', shoulder: 19, chest: 38 },
  { size: 'L', shoulder: 20, chest: 40 },
  { size: 'XL', shoulder: 21, chest: 42 },
  { size: '2XL', shoulder: 22, chest: 45 },
  { size: '3XL', shoulder: 22.5, chest: 47 },
];

export function determineSize(shoulderInches: number, chestInches: number): string {
  if (shoulderInches <= 0 || chestInches <= 0) return '-';

  // Find the first size that is large enough for both measurements
  for (const entry of clothingSizeChart) {
    // Adding a small tolerance of 0.5 inches
    if (shoulderInches <= entry.shoulder + 0.5 && chestInches <= entry.chest + 0.5) {
      return entry.size;
    }
  }
  
  // If no size is large enough, return closest or max
  let recommendedSize = clothingSizeChart[clothingSizeChart.length - 1].size;
  let minDiff = Infinity;

  for (const entry of clothingSizeChart) {
    const diff = Math.abs(entry.shoulder - shoulderInches) + Math.abs(entry.chest - chestInches);
    if (diff < minDiff) {
      minDiff = diff;
      recommendedSize = entry.size;
    }
  }
  
  return recommendedSize;
}
