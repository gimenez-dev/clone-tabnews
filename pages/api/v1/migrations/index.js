import migrationsRunner from "node-pg-migrate";
import { join } from "path";
import database from "infra/database.js";

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();
  const DefaultMigrationsConfig = {
    dbClient: dbClient,
    dryRun: true,
    dir: join("infra/migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (request.method === "POST") {
    const migratedMigrations = await migrationsRunner({
      ...DefaultMigrationsConfig,
      dryRun: false,
    });
    await dbClient.end();
    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }
    return response.status(200).json(migratedMigrations);
  }

  if (request.method === "GET") {
    const PendingMigrations = await migrationsRunner(DefaultMigrationsConfig);
    await dbClient.end();
    return response.status(200).json(PendingMigrations);
  }

  return response.status(405).json({ error: "Method not allowed" });
}
