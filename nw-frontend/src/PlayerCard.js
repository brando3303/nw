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
import styles from "./CardStyles.module.css";

//        <img src={player.team_img} alt="Team Logo" className={styles.teamImg} />
// for when the logos are working

const PlayerCard = ({ player }) => {
  return (
    <a className={styles.card} href={'/player?id=' + player.id}>
      <div className={styles.images}>
            <img src={player.player_img} alt={player.name} className={styles.playerImg} />
      </div>
      <div className={styles.info}>
        <h2 className={styles.name}>{player.name}</h2>
        <p className={styles.position}>{player.position}</p>
        <p className={styles.score}>Score: <text className={styles.score_num}>{player.score}</text></p>
      </div>
    </a>
  );
};

export default PlayerCard;