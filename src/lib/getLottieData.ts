export const getLottieData = async (lottieData: { op: number; ip: number }) => {
  return {
    frames: lottieData.op - lottieData.ip,
  };
};
