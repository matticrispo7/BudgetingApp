import { createApp } from "../server.js";
import request from "supertest";
import dotenv from "dotenv";
const app = createApp();
dotenv.config();

describe("Test signup with missing or invalid credentials", () => {
  it("Expect a 401 status code", async () => {
    const test_user = {
      email: "test@test.com",
      password: "test",
    };

    return request(app).post("/api/users/signup").send(test_user).expect(400);
  });
});

/* describe("Test signup with correct credentials", () => {
  it("Expect the returned username == username sent", async () => {
    const test_user = {
      email: "test@test.com",
      username: "test",
      password: "test",
    };

    const response = await request(app)
      .post("/api/users/signup")
      .send(test_user);
    expect(response._body.username).toEqual(test_user.username);
  });
}); */

describe("Test signup with credentials already used by an existing user", () => {
  it("Expect a the returned username == username sent", async () => {
    const test_user = {
      email: "test@test.com",
      username: "test",
      password: "test",
    };

    return request(app).post("/api/users/signup").send(test_user).expect(409);
  });
});

describe("Test login with incorrect credentials", () => {
  it("Expect a 401 status code", async () => {
    // test with incorrect email
    const test_user = {
      emailOrUsername: "test_wrong@test.com",
      password: "test",
    };

    return request(app).post("/api/users/signin").send(test_user).expect(401);
  });
});

describe("Test login with correct credentials", () => {
  it("Expect a 200 status code", async () => {
    // test with the correct username
    const test_user = {
      emailOrUsername: "test",
      password: "test",
    };

    const response = await request(app)
      .post("/api/users/signin")
      .send(test_user);

    expect(response._body.username).toEqual(test_user.emailOrUsername);
  });
});
