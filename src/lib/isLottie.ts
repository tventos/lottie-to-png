export const isLottie = (data: string) => {
  try {
    const json = JSON.parse(data);

    return Object.prototype.hasOwnProperty.call(json, "op");
  } catch {
    return false;
  }
};
