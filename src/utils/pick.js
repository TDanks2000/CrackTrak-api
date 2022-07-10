export default function pick(items, keys) {
  if (Array.isArray(items)) {
    const filtered = [];

    for (const item of items) {
      const filter = {};

      for (const key of keys) {
        filter[key] = item[key];
      }
      filtered.push(filter);
    }

    return filtered;
  }

  const filtered = {};

  for (const key of keys) {
    filtered[key] = items[key];
  }

  return filtered;
}
