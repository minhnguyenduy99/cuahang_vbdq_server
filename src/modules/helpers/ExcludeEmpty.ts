
export default function ExcludeEmpty(val: any): any {
  Object.keys(val).forEach(key => val[key] === undefined && delete val[key]);
  return val;
}