# TypeGraphQL series

This repo is my practice typescript and graphql along with other stuffs.

## What we will cover?

- setup type-graphql: how we can setup a type-graphql server

- register resolver: how we can create register and validate user input, throw errors back to user.

- login resolver: how we can know whether user login

- authorization/middleware: protect a row/query for just login user

- confirm email: sending an email to user to confirm account.

- forgot/change password: reset password in database (I use PostgreSQL)

- higher order resolvers: writing programmatically typegraphql resolvers as functions basically (for resuse)

### Setup type-graphql server

This project I use `yarn` as a package management. You can use `npm` if you like. Then I install a few things for Apollo Server Express.

```
yarn add apollo-server-express express graphql reflect-metadata type-graphql
```

We need `reflec-metadata` since it is a library that we need for type-graphql. We also need the type versions (as we use Typescript) for those libraries

```
yarn add -D @types/express @types/graphql @types/node typescript nodemon ts-node
```

Here are what we need, if you have any trouble, please check the official site of `type-graphql` first: [Installation](https://typegraphql.ml/docs/installation.html)

Then, we need create a `tsconfig.json` file for typescript know how to compile our code. I use this config: [tsconfig.json (Ben Awad)](https://github.com/benawad/monorepo-boilerplate/blob/9257937fa169d8cb2ee036d94b08ae9aee8072d1/packages/server/tsconfig.json) and change a little bit, you can check the `tsconfig.json` in my github for this project as well.

```typescript
import { ApolloServer } from "apollo-server-express";
import * as Express from "express";
import { buildSchema, Resolver, Query } from "type-graphql";

@Resolver()
class HelloResolver {
  @Query(() => String)
  async hello() {
    return "hello, world";
  }
}

const main = async () => {
  const schema = await buildSchema({
    resolvers: [HelloResolver]
  });
  const apolloServer = new ApolloServer({ schema });

  const app = Express();

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () =>
    console.log("server started on http://localhost:4000")
  );
};

main();
```
