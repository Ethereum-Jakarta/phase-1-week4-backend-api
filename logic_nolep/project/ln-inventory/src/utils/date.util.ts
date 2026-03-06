export function generatedExpDate(num: number) {
  const date = new Date();
  date.setDate(date.getDate() + num);
  return date;
}
