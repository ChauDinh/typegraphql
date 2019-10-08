import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import { RedisClient } from "redis";

import { RegisterResolver } from "./modules/user/Register";
import { redis } from "./redis";
import { LoginResolver } from "./modules/user/Login";
import { MeResolver } from "./modules/user/Me";

const main = async () => {
  // Create connection
  await createConnection(); // will read from the orm config and use these setting to make database connection

  const schema = await buildSchema({
    resolvers: [MeResolver, RegisterResolver, LoginResolver]
  });
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }: any) => ({ req })
  });

  const app = Express();
  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000"
    })
  );

  // Session middleware
  const RedisStore = connectRedis(session); // connect node.req.session to redis backing store
  const sessionOption: session.SessionOptions = {
    store: new RedisStore({
      client: (redis as any) as RedisClient
    }),
    name: "this",
    secret: "sdfgh34567",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7 * 365 // 7 years
    }
  };
  app.use(session(sessionOption));

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () =>
    console.log("server started on http://localhost:4000/graphql")
  );
};

main();
