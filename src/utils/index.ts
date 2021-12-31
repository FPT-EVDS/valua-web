/* eslint-disable import/prefer-default-export */

interface JwToken {
  exp: number;
  iat: number;
  role: string;
  sub: string;
}

const chunk = <Type>(arr: Type[], size: number): Type[][] => {
  const result: Type[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    const arrayChunk = arr.slice(i, i + size);
    result.push(arrayChunk);
  }
  return result;
};

const parseJwt = (token: string): JwToken =>
  JSON.parse(atob(token.split('.')[1])) as JwToken;

function debounce<T extends unknown[], U>(
  callback: (...args: T) => PromiseLike<U> | U,
  wait: number,
) {
  let timer: number;

  return (...args: T): Promise<U> => {
    clearTimeout(timer);
    return new Promise(resolve => {
      timer = window.setTimeout(() => resolve(callback(...args)), wait);
    });
  };
}

export { chunk, debounce, parseJwt };
