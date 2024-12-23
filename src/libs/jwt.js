import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()

export async function createAccessToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, process.env.TOKEN_SECRET || "secret", { expiresIn: "1d" }, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
}

export async function createResetToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, process.env.TOKEN_SECRET || "secret", { expiresIn: "40m" }, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
}

