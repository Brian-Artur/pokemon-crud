import { useState } from "react";
import type { Pokemon } from "../pokemons/pokemon.schema"


type Props = {
  onCreate: (pokemon: Pokemon) => Promise<boolean>;
  createError: string | null;
};

export function PokemonForm({ onCreate, createError }: Props ) {
  const [id, setId] = useState(""); 
  const [name, setName] = useState(""); 
  const [types, setTypes] = useState(""); 

  const hadlerSubmit = async () => {
    const pokemon: Pokemon = {
      id: Number(id),
      name,
      types: types.split(",").map((t) => t.trim()).filter(Boolean),
    };

    const ok = await onCreate(pokemon);

    if (ok){
      setId("");
      setName("");
      setTypes("");
    }
  };

  return (
    <div>
      <input value={id} 
             onChange={(e) => setId(e.target.value)} 
             placeholder="id" />
      <input value={name} 
             onChange={(e) => setName(e.target.value)} 
             placeholder="nombre" />
      <input value={types} 
             onChange={(e) => setTypes(e.target.value)} 
             placeholder="tipos (coma)" />
      
      <button onClick={hadlerSubmit}>Crear</button>
      {createError && <p style={{ color: "red"}}>{createError}</p>}
    </div>
  );

}