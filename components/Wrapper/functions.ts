export function isValidURL(possibleURL: string) {
  if (!possibleURL || typeof possibleURL !== 'string') {
    return false;
  }

  try {
    new URL(possibleURL);

    return true;
  } catch {
    return false;
  }
}
