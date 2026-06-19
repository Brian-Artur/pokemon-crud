import { pool } from "../db";
import type { Pokemon } from "./pokemon.schema";
import type { RowDataPacket } from "mysql2";

export const pokemonRepository = {
  async getAll(): Promise<Pokemon[]> {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM pokemons");
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      types: JSON.parse(row.types),
    }));
  },

  async create(pokemon: Pokemon): Promise<void> {
    await pool.query(
      "INSERT INTO pokemons (id, name, types) VALUES (?, ?, ?)",
      [pokemon.id, pokemon.name, JSON.stringify(pokemon.types)]
    );
  },
};  