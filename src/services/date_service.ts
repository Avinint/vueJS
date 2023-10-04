export function f0(number: number) {
  if(number < 10)
    return `0${number}`;
  return number;
}

export function getCreneauDuration(
  start_time: string,
  end_time: string
): number {
  const start_date = new Date(`01/01/1970 ${start_time}`)
  const end_date = new Date(`01/01/1970 ${end_time}`)
  return (Math.abs(end_date.getTime() - start_date.getTime()) / 36e5) * 60
}

export function getWeekNumber(date: string) {
  var d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
  var week1 = new Date(d.getFullYear(), 0, 4)
  return (
    1 +
    Math.round(
      ((d.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  )
}

export function getDateStringHour(date_string: string, symbol: string = ':'): string {
  const date = new Date(date_string);
  return `${f0(date.getHours())}${symbol}${f0(date.getMinutes())}`;
}

export function getDateDMY(date_string: string) {
  const date = new Date(date_string);
  return `${f0(date.getDate())}/${f0(date.getMonth())}/${f0(date.getFullYear())}`
}

export function getDateDM(date_string: string) {
  const date = new Date(date_string);
  return `${f0(date.getDate())}/${f0(date.getMonth())}`
}

const months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre" ]
export const weekDays = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']


export function frenchTodayDate(date_string: string) {
  let today = new Date(date_string);
  let year = today.getFullYear()
  let dayNumber = today.getDate()
  let month = months[today.getMonth()]
  let weekday = today.toLocaleDateString("fr-FR", {weekday: "long"});

  return {weekday, dayNumber, month, year}
}

export function getDateYMD(date_string: string) {
  const date = new Date(date_string);
  return `${f0(date.getFullYear())}-${f0(date.getMonth())}-${f0(date.getDate())}`
}

export function parseDateToInput(date: Date) {
  return `${f0(date.getDate())}-${f0(date.getMonth() + 1)}-${f0(date.getFullYear())}`
}

export function extractHour(date: Date) {
  return `${f0(date.getHours())}:${f0(date.getMinutes())}`;
}

export function getDateForInput(date_string: string) {
  const date = new Date(date_string);
  return `${f0(date.getDate())} / ${f0(date.getMonth())} / ${f0(date.getFullYear())}`;
}