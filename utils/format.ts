import moment from "moment";

export const formatTime = (time: string) => {
  return moment(time).format("DD, MMMM YYYY, h:mm:ss a");
};
export const formatDate = (time: string) => {
  return moment(time).format("DD, MMMM YYYY, h:mm:ss a");
};
