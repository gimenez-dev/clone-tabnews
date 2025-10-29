import migrationsRunner from "node-pg-migrate";
import { join } from "path";
import database from "infra/database.js";

export default async function migrations(request, response) {
  let dbClient;
  try {
    const AllowedMethods = ["GET", "POST"];
    if (!AllowedMethods.includes(request.method)) {
      return response.status(404).json({ error: "Not Found" });
    }
    dbClient = await database.getNewClient();

    const DefaultMigrationsConfig = {
      dbClient: dbClient,
      dryRun: true,
      dir: join("infra/migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (request.method === "POST") {
      const PendingMigrations = await migrationsRunner({
        ...DefaultMigrationsConfig,
        dryRun: false,
      });
      if (PendingMigrations.length > 0) {
        return response.status(201).json(PendingMigrations);
      } else {
        return response.status(200).json(PendingMigrations);
      }
    }

    if (request.method === "GET") {
      const PendingMigrations = await migrationsRunner(DefaultMigrationsConfig);
      return response.status(200).json(PendingMigrations);
    }
  } catch (error) {
    return response.status(404).json({ error: error.message });
  } finally {
    await dbClient.end();
  }
}
