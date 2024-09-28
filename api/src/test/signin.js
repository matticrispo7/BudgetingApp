import request from "supertest";
import { createApp } from "../server.js";

const app = createApp();

export async function testSignIn() {
  const test_user = {
    emailOrUsername: "test",
    password: "test",
  };

  let response = await request(app)
    .post("/api/users/signin")
    .send(test_user)
    .expect(200);
  const { token, id } = response._body;
  return { token, id };
}
