export function getPyramidRows(totalCups: number): number[] {
  if (totalCups <= 0) return [];
  
  let r = 1;
  while (r * (r + 1) / 2 < totalCups) {
    r++;
  }
  
  let remaining = totalCups;
  const rows: number[] = [];
  let currentRowCapacity = r;
  
  while (remaining > 0) {
    const take = Math.min(remaining, currentRowCapacity);
    rows.push(take);
    remaining -= take;
    currentRowCapacity--;
  }
  
  return rows;
}
