import { createApp } from "../server.js";
import request from "supertest";
import { testSignIn } from "./signin.js";

const app = createApp();

describe("Get categories without auth", () => {
  it("Return unauthorized status code 401", async () => {
    return request(app).get("/api/categories").send().expect(401);
  });
});

describe("Get categories with unrecognized userId", () => {
  it("Return bad request status code 400", async () => {
    return request(app)
      .get("/api/categories")
      .query({ userId: "fake-user-id" })
      .send()
      .expect(401);
  });
});

describe("Get categories with correct userId and auth", () => {
  it("Return OK status code 200", async () => {
    const { token, id: userId } = await testSignIn();

    return request(app)
      .get("/api/categories")
      .set("Authorization", `Bearer ${token}`)
      .query({ userId: userId })
      .send()
      .expect(200);
  });
});

describe("Patch category without auth", () => {
  it("Return unauthorized status code 401", async () => {
    return request(app)
      .patch("/api/categories/fake-data-id")
      .send()
      .expect(401);
  });
});

describe("Patch category without sending new updated values", () => {
  it("Return bad request status code 400", async () => {
    const { token } = await testSignIn();

    return request(app)
      .patch("/api/categories/fake-category-id")
      .set("Authorization", `Bearer ${token}`)
      .send()
      .expect(400);
  });
});
