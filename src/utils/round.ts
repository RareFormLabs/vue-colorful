export const round = (number: number, digits = 0): number => {
  const scale = 10 ** digits;
  return Math.round(number * scale) / scale;
};
