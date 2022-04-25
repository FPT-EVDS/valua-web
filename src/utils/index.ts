/* eslint-disable import/prefer-default-export */

import { format } from 'date-fns';

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

const convertDateToMinutes = (date: Date): number => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return hours * 60 + minutes;
};

const convertMinutesToDate = (minutes: number): Date => {
  const minutesValue = minutes % 60;
  const hours = (minutes - minutesValue) / 60;
  return new Date(0, 0, 0, hours, minutesValue);
};

const formatTime = (date: Date) => format(date, 'HH:mm');

export {
  chunk,
  convertDateToMinutes,
  convertMinutesToDate,
  debounce,
  formatTime,
  parseJwt,
};
