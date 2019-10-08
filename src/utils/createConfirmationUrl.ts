/**
 * This function takes an userid and would return a token and this token is going to be associated with userid.
 * Then when the user click on the link we sent that token to our server and verify
 */

import { v4 } from "uuid";
import { redis } from "../redis";

export const createConfirmationUrl = async (userId: number) => {
  const token = v4();
  await redis.set(token, userId, "ex", 60 * 60 * 24); // 1 day expiration

  return `http://localhost:3000/user/confirm/${token}`;
};
