import { Resolver, InputType, Field } from "type-graphql";
import { User } from "../../entity/User";
import { RegisterInput } from "./register/RegisterInput";
import { createBaseResolver } from "../baseResolvers/CreateBaseResolver";
import { Product } from "../../entity/Product";

@InputType()
class ProductInput {
  @Field()
  name: string;
}

const BaseCreateUser = createBaseResolver("User", User, RegisterInput, User);
const BaseCreateProduct = createBaseResolver(
  "Product",
  Product,
  ProductInput,
  Product
);

@Resolver()
export class CreateUserResolver extends BaseCreateUser {}

@Resolver()
export class CreateProductResolver extends BaseCreateProduct {}
