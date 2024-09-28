import { v4 as uuid } from "uuid";

export class User {
  constructor(username, mail, password, initBalance) {
    this._id = uuid();
    this._username = username;
    this._mail = mail;
    this._password = password;
    this._initBalance = Number(initBalance) ? initBalance : 0;
    this._createdAt = new Date().getTime();
  }

  toDto() {
    return {
      id: this._id,
      username: this._username,
      mail: this._mail,
      password: this._password,
      balance: this._initBalance,
      createdAt: this._createdAt,
    };
  }
}
