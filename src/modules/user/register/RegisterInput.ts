import { InputType, Field } from "type-graphql";
import { Length, IsEmail } from "class-validator";
import { IsEmailAlreadyExist } from "./isEmailAlreadyExist";
import { IsPasswordValid } from "./isPasswordValid";

@InputType()
export class RegisterInput {
  @Field()
  @Length(1, 30)
  firstName: string;

  @Field()
  @Length(1, 30)
  lastName: string;

  @Field()
  @IsEmail()
  @IsEmailAlreadyExist({ message: "email is already in used!" })
  email: string;

  @Field()
  @Length(6, 30)
  @IsPasswordValid({
    message: "password must have at least an uppercase character and a number!"
  })
  password: string;
}
