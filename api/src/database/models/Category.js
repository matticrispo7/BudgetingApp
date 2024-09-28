import { v4 as uuid } from "uuid";

export class Category {
  constructor(name, type, userId, isSubCategory, mainCategoryId) {
    this._id = uuid();
    this._name = name;
    this._type = type;
    this._userId = userId;
    this._isSubCategory = isSubCategory;
    this._mainCategoryId = mainCategoryId;
    this._timestamp = new Date().getTime();
  }

  toDto() {
    return {
      id: this._id,
      name: this._name,
      type: this._type,
      userId: this._userId,
      isSubCategory: this._isSubCategory,
      mainCategoryId: this._mainCategoryId,
      timestamp: this._timestamp,
    };
  }
}
