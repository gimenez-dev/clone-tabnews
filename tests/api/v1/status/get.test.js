test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(responseBody.updatedAt).toBeDefined();

  const parsedUpdatedAt = new Date(responseBody.updatedAt).toISOString();

  expect(responseBody.updatedAt).toEqual(parsedUpdatedAt);

  expect(responseBody.dependencies.database.version).toEqual("17.0");

  expect(responseBody.dependencies.database.maxConnections).toEqual(100);

  expect(responseBody.dependencies.database.currentConnections).toEqual(1);
});
