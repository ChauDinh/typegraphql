import { Connection } from "typeorm";
import faker from "faker";

import { testConnection } from "../../test/testConnection";
import { gCall } from "../../test/gCall";
import { User } from "../../entity/User";

let conn: Connection;
beforeAll(async () => {
  conn = await testConnection();
});

afterAll(async () => {
  await conn.close();
});

const meQuery = `
  {
    me {
      id
      firstName
      lastName
      email
      name
    }
  }
`;

describe("Test for the Me query", () => {
  it("get user information", async () => {
    const userTest = await User.create({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: "ghjkD83"
    }).save();

    const response = await gCall({
      source: meQuery,
      userId: userTest.id
    });
    expect(response).toMatchObject({
      data: {
        me: {
          firstName: userTest.firstName,
          lastName: userTest.lastName,
          email: userTest.email,
          id: `${userTest.id}`
        }
      }
    });
  });

  it("return null", async () => {
    const response = await gCall({
      source: meQuery
    });
    expect(response).toMatchObject({
      data: {
        me: null
      }
    });
  });
});
