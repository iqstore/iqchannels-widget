/* globals location */

export function qs (key) {
  key = key.replace(/[*+?^$.[]{}()|\\\/]/g, '\\$&'); // escape RegEx meta chars
  const match = location.search.match(new RegExp('[?&]' + key + '=([^&]+)(&|$)'));
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

export function getCookie (name) {
  const nameEQ = name + '=';
  for (let c of document.cookie.split('; ')) {
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function clearCookie (name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
}
