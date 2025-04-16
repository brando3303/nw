import React, { ChangeEvent, Component, MouseEvent, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate
} from "react-router-dom";
import { API_URL } from './NSF';

// class component for the home page of the site. facillitates retreiving the globa; data from the server api, sets the data of the parent.
// requires a setData prop and globalData prop. setData is a function which sets global data of the parent.
// globalData is the data given from the parent, if any.
export function Home(props) {
  let [show, setShow] = useState("LoadHome");
  let [roster, setRoster] = useState(props.roster)
  let navigate = useNavigate();

  useEffect(() => {
    if (props.roster != null) {
      console.log("rostrer not null")
      setRoster(props.roster);
    }
  }, [])


  const render = () => {
    if (show === "LoadHome") {
      renderLoadHome();
      return <p>Loading...</p>;
    } else if (show === "Home") {
      return renderHome();
    }
    console.error("invalid state");
  }

  const renderLoadHome = () => {
    if (roster != null) {
      setShow("Home");
      return;
    }
    console.log("loading");
    fetch(API_URL + '/playerRoster')
      .then(doListResp)
      .catch(doListError);
  }

  const renderHome = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {roster.map((player, index) => (
        <div
          key={index}
          style={{
            border: '1px solid #ccc',
            padding: '1rem',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: '#f9f9f9',
          }}
          onClick={() => onPlayerClick(player)}
        >
          <h3>{player.name}</h3>
          <p>Position: {player.position}</p>
          <button
            to={"/player?name=" + player.name}
            onClick={(e) => {
              e.stopPropagation(); // Prevents the card's onClick from firing
              onPlayerClick(player);
            }}
          >
            View Player
          </button>
        </div>
      ))}
    </div>
  );

///////////////////////////////////////////////////////////////////////////////
// Event Handlers
///////////////////////////////////////////////////////////////////////////////

  // note that player is the entire player object, includes everything from getRoster.
  // TODO: switch to Link component
  const onPlayerClick = (player) => {
    console.log("onPlayerClick")
    // const navigate = useNavigate();
    navigate("/player?name=" + player.name); 
    // fetch(API_URL + '/player?name=' + player.name)
    //   .then(this.doPlayerResp)
    //   .catch(this.doPlayerError);
    // TODO: nav (Link) to player page
  }

///////////////////////////////////////////////////////////////////////////////
// Server Call Handlers
///////////////////////////////////////////////////////////////////////////////

  const doListResp = (res) => {
    console.log("getting response");
    if (res.status !== 200) {
      console.log("res code not 200");
      res.text()
         .then((msg) => doListError(`bad status code ${res.status}: ${msg}`))
         .catch(() => doListError("Failed to parse error response message"));
    } else {
      console.log("res code = 200");
      res.json()
        .then(doListJson)
        .catch(() => doListError("Failed to parse response data as JSON"))
    }
  }

  const doListJson = (data) => {
    console.log("reached")
    if (!Array.isArray(data)) {
      doListError();
    } else {
      console.log("setting state")
      const playerMap = data//new Map(data.map(player => [player.name, player]));
      props.setRoster(playerMap);
      if (roster == null && show != "Home") {
        setRoster(playerMap);
        setShow("Home");
      }
    }
  }
  const doListError = (msg) => {
    console.error("error fetching from server: " + msg)
  }

  return render();
}



