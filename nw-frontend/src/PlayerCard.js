import ReactDOM from 'react-dom/client';
import React, { ChangeEvent, Component, MouseEvent, useState, useEffect, Error } from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    getNavigation,
    useLocation,
    useParams
} from "react-router-dom";
import { API_URL } from './NSF';

//        <img src={player.team_img} alt="Team Logo" className={styles.teamImg} />
// for when the logos are working

const PlayerCard = ({ player }) => {
  return (
    <a className="bg-white border border-black/5 w-[340px] flex flex-col items-center p-0 rounded-2xl overflow-hidden transition-all duration-300 ease-out cursor-pointer no-underline shadow-sm hover:-translate-y-2 hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] max-md:w-[360px] max-md:h-[360px]" href={'/player?id=' + player.id}>
      <div className="relative w-full h-[200px] overflow-hidden flex justify-center items-start">
        <img src={player.player_img} alt={player.name} className="w-full h-full object-cover object-top" />
        <div className="absolute top-3 right-3 h-12 w-12 rounded-full text-red-500 bg-white/90 text-[#1f2937] flex items-center justify-center text-[1.1rem] font-bold shadow-md">
          {player.score}
        </div>
      </div>
      <div className="w-full px-4 pb-4 text-left text-[#333] no-underline">
        <h2 className="text-[1.6rem] font-semibold mt-3 mb-1 text-[#111] no-underline font-sans">{player.name}</h2>
        <p className="text-[0.95rem] text-[#64748b] mb-1">{player.position}</p>
      </div>
    </a>
  );
};

export default PlayerCard;