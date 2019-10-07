import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { RegisterResolver } from "./modules/user/Register";

const main = async () => {
  // Create connection
  await createConnection(); // will read from the orm config and use these setting to make database connection

  const schema = await buildSchema({
    resolvers: [RegisterResolver]
  });
  const apolloServer = new ApolloServer({ schema });

  const app = Express();

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () =>
    console.log("server started on http://localhost:4000/graphql")
  );
};

main();
