

export default function StringToNumber(val: any): number {
  if (typeof val === "string") {
    return parseInt(val);
  }
  return val;
}