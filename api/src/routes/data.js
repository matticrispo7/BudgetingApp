import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import {
  DATA_PER_PAGE,
  wrangleDataLastPeriod,
  aggregateByMonth,
} from "../utils.js";
import * as dbData from "../database/data.js";
import * as dbCategories from "../database/categories.js";
import * as dbUser from "../database/user.js";
import { Data } from "../database/models/Data.js";

const router = express.Router();

// all data per user
router.get("/data", requireAuth, async (req, res) => {
  const {
    userId,
    batchData,
    page,
    filterCategory,
    filterDateRange,
    filterText,
  } = req.query;
  let offset, result, data;
  if (page) {
    offset = (parseInt(page) - 1) * DATA_PER_PAGE;
  }

  try {
    data = await dbData.getAllDataPerUser(
      userId,
      DATA_PER_PAGE,
      offset,
      batchData,
      filterCategory,
      filterDateRange,
      filterText
    );
    // add the "category" name field (it's the category name get from id)
    result = await Promise.all(
      data.map(async (d) => {
        let categoryName = await dbCategories.getCategoryNameFromId(
          d.categoryId
        );
        return { ...d, category: categoryName?.name };
      })
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("[GET /data] Error fetching from DB: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// data for last period
router.get("/data/user/:id?", requireAuth, async (req, res) => {
  const { days } = req.query;

  const userId = req.params?.id || null;
  if (!userId | !days) {
    return res.status(401).json({ error: "Missing data" });
  }

  // TODO: check how the balance is computed
  const sinceTs = new Date().getTime() - days * 24 * 60 * 60 * 1000;
  const endTs = new Date().getTime();
  try {
    let data = await dbData.getDataLastPeriod(sinceTs, endTs, userId);
    let balance;
    if (data.length > 0) {
      balance = data[0].balance;
      data = wrangleDataLastPeriod(balance, data);
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("[GET /data/user/:id?] Error fetching from DB: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// TMP ROUTE => merge with the one above
router.get("/data/year/user/:id", requireAuth, async (req, res) => {
  const { year } = req.query;
  const userId = req.params.id;

  let sinceTs = new Date(`${year}-01-01`).getTime();
  let endTs = new Date(`${year}-12-31`).getTime();
  try {
    let data = await dbData.getDataLastPeriod(sinceTs, endTs, userId);
    const aggregatedData = aggregateByMonth(data);

    res.status(200).json(aggregatedData);
  } catch (error) {
    console.error("[GET /data/year/user/:id] Error fetching from DB: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/data/pages/user/:id", async (req, res) => {
  const totRows = await dbData.getRecordsNumber(req.params.id);
  const totPages = Math.ceil(totRows.totRecords / DATA_PER_PAGE);
  res.json({ totPages });
});

// data for given period
router.get("/data/aggregated/user/:userId", requireAuth, async (req, res) => {
  const { tsStart, tsEnd } = req.query;
  const { userId } = req.params;
  let sinceTs, toTs;
  if (tsStart && tsEnd && tsStart > 0 && tsEnd > 0) {
    // timerange provided => get data for given timerange
    sinceTs = tsStart;
    toTs = tsEnd;
  } else {
    // no timerange provided => get data starting from 30 days
    sinceTs = new Date().getTime() - 30 * 24 * 60 * 60 * 1000;
    toTs = new Date().getTime();
  }

  try {
    const expense = await dbData.getSumValueLastPeriod(
      sinceTs,
      toTs,
      userId,
      "expense"
    );

    const income = await dbData.getSumValueLastPeriod(
      sinceTs,
      toTs,
      userId,
      "income"
    );

    res.json({ expense: expense, income: income });
  } catch (error) {
    console.error(
      "[GET /data/aggregated/user/:userId] Error fetching from DB: ",
      error
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/data", requireAuth, async (req, res) => {
  const { description, timestamp, userId, total, category } = req.body;
  if (!description | !userId | !total | !category | !timestamp) {
    res.status(400).json({ error: "Missing data" });
  }
  try {
    let { id: categoryId } = await dbCategories.getCategoryIdFromName(category);
    if (!categoryId) {
      // Category not found
      return res.status(400).json({ error: "Category not found" });
    }

    const { type: categoryType } = await dbCategories.getCategoryTypeFromId(
      categoryId
    );
    let data = new Data(
      description,
      categoryId,
      total,
      userId,
      timestamp
    ).toDto();
    let result = await dbData.createData(data);

    // update the user balance
    const amount = categoryType === "expense" ? -total : total;
    let resultUpdateBalance = await dbUser.updateUserBalanceById(
      userId,
      amount
    );

    if (result && resultUpdateBalance) {
      res.sendStatus(201);
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    console.error("[POST /data] Database error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.patch("/data/:id", requireAuth, async (req, res) => {
  const { id: dataId } = req.params;
  const { category } = req.body;

  try {
    let updatedData = {};
    let { id: categoryId } = category
      ? await dbCategories.getCategoryIdFromName(category)
      : "";
    if (req.body?.description) {
      updatedData.description = req.body.description;
    }
    if (req.body?.total) {
      updatedData.total = req.body.total;
    }
    if (req.body?.timestamp) {
      updatedData.timestamp = req.body.timestamp;
    }
    if (categoryId) {
      updatedData.categoryId = categoryId;
    }

    let result;
    if (Object.keys(updatedData).length > 0) {
      // get the existing data details and update the user balance based on the category type (expense or income)
      if (updatedData.total) {
        const { total: previousTotal, userId } = await dbData.getData(dataId);
        const amount = previousTotal - Number(updatedData.total);
        await dbUser.updateUserBalanceById(userId, amount);
      }

      result = await dbData.updateData(dataId, updatedData);
    } else {
      return res.sendStatus(400);
    }

    if (result) {
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    console.error("[PATCH /data/:id] Database error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/data/pages/user/:id", requireAuth, async (req, res) => {
  try {
    const totRows = await dbData.getRecordsNumber(req.params.id);
    const totPages = Math.ceil(totRows.totRecords / DATA_PER_PAGE);
    res.status(200).json({ totPages });
  } catch (error) {
    console.error("[GET /data/pages/user/:id] Database error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/data/:id", async (req, res) => {
  const { id } = req.params;
  const result = await dbData.deleteDataById(id);
  try {
    if (result) {
      res.sendStatus(204);
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    console.error("[DELETE /data/:id] Database error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/data/years/user/:id", requireAuth, async (req, res) => {
  /* Get the list of years where the user has added an expense */
  try {
    const data = await dbData.getListOfYears(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    console.error("[GET /data/years/user/:id] Database error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export { router as dataRouter };
