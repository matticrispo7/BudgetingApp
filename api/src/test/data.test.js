import { createApp } from "../server.js";
import request from "supertest";
import { testSignIn } from "./signin.js";

const app = createApp();

describe("Get data without auth", () => {
  it("Return unauthorized status code 401", async () => {
    return request(app).get("/api/data").send().expect(401);
  });
});

describe("Patch data without auth", () => {
  it("Return unauthorized status code 401", async () => {
    return request(app).patch("/api/data/fake-data-id").send().expect(401);
  });
});

describe("Patch data without sending new updated values", () => {
  it("Return bad request status code 400", async () => {
    const { token } = await testSignIn();

    return request(app)
      .patch("/api/data/fake-data-id")
      .set("Authorization", `Bearer ${token}`)
      .send()
      .expect(400);
  });
});

/*describe("Create new data with correct values", () => {
  it("Return created request status code 201", async () => {
    const { token, id: userId } = await testSignIn();

    const new_data = {
      description: "test_data",
      category: "TestCategory",
      total: 1,
      userId: userId,
      timestamp: new Date().getTime(),
    };

    return request(app)
      .post("/api/data")
      .set("Authorization", `Bearer ${token}`)
      .send(new_data)
      .expect(201);
  });
});
*/
