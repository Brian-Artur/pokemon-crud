import { pool } from "../db";
import type { Pokemon } from "./pokemon.schema";
import { ResultSetHeader, type RowDataPacket } from "mysql2";


function toPokemon(row: RowDataPacket): Pokemon {
  return {
    id: row.id,
    name: row.name,
    types: JSON.parse(row.types),
  };
}

export const pokemonRepository = {
  async getAll(): Promise<Pokemon[]> {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM pokemons");
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      types: JSON.parse(row.types),
    }));
  },

  async getById(id: number): Promise<Pokemon | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM pokemons WHERE id = ?",
      [id]
    );
    return rows.length > 0 ? toPokemon(rows[0]) : null;
  },

  async create(pokemon: Pokemon): Promise<boolean> {
    const [res] = await pool.query<ResultSetHeader>(
      "INSERT INTO pokemons (id, name, types) VALUES (?, ?, ?)",
      [pokemon.id, pokemon.name, JSON.stringify(pokemon.types)]
    );
    return res.affectedRows > 0;
  },

  async remove(id: number): Promise<boolean> {
    const [res] = await pool.query<ResultSetHeader>(
      "DELETE FROM pokemons WHERE id = ?",
      [id]
    );
    return res.affectedRows > 0;
  }
};  