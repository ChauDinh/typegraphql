import { InputType, Field } from "type-graphql";
import { Length } from "class-validator";

import { IsPasswordValid } from "../isPasswordValid";

@InputType()
export class ResetPasswordInput {
  @Field()
  token: string;

  @Field()
  @Length(6, 30)
  @IsPasswordValid({
    message: "password must have at least an uppercase character and a number!"
  })
  password: string;
}
