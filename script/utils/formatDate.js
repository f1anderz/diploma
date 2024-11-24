export function formatDate(date) {
  const year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDay();

  if (month < 10) {
    month = `0${month}`;
  }

  if (day < 10) {
    day = `0${day}`;
  }

  return `${year}.${month}.${day}`;
}