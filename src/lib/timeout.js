/**
 * Returns timeout in milliseconds
 * @return {number}
 */
export function retryTimeout (attempt) {
  switch (attempt) {
    case 0:
    case 1:
      return 1000;
    case 2:
      return 2000;
    case 3:
      return 5000;
    case 4:
      return 10000;
    case 5:
      return 15000;
    case 6:
      return 20000;
    default:
      return 30000;
  }
}
