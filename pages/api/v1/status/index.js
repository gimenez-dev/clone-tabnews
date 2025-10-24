import database from "../../../../infra/database.js";

const status = async (request, response) => {
  const result = await database.query("SELECT 1 + 1;");
  response.status(200).json({ status: "ok" });
};

export default status;
