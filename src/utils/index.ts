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

export { chunk, parseJwt };
