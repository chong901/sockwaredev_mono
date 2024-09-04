export const getTimeUntilArrival = (estimatedArrival?: string) => {
  if (!estimatedArrival) return "";
  const arrivalDate = new Date(estimatedArrival);
  const currentDate = new Date();

  const timeDifference = arrivalDate.getTime() - currentDate.getTime();

  if (timeDifference <= 60 * 1000) {
    return "Arr";
  }

  const minutes = Math.floor(timeDifference / (1000 * 60));

  return `${minutes}`;
};
