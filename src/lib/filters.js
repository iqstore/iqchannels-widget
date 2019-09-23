export function humanDate (value) {
  const now = new Date();
  if (now.getFullYear() !== value.getFullYear() || now.getMonth() !== value.getMonth()) {
    return formatDate(value);
  }
  const daysDelta = now.getDate() - value.getDate();
  switch (daysDelta) {
    case 0:
      return 'Сегодня';
    case 1:
      return 'Вчера';
    default:
      return formatDate(value);
  }
}

function formatDate (value) {
  const day = value.getDate();
  const month = value.getMonth();
  const year = value.getFullYear();

  let result = `${day}`;

  switch (month) {
    case 0: result += ' января'; break;
    case 1: result += ' февраля'; break;
    case 2: result += ' марта'; break;
    case 3: result += ' апреля'; break;
    case 4: result += ' мая'; break;
    case 5: result += ' июня'; break;
    case 6: result += ' июля'; break;
    case 7: result += ' августа'; break;
    case 8: result += ' сентября'; break;
    case 9: result += ' октября'; break;
    case 10: result += ' ноября'; break;
    case 11: result += ' декабря'; break;
  }

  if (new Date().getFullYear() !== year) {
    result += ` ${year}`;
  }

  return result;
}

export function humanSize (value) {
  let size = parseFloat(value);
  let unit = 0;

  while (size > 1000) {
    unit++;
    size /= 1024;
  }
  size = Math.floor(size);

  switch (unit) {
    case 0:
      return `${size} байт`;
    case 1:
      return `${size} кб`;
    case 2:
      return `${size} мб`;
    case 3:
      return `${size} гб`;
    case 4:
      return `${size} тб`;
    case 5:
      return `${size} пб`;
    default:
      // Really? :)
      return `???`;
  }
}
