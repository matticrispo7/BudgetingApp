export const CATEGORIES_PER_PAGE = 6;
export const DATA_PER_PAGE = 8;

export function wrangleDataLastPeriod(balance, data) {
  // TODO: change aggregatedData in array of obj
  let aggregatedData = data.reduce((result, entry) => {
    /* aggregate a list of objects where each object has a type, 
    total, and timestamp property, grouping by day and summing the 
    total based on the type */
    const date = new Date(entry.timestamp).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });

    result[date] = result[date] || {};
    result[date][entry.type] = (result[date][entry.type] || 0) + entry.total;

    return result;
  }, {});

  // get the balance for each day
  let result = [];
  for (const date in aggregatedData) {
    if (aggregatedData[date].expense) {
      balance -= aggregatedData[date].expense;
    }
    if (aggregatedData[date].income) {
      balance += aggregatedData[date].income;
    }
    result.push({ timestamp: date, balance });
  }

  return result;
}

export function aggregateByMonth(data) {
  const aggregatedData = data.reduce((result, entry) => {
    const date = new Date(entry.timestamp);
    //const month = date.getMonth()+1;
    const month = date.toLocaleString("en-GB", { month: "long" });
    /*const [year, month] = entry.timestamp.split('-');
    const monthKey = `${year}-${month}`;*/

    result[month] = result[month] || {};
    //console.log("ENTRY: ", entry);
    result[month][entry.type] = (result[month][entry.type] || 0) + entry.total;
    //console.log("RESULT: ", result[month][entry.type]);
    return result;
  }, {});

  let result = [];
  for (const month in aggregatedData) {
    //console.log("MONTH: ", month);
    result.push({
      month: month,
      expense: aggregatedData[month]["expense"] || 0,
      income: aggregatedData[month]["income"] || 0,
    });
  }
  return result;
}
