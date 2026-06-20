import { pool } from "./db";
import { MariaDbPokemonRepository } from "./pokemons/pokemon.repository";
import { pokeapiGateway } from "./pokemons/pokeapi.gateway";
import { IngestionService } from "./pokemons/ingestion.service";

async function main() {
  const repository = new MariaDbPokemonRepository(pool);
  const service = new IngestionService(pokeapiGateway, repository);

  await service.ingest(20);                 // los primeros 20
  await pool.end();
}

main().catch((err) => console.error("Error:", err));