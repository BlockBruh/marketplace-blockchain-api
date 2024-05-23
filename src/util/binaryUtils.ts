const hexRegex = /[0-9A-Fa-f]+/;

export const strip0x = (address) => {
  return address.startsWith('0x') ? address.substring(2) : address;
};

export const isHexString = (string) => {
  const hex = strip0x(string);
  return hexRegex.test(hex);
};

export const getRandomString = () => {
  return Math.round(Math.random() * 36 ** 12).toString(36);
};

export const getRandomHex = () => {
  return Math.round(Math.random() * 36 ** 12).toString(16);
};

export const getRandomNumber = () => {
  return Math.round(Math.random() * 100);
};

export const addressEquals = (addres1, addres2) => {
  return strip0x(addres1).toLowerCase() === strip0x(addres2).toLowerCase();
};
