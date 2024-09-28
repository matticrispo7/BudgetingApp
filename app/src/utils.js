import randomColor from "randomcolor";
import configdDev from "./config/config.dev";
import configProd from "./config/config.prod";

export const categoryTypesOptions = [
  { label: "EXPENSE", value: "expense" },
  { label: "INCOME", value: "income" },
];

export const dropdownTypes = {
  MAIN_CATEGORY: "MainCategory",
  CATEGORY_TYPE: "CategoryType",
  DATA_CATEGORY: "DataCategory",
  CATEGORY_TO_FILTER: "CategoryToFilter",
  YEAR_EXPENSE: "YearExpense",
};

export const paginationTypes = {
  DATA_PAGINATION: "DataPagination",
  CATEGORIES_PAGINATION: "CategoriesPagination",
};

export const CATEGORIES_PER_PAGE = 2;
export const DATA_PER_PAGE = 2;

export const baseURL =
  process.env.NODE_ENV == "development"
    ? configdDev.backendBaseURL
    : configProd.backendBaseURL;

export const COLORS = [
  "#BD2732",
  "#BF406C",
  "#FF8667",
  "#2330SC",
  "#00AC8E",
  "#F1E678",
  "#682A6E",
  "#C3B6A6",
  "#EA7C95",
  "#FF7E06",
  "#B5DCEB",
  "#88B04B",
  "#F7CAC9",
  "#45B8AC",
  "#5B5EA6",
  "#003366",
  "#daa520",
  "#0a75ad",
  "#088da5",
  "#66cccc",
  "#b4eeb4",
  "#008080",
];

export function getRandomColors(n) {
  if (n <= 0) {
    return [];
  }
  const colors = new Set();

  while (colors.size < n) {
    const color = randomColor();
    colors.add(color);
  }
  return Array.from(colors);
}

export function wrangleAccordionData(data) {
  /* return a list of
      { 
        mainCategory: "...",
        total: ...,
        subCategories: [{name: "...", total: ...}, {...}]
      }
  */
  // at first save the mainCategories
  let categories = data
    .filter((d) => !d.mainCategoryName)
    .map((d) => {
      return {
        mainCategory: d.categoryName,
        total: d.total,
        subCategories: [],
      };
    });
  let subCategories = data.filter((d) => d.mainCategoryName);
  subCategories.forEach((sub) => {
    let mainCategoryPresent = false;
    for (let i = 0; i < categories.length; i++) {
      if (categories[i].mainCategory === sub.mainCategoryName) {
        mainCategoryPresent = true;
        categories[i].total += sub.total;
        categories[i].subCategories.push({
          name: sub.categoryName,
          total: sub.total,
        });
      }
    }
    // if the mainCategory wasn't saved before, save it now
    if (!mainCategoryPresent) {
      categories.push({
        mainCategory: sub.mainCategoryName,
        total: sub.total,
        subCategories: [{ name: sub.categoryName, total: sub.total }],
      });
    }
  });
  return categories.sort((a, b) => b.total - a.total);
}

export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
