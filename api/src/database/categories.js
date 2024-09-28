import { connectedKnex as knex } from "./knex.js";

function getRecordsNumber(userid) {
  return knex("categories")
    .count("* as totRecords")
    .where("userId", userid)
    .first();
}

function getCategoriesPerUser(
  userId,
  getMainCategories,
  pageSize,
  offset,
  batchData
) {
  // batchData is used to handle whether to retrieve data with pagination or not

  // TODO: refactor
  if (getMainCategories) {
    if (batchData) {
      return knex("categories")
        .where("userId", userId)
        .andWhere("isSubCategory", 0)
        .limit(pageSize)
        .offset(offset)
        .orderBy("name");
    } else {
      return knex("categories")
        .where("userId", userId)
        .andWhere("isSubCategory", 0)
        .orderBy("name");
    }
  }
  // get all categories
  if (batchData) {
    return knex("categories")
      .where("userId", userId)
      .limit(pageSize)
      .offset(offset)
      .orderBy("name");
  } else {
    return knex("categories").where("userId", userId).orderBy("name");
  }
}

function getCategoryNameFromId(id) {
  return knex("categories").where("id", id).select("name").first();
}

function getCategoryIdFromName(name) {
  return knex("categories").where("name", name).select("id").first();
}

function getCategoryTypeFromId(id) {
  return knex("categories").where("id", id).select("type").first();
}

function createCategory(data) {
  return knex("categories").insert(data);
}

function updateCategory(categoryId, data) {
  return knex("categories").where("id", categoryId).update(data);
}

function deleteCategoryById(id) {
  return knex("categories").where("id", id).del();
  /* TODO: cambia la mainCategory in "null" per ogni subcategory che aveva come mainCategory questa che 
   è stata eliminata */
}

export {
  getCategoriesPerUser,
  getCategoryNameFromId,
  createCategory,
  getCategoryIdFromName,
  updateCategory,
  getCategoryTypeFromId,
  getRecordsNumber,
  deleteCategoryById,
};
