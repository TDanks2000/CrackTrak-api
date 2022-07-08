export default async function tryToCatch(fn) {
  let result = null;
  try {
    result = await fn();
  } catch (error) {
    return [result, error];
  }
  return [result, null];
}
