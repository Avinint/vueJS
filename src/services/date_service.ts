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
