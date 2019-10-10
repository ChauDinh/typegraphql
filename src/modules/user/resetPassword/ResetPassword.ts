import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import bcrypt from "bcryptjs";

import { User } from "../../../entity/User";
import { redis } from "../../../redis";
import { forgotPasswordPrefix } from "../../../constants/redisPrefixes";
import { ResetPasswordInput } from "./ResetPasswordInput";
import { MyContext } from "../../../types/MyContext";

@Resolver()
export class ResetPasswordResolver {
  @Mutation(() => User, { nullable: true })
  async resetPassword(
    @Arg("data")
    { token, password }: ResetPasswordInput,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const userId = await redis.get(forgotPasswordPrefix + token);

    if (!userId) {
      return null;
    }

    const user = await User.findOne(userId);

    if (!user) {
      return null;
    }

    await redis.del(forgotPasswordPrefix + token);

    user.password = await bcrypt.hash(password, 12);
    await user.save();

    ctx.req.session!.userId = user.id;

    return user;
  }
}
