export function Exception(e) {
  return { e, data: e.data && e.data.errors && e.data.errors };
}
