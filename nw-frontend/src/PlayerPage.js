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
import styles from './Styles.module.css';

// class component player page. requires 
export function PlayerPage (props) {
    let [show, setShow] = useState("loadPlayer");
    let [player, setPlayer] = useState(null);
    
    useEffect(() => {
        console.log(props.name);
        fetch(API_URL + '/player?name=' + props.name)
        .then(doPlayerResp)
        .catch(doPlayerError);
    }, [])

    const render = () => {
        console.log("rerender");
        if (show === "loadPlayer") {
          return renderPlayerPageLoading();
        } else if (show === "player") {
          return renderPlayerPage();
        } else if (show == "error") {
            return renderError();
        }
    }
    
    const renderPlayerPageLoading = () => {
        return (<div className={styles.playerpage_loading}>
            <p>Loading...</p>
            </div>)
    }
    
    const renderPlayerPage = () => {

        return    <SlideInText player={player}/>
    }
    
    
    const doPlayerResp = (res) => {
        console.log("getting response");
        if (res.status !== 200) {
            console.log("res code not 200");
            res.text()
            .then((msg) => doPlayerError(`bad status code ${res.status}: ${msg}`))
            .catch(() => doPlayerError("Failed to parse error response message"));
        } else {
            console.log("res code = 200");
            res.json()
            .then(doPlayerJson)
            .catch(() => doPlayerError("Failed to parse response data as JSON"))
        }
    }
    
    const doPlayerJson = (players) => {
        console.log("reached")
        if (!Array.isArray(players)) {
            doPlayerError();
        } else {
            if (players.length == 0) {
                setShow("error");
                return;
            }
            let playerData = players[0];
            console.log("setting state: " + JSON.stringify(playerData));
            setPlayer(playerData);
            setTimeout(() => setShow("player"), 200);
        }
    }

    const doPlayerError = (msg) => {
        console.error("error fetching player from server: " + msg)
    }

    const renderError = () => {
        return <p>Sorry, there was an error loading this page...</p>;
    }
    
    
    return render();
}


function SlideInText (props) {
    const [show, setShow] = useState(false);
    console.log("asdfasdlfjsdl;fjsld;f");
    useEffect(() => {
      // Trigger the animation shortly after mount
      setTimeout(() => set(), 100);
    }, []);

    const set = () => {
        console.log("setting to true");
        setShow(true)
    }
  
    return (
      <div className={`${styles.slideInText} ${show ? styles.show : ''} ${styles.playerpage_text}`}>
            <div dangerouslySetInnerHTML={{ __html: props.player.playerpage }}/>
       </div>
    );
  };