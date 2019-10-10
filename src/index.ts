import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { createConnection } from "typeorm";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import { RedisClient } from "redis";
import {
  getComplexity,
  simpleEstimator,
  fieldConfigEstimator
} from "graphql-query-complexity";
import { separateOperations } from "graphql";

import { redis } from "./redis";
import { createSchema } from "./utils/createSchema";

const main = async () => {
  // Create connection
  await createConnection(); // will read from the orm config and use these setting to make database connection

  const schema = await createSchema();
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({ req, res }),
    plugins: [
      {
        requestDidStart: () => ({
          didResolveOperation({ request, document }) {
            /**
             * This provides GraphQL query analysis to be able to react on complex queries to your GraphQL server.
             * This can be used to protect your GraphQL servers against resource exhaustion and DoS attacks.
             * More documentation can be found at https://github.com/ivome/graphql-query-complexity.
             */
            const complexity = getComplexity({
              // Our built schema
              schema,
              // To calculate query complexity properly,
              // we have to check if the document contains multiple operations
              // and eventually extract it operation from the whole query document.
              query: request.operationName
                ? separateOperations(document)[request.operationName]
                : document,
              // The variables for our GraphQL query
              variables: request.variables,
              // Add any number of estimators. The estimators are invoked in order, the first
              // numeric value that is being returned by an estimator is used as the field complexity.
              // If no estimator returns a value, an exception is raised.
              estimators: [
                // Using fieldConfigEstimator is mandatory to make it work with type-graphql.
                fieldConfigEstimator(),
                // Add more estimators here...
                // This will assign each field a complexity of 1
                // if no other estimator returned a value.
                simpleEstimator({ defaultComplexity: 1 })
              ]
            });
            // Here we can react to the calculated complexity,
            // like compare it with max and throw error when the threshold is reached.
            if (complexity >= 10) {
              throw new Error(
                `Sorry, too complicated query! ${complexity} is over 10 that is the max allowed complexity.`
              );
            }
            // And here we can e.g. subtract the complexity point from hourly API calls limit.
            console.log("Used query complexity points:", complexity);
          }
        })
      }
    ]
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

  app.listen(4000, () => {
    console.log("server started on http://localhost:4000/graphql");
  });
};

main();
