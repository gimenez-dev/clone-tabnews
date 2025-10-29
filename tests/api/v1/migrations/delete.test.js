import database from "infra/database.js";

beforeAll(cleanDatabase);

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

test("DELTE to /api/v1/migrations should return 404", async () => {
  const DeleteRequest = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "DELETE",
  });
  expect(DeleteRequest.status).toBe(404);
});
