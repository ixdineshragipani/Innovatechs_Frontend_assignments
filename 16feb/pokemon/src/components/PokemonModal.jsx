import React from 'react';

function StatBar({ label, value }) {
  const pnt = Math.min(100, Math.round((value / 200) * 100));
  return (
    <div className="flex items-center gap-3">
      <div className="w-20 text-sm text-slate-700">{label}</div>
      <div className="flex-1 bg-white/30 rounded h-3 ">
        <div className="h-3 bg-green-500" style={{ width: `${pnt}%` }} />
      </div>
      <div className="w-8 text-right text-sm">{value}</div>
    </div>
  );
}

export default function PokemonModal({ pokemon, onClose }) {
  if (!pokemon) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6 text-slate-800"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <img
              src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default}
              alt={pokemon.name}
              className="w-32 h-32"/>
            <div>
              <h2 className="text-2xl font-bold capitalize">{pokemon.name}</h2>
              <p className="text-sm text-slate-500">#{String(pokemon.id)}</p>

              <div className="flex gap-2 mt-2">
                {pokemon.types.map((t) => (
                  <span key={t.type.name} className="text-xs px-3 py-1 rounded-full bg-slate-100 capitalize">
                    {t.type.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-500 border-black hover:bg-blue-500 hover:text-slate-800">Close</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-3">
            <div className="flex gap-4">
              <div>
                <div className="text-xs text-slate-500">Height</div>
                <div className="font-medium">{pokemon.height}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Weight</div>
                <div className="font-medium">{pokemon.weight/10}</div>
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold mb-2">Abilities</div>
              <ul className="list-disc list-inside text-sm">
                {pokemon.abilities.map((a) => (
                  <li key={a.ability.name} className="capitalize">{a.ability.name}</li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-sm font-semibold mb-2">Top Moves</div>
              <div className="flex flex-wrap gap-2">
                {pokemon.moves.slice(0, 8).map((m) => (
                  <span key={m.move.name} className="text-xs px-2 py-1 bg-slate-100 rounded capitalize">{m.move.name}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-sm font-semibold">Stats</div>
            <div className="space-y-2">
              {pokemon.stats.map((s) => (
                <StatBar key={s.stat.name} label={s.stat.name} value={s.base_stat} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}