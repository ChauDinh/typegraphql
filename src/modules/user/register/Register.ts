import { Resolver, Query, Mutation, Arg, UseMiddleware } from "type-graphql";
import bcrypt from "bcryptjs";

import { User } from "../../../entity/User";
import { RegisterInput } from "./RegisterInput";
import { isAuth } from "../../../middleware/isAuth";
import { sendEmail } from "../../../utils/sendEmail";
import { createConfirmationUrl } from "../../../utils/createConfirmationUrl";

@Resolver()
export class RegisterResolver {
  @UseMiddleware(isAuth)
  @Query(() => String)
  async hello() {
    return "hello, world!";
  }

  @Mutation(() => User)
  async register(@Arg("data")
  {
    firstName,
    lastName,
    email,
    password
  }: RegisterInput): Promise<User> {
    // hashing password
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    }).save();

    await sendEmail(email, await createConfirmationUrl(user.id));
    return user;
  }
}
