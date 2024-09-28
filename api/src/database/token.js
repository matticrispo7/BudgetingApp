import { connectedKnex as knex } from "./knex.js";

function createToken(token) {
  // return the id of the user created
  return knex("tokens").insert(token);
}

function getTokenByUserId(userid) {
  return knex("tokens").where("userId", userid).first();
}

function deleteToken(token) {
  return knex("tokens").where("refreshToken", token).del();
}

function deleteTokenByUserId(userid) {
  return knex("tokens").where("userId", userid).del();
}

export { createToken, getTokenByUserId, deleteToken, deleteTokenByUserId };
