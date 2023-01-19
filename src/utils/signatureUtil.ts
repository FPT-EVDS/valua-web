import sha256 from 'crypto-js/sha256';

const generateSignature = (...inputs: any): string => {
  let message = '';
  for (let input in inputs) {
    message += input;
  }
  return sha256(message).toString();
};

export {
  generateSignature,
};
