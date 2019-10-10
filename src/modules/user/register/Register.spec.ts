import { Connection } from "typeorm";
import faker from "faker";

import { testConnection } from "../../../test/testConnection";
import { gCall } from "../../../test/gCall";
import { User } from "../../../entity/User";

let conn: Connection;
beforeAll(async () => {
  conn = await testConnection();
});

afterAll(async () => {
  await conn.close();
});

const registerMutation = `
  mutation Register($data: RegisterInput!) {
    register(data: $data) {
      id
      firstName
      lastName
      email
      name
    }
  }
`;

describe("Test for the Register resolver", () => {
  it("Create user", async () => {
    const userTest = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: "gakjfFD238"
    };

    const response = await gCall({
      source: registerMutation,
      variableValues: {
        data: userTest
      }
    });

    expect(response).toMatchObject({
      data: {
        register: {
          firstName: userTest.firstName,
          lastName: userTest.lastName,
          email: userTest.email
        }
      }
    });

    const dbAccout = await User.findOne({ where: { email: userTest.email } }); // execute the account from mock db
    expect(dbAccout).toBeDefined();
    expect(dbAccout!.confirmed).toBeFalsy();
  });
});
