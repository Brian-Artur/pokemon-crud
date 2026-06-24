import { Pool } from "mysql2/promise";
import type { Pokemon, PokemonSinId } from "./pokemon.schema";
import { ResultSetHeader, type RowDataPacket } from "mysql2";


// El contrato: Qué debe hacer un Repository
export interface PokemonRepository {
  getAll(): Promise<Pokemon[]>;
  getById(id: number): Promise<Pokemon | null>;
  create(pokemon: Pokemon): Promise<boolean>;
  update(id: number, datos: Omit<Pokemon, "id">): Promise<boolean>,
  remove(id: number): Promise<boolean>;
}

// Como método estático privado
function toPokemon(row: RowDataPacket): Pokemon {
  return {
    id: row.id,
    name: row.name,
    types: JSON.parse(row.types),
  };
}

export class MariaDbPokemonRepository implements PokemonRepository {

  constructor(private readonly pool: Pool) { }

  async getAll(): Promise<Pokemon[]> {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      "SELECT * FROM pokemons"
    );
    return rows.map((row) => toPokemon(row));
  }

  async getById(id: number): Promise<Pokemon | null> {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      "SELECT * FROM pokemons WHERE id = ?",
      [id]
    );
    return rows.length > 0 ? toPokemon(rows[0]) : null;
  }

  async create(pokemon: Pokemon): Promise<boolean> {
    const [res] = await this.pool.query<ResultSetHeader>(
      "INSERT INTO pokemons (id, name, types) VALUES (?, ?, ?)",
      [pokemon.id, pokemon.name, JSON.stringify(pokemon.types)]
    );
    return res.affectedRows > 0;
  }

  async update(id: number, datos: PokemonSinId): Promise<boolean> {
    const [res] = await this.pool.query<ResultSetHeader>(
      "UPDATE pokemons SET name = ?, types = ? WHERE id = ?",
      [datos.name, JSON.stringify(datos.types), id]
    );
    return res.affectedRows > 0;
  }

  async remove(id: number): Promise<boolean> {
    const [res] = await this.pool.query<ResultSetHeader>(
      "DELETE FROM pokemons WHERE id = ?",
      [id]
    );
    return res.affectedRows > 0;
  }
};  