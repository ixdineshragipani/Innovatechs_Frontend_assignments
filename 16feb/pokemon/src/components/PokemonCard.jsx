import { typeColors } from "../utils/typeColors";
import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";

function PokemonCard({ pokemon, onClick }) {
  const mainType = pokemon.types[0].type.name;
  const bgColor = typeColors[mainType] || "#6b7280";

  return (
    <div
      onClick={() => onClick && onClick(pokemon)}
      role="button"
      tabIndex={0}
      className="rounded-xl shadow-lg p-4 text-white text-center transition transform hover:scale-105 cursor-pointer"
      style={{ background: `linear-gradient(135deg, ${bgColor}33, ${bgColor})` }}
    >
      <img
        src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default}
        alt={pokemon.name}
        className="mx-auto w-28 h-28"
      />

      <h2 className="text-lg font-extrabold capitalize mt-2">{pokemon.name}</h2>

      <p className="text-sm opacity-90">#{String(pokemon.id)}</p>

      <div className="flex justify-center gap-2 mt-3 flex-wrap">
        {pokemon.types.map((t) => (
          <span
            key={t.type.name}
            className="text-xs px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm capitalize"
          >
            {t.type.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default PokemonCard;