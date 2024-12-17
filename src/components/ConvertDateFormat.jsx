export function convertDateFormat(inputDate, dateType) {
  console.log("inputDate  -> ", !inputDate);
  console.log("dateType ->", dateType);
  if (!inputDate && dateType === "endDate") {
    return "2060-01-01 00:00:00.000";
  }

  if (!inputDate && dateType === "startDate") {
    return "1970-01-01 00:00:00.000";
  }

  const date = new Date(inputDate);
  const year = date.getUTCFullYear();
  const month = `0${date.getUTCMonth() + 1}`.slice(-2);
  const day = `0${date.getUTCDate()}`.slice(-2);
  const hours = `0${date.getUTCHours()}`.slice(-2);
  const minutes = `0${date.getUTCMinutes()}`.slice(-2);
  const seconds = `0${date.getUTCSeconds()}`.slice(-2);
  const milliseconds = `00${date.getUTCMilliseconds()}`.slice(-3);

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}
