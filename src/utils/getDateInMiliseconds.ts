//converts the date from format served by API and returns a number of miliseconds.

const getDateInMiliseconds = (dateString: string): number => {
  console.log(dateString);
  if (!dateString) {
    return 0;
  }
  const months = [
    'januar',
    'februar',
    'mars',
    'april',
    'mai',
    'juni',
    'juli',
    'august',
    'september',
    'oktober',
    'november',
    'desember',
  ];
  const articleDateArray = dateString.split(' ');
  const day: string = articleDateArray[0].slice(0, -1);
  const month: number =
    months.findIndex(
      (name) => name.toLowerCase() === articleDateArray[1].toLowerCase(),
    ) + 1;
  const year: string = articleDateArray[2];
  return Number(new Date(`${month} ${day} ${year}`));
};
export default getDateInMiliseconds;
