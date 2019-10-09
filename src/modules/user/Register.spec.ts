import { Connection } from "typeorm";

import { testConnection } from "../../test/testConnection";
import { gCall } from "../../test/gCall";

let conn: Connection;
beforeAll(async () => {
  conn = await testConnection();
});

afterAll(() => {
  conn.close();
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
    console.log(
      await gCall({
        source: registerMutation,
        variableValues: {
          data: {
            firstName: "tran",
            lastName: "dan",
            email: "tientrivutru@gmail.com",
            password: "Katetsui1995"
          }
        }
      })
    );
  });
});
