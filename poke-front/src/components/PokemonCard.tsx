import { useState } from "react";
import type { Pokemon, PokemonSinId } from "../pokemons/pokemon.schema";

type Props = {
  pokemon: Pokemon;
  onUpdate: (id: number, datos: PokemonSinId) => Promise<void>;
  onRemove: (id: number) => void;
};

export function PokemonCard({ pokemon, onUpdate, onRemove }: Props) {
  const [editando, setEditando] = useState(false);
  const [name, setName] = useState("");
  const [types, setTypes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const empezarEdicion = () => {
    setName(pokemon.name);                    // precarga con el valor ACTUAL
    setTypes(pokemon.types.join(", "));
    setError(null);
    setEditando(true);
  };

  const cancelar = () => {
    setEditando(false);
    setError(null);
  };

  const guardar = async () => {
    setError(null);
    const datos: PokemonSinId = {
      name,
      types: types.split(",").map((t) => t.trim()).filter(Boolean),
    };
    try {
      await onUpdate(pokemon.id, datos);
      setEditando(false);                     // solo salgo si tuvo éxito
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  if (editando) {
    return (
      <li>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="nombre" />
        <input value={types} onChange={(e) => setTypes(e.target.value)} placeholder="tipos (coma)" />
        <button onClick={guardar}>Guardar</button>
        <button onClick={cancelar}>Cancelar</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </li>
    );
  }

  return (
    <li>
      {pokemon.name} — {pokemon.types.join(", ")}
      <button onClick={empezarEdicion}>Editar</button>
      <button onClick={() => onRemove(pokemon.id)}>Borrar</button>
    </li>
  );
}