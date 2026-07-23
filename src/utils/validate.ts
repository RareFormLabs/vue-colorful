const matcher = /^#?([0-9A-F]{3,8})$/i;

export const validHex = (value?: string | null, alpha?: boolean): boolean => {
  const match = matcher.exec(value || "");
  const length = match ? match[1].length : 0;

  return (
    length === 3 ||
    length === 6 ||
    (!!alpha && length === 4) ||
    (!!alpha && length === 8)
  );
};
