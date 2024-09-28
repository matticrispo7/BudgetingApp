import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { CATEGORIES_PER_PAGE } from "../utils.js";
import * as dbCategories from "../database/categories.js";
import { Category } from "../database/models/Category.js";

const router = express.Router();

router.get("/categories", requireAuth, async (req, res) => {
  const { userId, isSubCategory, batchData, page } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "No userId provided" });
  }

  // 'batchData' => enable it to fetch paginated data
  let offset, categories, data;
  if (page) {
    offset = (parseInt(page) - 1) * CATEGORIES_PER_PAGE;
  }

  try {
    // ? isSubCategory == 0 => fetch only mainCategories per user
    categories = await dbCategories.getCategoriesPerUser(
      userId,
      isSubCategory,
      CATEGORIES_PER_PAGE,
      offset,
      batchData
    );
    // add the "mainCategory" name field for each category
    data = await Promise.all(
      categories.map(async (c) => {
        let mainCatName = c.mainCategoryId
          ? await dbCategories.getCategoryNameFromId(c.mainCategoryId)
          : "";
        return { ...c, mainCategory: mainCatName?.name };
      })
    );

    res.status(200).json(data);
  } catch (error) {
    console.error("[GET /categories] Database error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/categories/pages/user/:id", requireAuth, async (req, res) => {
  try {
    const totRows = await dbCategories.getRecordsNumber(req.params.id);
    const totPages = Math.ceil(totRows.totRecords / CATEGORIES_PER_PAGE);
    res.status(200).json({ totPages });
  } catch (error) {
    console.error("[GET /categories/pages/user/:id] Database error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/categories", requireAuth, async (req, res) => {
  const { type, userId, isSubCategory, name, mainCategory } = req.body;
  if (!type | !userId | !isSubCategory | !name) {
    res.status(400).json({ error: "Missing data for creating category" });
  }

  try {
    let mainCategoryId = mainCategory
      ? await dbCategories.getCategoryIdFromName(mainCategory)
      : null;
    let data = new Category(
      name,
      type,
      userId,
      isSubCategory,
      mainCategoryId?.id
    ).toDto();
    await dbCategories.createCategory(data);
    res.sendStatus(201);
  } catch (error) {
    console.error("[POST /categories] Database error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.patch("/categories/:id", requireAuth, async (req, res) => {
  const categoryId = req.params.id;
  const { mainCategory } = req.body;

  let updatedData = {};

  try {
    let mainCategoryId = mainCategory
      ? await dbCategories.getCategoryIdFromName(mainCategory)
      : "";
    if (req.body?.categoryName) {
      updatedData.name = req.body.categoryName;
    }
    if (req.body?.type) {
      updatedData.type = req.body.type;
    }
    if (mainCategoryId) {
      updatedData.mainCategoryId = mainCategoryId?.id;
    }
    if (req.body?.isSubCategory == 0) {
      updatedData.mainCategoryId = "";
      updatedData.isSubCategory = req.body.isSubCategory;
    } else if (req.body?.isSubCategory == 1) {
      updatedData.mainCategoryId = mainCategoryId?.id;
      updatedData.isSubCategory = req.body.isSubCategory;
    }
    let result;
    if (Object.keys(updatedData).length > 0) {
      result = await dbCategories.updateCategory(categoryId, updatedData);
      res.status(200).json(result);
    } else {
      return res.sendStatus(400);
    }
  } catch (error) {
    console.error("[PATCH /categories/:id] Database error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/categories/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await dbCategories.deleteCategoryById(id);
    if (result) {
      res.sendStatus(204);
    } else {
      res.status(400).json({ error: "Unable to delete category" });
    }
  } catch (error) {
    console.error("[DELETE /categories/:id] Database error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export { router as categoriesRouter };
