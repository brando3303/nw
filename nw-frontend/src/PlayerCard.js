import React from 'react';

const PlayerCard = ({ player, className = '', style }) => {
  return (
    <a
      className={`group relative w-[292px] overflow-hidden rounded-2xl border border-slate-200/90 bg-white no-underline shadow-[0_5px_18px_rgba(15,23,42,0.07)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-red-200/70 hover:shadow-[0_10px_24px_rgba(15,23,42,0.11)] ${className}`.trim()}
      style={style}
      href={'/player?id=' + player.id}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-red-50/0 via-red-100/0 to-orange-100/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative h-[158px] w-full overflow-hidden">
        <img
          src={player.player_img}
          alt={player.name}
          className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <div className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/80 text-[0.95rem] font-semibold text-slate-800 shadow-sm">
          {player.score}
        </div>
      </div>

      <div className="relative w-full px-4 pb-4 pt-3 text-left text-slate-700">
        <h2 className="line-clamp-1 text-[1.25rem] font-semibold text-slate-900 font-sans">
          {player.name}
        </h2>
        <div className="mt-2 flex items-center justify-between">
          <p className="rounded-md bg-slate-100 px-2 py-1 text-[0.78rem] uppercase tracking-wide text-slate-600">
            {player.position}
          </p>
          {player.year && (
            <p className="text-[0.78rem] font-medium text-slate-500">{player.year}</p>
          )}
        </div>
      </div>
    </a>
  );
};

export default PlayerCard;