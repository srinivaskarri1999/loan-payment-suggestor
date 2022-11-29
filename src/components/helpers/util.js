export const monthsDifference = (startDate, endDate) => {
  startDate = new Date(startDate)
  endDate = new Date(endDate)
  return (
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    endDate.getMonth() -
    startDate.getMonth()
  )
}

export const monthsIncrease = (date, months) => {
  const newDate = new Date(date)
  newDate.setMonth(newDate.getMonth() + months)
  return newDate
}

export const roundTwoDecimals = (num) => {
  return Math.round((num + Number.EPSILON) * 100) / 100
}