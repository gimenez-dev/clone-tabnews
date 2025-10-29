import database from "infra/database.js";

export default async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW SERVER_VERSION;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );
  const databaseMaxConnectionsValue = parseInt(
    databaseMaxConnectionsResult.rows[0].max_connections,
  );

  const databaseName = process.env.POSTGRES_DB;
  const databaseCurrentConnectionsResult = await database.query({
    text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  const databaseCurrentConnectionsValue =
    databaseCurrentConnectionsResult.rows[0].count;
  response.status(200).json({
    updatedAt: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        maxConnections: databaseMaxConnectionsValue,
        currentConnections: databaseCurrentConnectionsValue,
      },
    },
  });
}
