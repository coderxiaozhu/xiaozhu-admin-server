import { nanoid } from "nanoid";
// const { nanoid } from 'nanoid'

export const uuid = () => {
  return nanoid()
}

export const generateRandomCode = () => {
  return Math.floor(Math.random() * 9000) + 1000;
};
