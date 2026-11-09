/* Small date helpers. The demo is pinned to a fixed "today" so the fictional timetable always lines up. */

export const D = (y: number, m: number, d: number) => new Date(y, m - 1, d);

export const dkey = (d: Date) =>
  d.getFullYear() +
  "-" +
  String(d.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(d.getDate()).padStart(2, "0");

export const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

export const mondayOf = (d: Date) => {
  const x = new Date(d);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  x.setHours(0, 0, 0, 0);
  return x;
};

export const parseK = (k: string) => {
  const a = k.split("-").map(Number);
  return new Date(a[0], a[1] - 1, a[2]);
};

export const TODAY = D(2026, 11, 7);

export const tf = (t: string) => {
  const [h0, m] = t.split(":").map(Number);
  const ap = h0 >= 12 ? "pm" : "am";
  const h = h0 % 12 || 12;
  return h + (m ? ":" + String(m).padStart(2, "0") : "") + " " + ap;
};

export const DAYN = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const MON = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
