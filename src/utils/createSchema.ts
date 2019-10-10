import { buildSchema } from "type-graphql";

import { RegisterResolver } from "../modules/user/register/Register";
import { LoginResolver } from "../modules/user/login/Login";
import { LogoutResolver } from "../modules/user/login/Logout";
import { MeResolver } from "../modules/user/me/Me";
import { ForgotPasswordResolver } from "../modules/user/resetPassword/ForgotPassword";
import { ConfirmRegisterResolver } from "../modules/user/register/ConfirmRegister";
import { ResetPasswordResolver } from "../modules/user/resetPassword/ResetPassword";
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
