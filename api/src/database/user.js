import { connectedKnex as knex } from "./knex.js";

function createUser(user) {
  // return the id of the user created
  return knex("users").insert(user).returning("id");
}

function getUserById(userid) {
  return knex("users").where("id", userid).first();
}

function getUserByUsername(username) {
  return knex("users").where("username", username).first();
}

function getUserByMail(mail) {
  return knex("users").where("mail", mail).first();
}

function updateUserById(userid, data) {
  return knex("users").where("id", userid).update(data);
}

function updateUserBalanceById(userId, amount) {
  // add the 'amount' (could be > or < 0) to the balance
  return knex.raw(
    `UPDATE users SET balance = balance + ${amount} WHERE id = '${userId}'`
  );
}

function deleteUserById(userid) {
  return knex("users").where("id", userid).del();
}

export {
  createUser,
  getUserByUsername,
  getUserByMail,
  getUserById,
  updateUserById,
  deleteUserById,
  updateUserBalanceById,
};
