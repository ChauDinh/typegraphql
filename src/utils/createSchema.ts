import { buildSchema } from "type-graphql";

import { RegisterResolver } from "../modules/user/Register";
import { LoginResolver } from "../modules/user/Login";
import { LogoutResolver } from "../modules/user/Logout";
import { MeResolver } from "../modules/user/Me";
import { ForgotPasswordResolver } from "../modules/user/ForgotPassword";
import { ConfirmRegisterResolver } from "../modules/user/ConfirmRegister";
import { ResetPasswordResolver } from "../modules/user/ResetPassword";
import {
  CreateUserResolver,
  CreateProductResolver
} from "../modules/user/CreateUser";

export const createSchema = () =>
  buildSchema({
    resolvers: [
      RegisterResolver,
      LoginResolver,
      LogoutResolver,
      MeResolver,
      ForgotPasswordResolver,
      ResetPasswordResolver,
      ConfirmRegisterResolver,
      CreateUserResolver,
      CreateProductResolver
    ],
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId;
    }
  });
