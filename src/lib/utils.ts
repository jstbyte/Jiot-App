export function msToTime(ms: number) {
  // Pad to 2 or 3 digits, default is 2
  const pad = (n: number, z?: number) => {
    z = z || 2;
    return ('00' + n).slice(-z);
  };

  let _ms = ms % 1000;
  ms = (ms - _ms) / 1000;
  let secs = ms % 60;
  ms = (ms - secs) / 60;
  let mins = ms % 60;
  let hrs = (ms - mins) / 60;
  return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
}

export async function fetchWithTimeout(resource: string, options = {}) {
  // @ts-ignore
  const { timeout = 8000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
}

export const mqttTopicRegex = (topic: string) => {
  return (
    topic
      .replaceAll('+', String.raw`[^\/][^\/]*\/?`)
      .replaceAll('#', String.raw`[\s\S][\s\S]*`) + '$'
  );
};

export function uuid() {
  var chars = '0123456789abcdef'.split('');

  var uuid = [],
    rnd = Math.random,
    r;
  uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
  uuid[14] = '4'; // version 4

  for (var i = 0; i < 36; i++) {
    if (!uuid[i]) {
      r = 0 | (rnd() * 16);

      uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r & 0xf];
    }
  }

  return uuid.join('');
}

export function getUnique(arr: Array<any>, key: string) {
  return (
    arr
      .map((e) => e[key])

      // store the keys of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)

      // eliminate the dead keys & store unique objects
      .filter((e) => arr[e as number])
      .map((e) => arr[e as number])
  );
}

export function isDarkMode() {
  const mode = window.matchMedia('(prefers-color-scheme: dark)');
  return mode.matches;
}
