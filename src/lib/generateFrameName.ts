export const generateFrameName = (name: string | undefined, index: number) => {
  const number = `${index}`.padStart(3, "000");

  return `${name}-${number}`;
};
