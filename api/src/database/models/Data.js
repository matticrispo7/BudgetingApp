import { v4 as uuid } from "uuid";

export class Data {
  constructor(description, categoryId, total, userId, timestamp) {
    this._id = uuid();
    this._description = description;
    this._categoryId = categoryId;
    this._userId = userId;
    this._total = Number(total);
    this._timestamp = timestamp;
    this._timestampInsert = new Date().getTime();
  }

  toDto() {
    return {
      id: this._id,
      description: this._description,
      categoryId: this._categoryId,
      total: this._total,
      userId: this._userId,
      timestamp: this._timestamp,
      timestampInsert: this._timestampInsert,
    };
  }
}
