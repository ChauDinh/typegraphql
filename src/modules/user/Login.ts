import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import bcrypt from "bcryptjs";
import { User } from "../../entity/User";
import { MyContext } from "src/types/MyContext";

@Resolver()
export class LoginResolver {
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    // Check email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return null;
    }

    // Compare to password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return null;
    }

    // Confirm register user
    if (!user.confirmed) {
      return null;
    }

    ctx.req.session!.userId = user.id;

    return user;
  }
}
