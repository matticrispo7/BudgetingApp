import knex from "knex";

const connectedKnex = knex({
  client: "sqlite3",
  connection: {
    filename:
      process.env.NODE_ENV === "test"
        ? "./src/database/test_db.sqlite"
        : "./src/database/db.sqlite",
  },
  useNullAsDefault: true,
});

export { connectedKnex };
