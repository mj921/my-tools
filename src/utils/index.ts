export const addZero = (val: number, count = 2) =>
  (new Array(count).fill('0').join('') + val).slice(-count);

export const isUndefined = (val: any) => typeof val === 'undefined';

export const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

export const copyTextToClipboard = (text: string, cb?: () => void) => {
  try {
    navigator.clipboard
      .writeText(text)
      .then(function () {
        cb?.();
      })
      .catch(function () {
        fallbackCopyTextToClipboard(text);
      });
  } catch (err) {
    fallbackCopyTextToClipboard(text);
  }
};

const fallbackCopyTextToClipboard = (text: string, cb?: () => void) => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-100000px';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      cb?.();
    }
  } catch (err) {
    /* empty */
  }
  document.body.removeChild(textarea);
};

export const generateUuid = () =>
  'xxxxxxxx-xxxx-xxxx-xxxx-xxxxx'.replace(/x/g, () => ((Math.random() * 16) | 0).toString(16)) +
  Date.now().toString(16);
