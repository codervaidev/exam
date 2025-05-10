import { formatInTimeZone } from "date-fns-tz";

const tz = "Asia/Dhaka";

export function formatNumber(number: number): string {
  return Intl.NumberFormat("bn-BD").format(number);
}

export const formatTime = (time: string) => {
  return formatInTimeZone(time, tz, "dd MMM yyyy hh:mm:ss a");
};

export const formatDate = (time: string) => {
  return formatInTimeZone(time, tz, "dd MMM yyyy hh:mm:ss a");
};

export const dateFieldFormat = (date: string) => {
  if (!date) {
    return null;
  }

  return formatInTimeZone(date, tz, "yyyy-MM-dd'T'HH:mm") || null;
};

export const millisecToTime = (millis: number, duration) => {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
};

export const inputFormat = (date: string) => {
  return formatInTimeZone(date, tz, "yyyy-MM-dd'T'HH:mm") || null;
};
