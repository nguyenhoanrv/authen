const jwt = require('jsonwebtoken');

export const generateToken = (user, secretSignature, tokenLife) => {
  return new Promise((resolve, reject) => {
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    jwt.sign(
      { data: userData },
      secretSignature,
      {
        algorithm: 'HS256',
        expiresIn: tokenLife,
      },
      (error, token) => {
        if (error) return reject(error);
        resolve(token);
      },
    );
  });
};
export const generateRefreshToken = (
  id,
  secretSignature,
  tokenLife,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const userId = {
      id,
    };
    jwt.sign(
      { data: userId },
      secretSignature,
      {
        algorithm: 'HS256',
        expiresIn: tokenLife,
      },
      (error, token) => {
        if (error) return reject(error);
        resolve(token);
      },
    );
  });
};
export const verifyToken = (token, secretKey): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decode) => {
      if (error) return reject(error);
      resolve(decode);
    });
  });
};
