

export function genFullUrl(partialUrl: string | null) {
  if (partialUrl) {
    return `http://localhost:3000/${partialUrl}`;
  }
  return null;
}
