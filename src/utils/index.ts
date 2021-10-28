/* eslint-disable import/prefer-default-export */

const chunk = <Type>(arr: Type[], size: number): Type[][] => {
  const result: Type[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    const arrayChunk = arr.slice(i, i + size);
    result.push(arrayChunk);
  }
  return result;
};

export { chunk };
