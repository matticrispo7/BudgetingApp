import { connectedKnex as knex } from "./knex.js";

function getData(id) {
  return knex("data").select("*").where("id", id).first();
}

function getAllDataPerUser(
  userid,
  pageSize,
  offset,
  batchData,
  filterCategory,
  filterDateRange,
  filterText
) {
  let query = knex("data").where("data.userId", userid);
  // TODO: convert dateRange to timestamp
  if (filterCategory) {
    query = query
      .leftJoin("categories", "data.categoryId", "categories.id")
      .select(
        "data.id",
        "data.description",
        "data.total",
        "data.categoryId",
        "data.timestamp",
        "data.userId"
      )
      .andWhere("categories.name", filterCategory);
  }
  //query = query.andWhere("data.userId", userid)
  if (filterDateRange) {
    let startTs = filterDateRange.split(",")[0];
    let endTs = filterDateRange.split(",")[1];
    query = query
      .andWhere("data.timestamp", ">=", startTs)
      .andWhere("data.timestamp", "<=", endTs);
  }

  if (filterText) {
    query = query.andWhere("data.description", "like", `${filterText}%`);
  }

  if (batchData) {
    query = query.limit(pageSize).offset(offset);
  }
  query = query.orderBy("data.timestamp", "desc");
  return query;
}

function getDataCategoryPerUser(userid, categoryid) {
  return knex("data")
    .where("userid", userid)
    .andWhere("categoryId", categoryid);
}
function createData(data) {
  return knex("data").insert(data);
}

function updateData(id, data) {
  return knex("data").where("id", id).update(data);
}

function getRecordsNumber(userid) {
  return knex("data").count("* as totRecords").where("userId", userid).first();
}

function getDataLastPeriod(sinceTs, endTs, userid) {
  return knex("data")
    .innerJoin("categories", "data.categoryId", "categories.id")
    .innerJoin("users", "users.id", "data.userId")
    .select(
      "data.id",
      "data.total",
      "categories.type",
      "data.timestamp",
      "users.balance"
    )
    .where("users.id", userid)
    .andWhere("data.timestamp", ">=", sinceTs)
    .andWhere("data.timestamp", "<=", endTs)
    .orderBy("data.timestamp", "asc");
}

function getSumValueLastPeriod(
  timestampStart,
  timestampEnd,
  userId,
  categoryType
) {
  /* SQL QUERY
      SELECT SUM(tot) as total, categoryName, B.name as mainCategoryName
      FROM (
          SELECT d.total as tot, c.name as categoryName, c.mainCategoryId
          FROM data as d 
          JOIN categories as c
          ON d.categoryId = c.id
          WHERE d.timestamp >= timestampStart
          AND d.userId = userId
          AND c.type = "Income"
      ) AS A
      LEFT JOIN categories as B
      ON A.mainCategoryId = B.id
      GROUP BY categoryName

*/

  const subquery = knex
    .select("d.total as tot", "c.name as categoryName", "c.mainCategoryId")
    .from("data as d")
    .join("categories as c", "d.categoryId", "c.id")
    .where("d.userId", userId)
    .where("d.timestamp", ">=", timestampStart)
    .andWhere("d.timestamp", "<=", timestampEnd)
    .andWhere("d.userId", userId)
    .andWhere("c.type", "=", categoryType);

  const mainQuery = knex
    .select(
      knex.raw("SUM(tot) as total"),
      "categoryName",
      "B.name as mainCategoryName"
    )
    .from({ A: subquery })
    .leftJoin("categories as B", "A.mainCategoryId", "B.id")
    .groupBy("categoryName");

  return mainQuery;
}

function deleteDataById(id) {
  return knex("data").where("id", id).del();
}

function getListOfYears(userId) {
  return knex("data")
    .distinct(
      knex.raw(
        "strftime('%Y', datetime(timestamp / 1000, 'unixepoch')) AS year"
      )
    )
    .where("userId", userId);
}

export {
  getData,
  getAllDataPerUser,
  getDataCategoryPerUser,
  updateData,
  createData,
  getDataLastPeriod,
  getRecordsNumber,
  deleteDataById,
  getSumValueLastPeriod,
  getListOfYears,
};
