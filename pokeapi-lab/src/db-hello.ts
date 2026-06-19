import mysql from "mysql2/promise";         // para usar async/await
import { pool } from "./db";

async function main() {

  // Cojo filas, tiro metadatos 
  const [rows] = await pool.query("SELECT * FROM pokemons");

  console.log(rows);

  await pool.end();                         // Cierra conexión
}

main().catch((err) => console.error("Error:", err));