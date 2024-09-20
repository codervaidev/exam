import { fromZonedTime } from "date-fns-tz";
const tz = "Asia/Dhaka";
export const formatDate = (date: string) => {
  let time = fromZonedTime(date, tz);
  return new Date(time);
};
