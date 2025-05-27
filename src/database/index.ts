import { DataSource } from "typeorm"
import path from "path"

export const ADS = new DataSource({
  type: "sqlite",
  database: path.resolve("/app/db/rustorydb.sqlite"),
  entities: [path.join(__dirname, "models", "*.model.{ts,js}")],
  synchronize: true,
})

export const initializeDatabase = async () => {
  await ADS.initialize()
  console.log("🟢 Data Source initialized!")
}
