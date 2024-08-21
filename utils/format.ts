import moment from "moment";

export const formatTime = (time: string) => {
  return moment(time).format("DD MMMM YYYY, h:mm:ss a");
};
export const formatDate = (time: string) => {
  return moment(time).format("DD MMMM YYYY, h:mm:ss a");
};

export const dateFieldFormat = (date: string) => {
  if (!date) {
    return null;
  }

  return (
    new Date(new Date(date).getTime() + 6 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16) || null
  );
};

export const millisecToTime = (millis, duration) => {
  if (millis > duration) {
    millis = duration;
  }

  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
};
