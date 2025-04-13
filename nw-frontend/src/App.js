import logo from './logo.svg';
import React, { ChangeEvent, Component, MouseEvent } from 'react';
import './App.css';

let API_URL = "https://nw-api.vercel.app"
//API_URL = "http://localhost:3001"

export class App extends Component {
  constructor(props) {
    super(props)
    this.state = {show: "loadingHome", data: {}};
  }

  loadHome = () => {
    console.log("loading");
    fetch(API_URL + '/playerRoster')
      .then(this.doListResp)
      .catch(this.doListError);
  }

  render = () => {
    console.log("rerender");
    if (this.state.show === "loadingHome") {
      this.loadHome();
      return <p>Loading...</p>;
    } else if (this.state.show === "loadPlayer") {
      return <p>Loading ${this.state.name} ...</p>
    } else if (this.state.show === "home") {
      return this.renderHome();
    } else if (this.state.show === "player") {
      return this.renderPlayer(this.state.name);
    }
  }

  renderHome = () => {
    return this.renderHomePlayers(this.state.data);
  }

  renderHomePlayers = (players) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {players.map((player, index) => (
        <div
          key={index}
          style={{
            border: '1px solid #ccc',
            padding: '1rem',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: '#f9f9f9',
          }}
          onClick={() => this.onPlayerClick(player)}
        >
          <h3>{player.name}</h3>
          <p>Position: {player.position}</p>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevents the card's onClick from firing
              this.onPlayerClick(player);
            }}
          >
            View Player
          </button>
        </div>
      ))}
    </div>
  );

  onPlayerClick = (player) => {
    console.log(player);
  }
  

  renderPlayer = (name) => {
    return <p>player: </p>
  }

  doListResp = (res) => {
    console.log("getting response");
    if (res.status !== 200) {
      console.log("res code not 200");
      res.text()
         .then((msg) => this.doListError(`bad status code ${res.status}: ${msg}`))
         .catch(() => this.doListError("Failed to parse error response message"));
    } else {
      console.log("res code = 200");
      res.json()
        .then(this.doListJson)
        .catch(() => this.doListError("Failed to parse response data as JSON"))
    }
  }

  doListJson = (data) => {
    console.log("reached")
    if (!Array.isArray(data)) {
      this.doListError();
    } else {
      console.log("setting state")
      this.setState({show:"home", data:data});
    }
  }
  doListError = (msg) => {
    console.error("error fetching from server: " + msg)
  }
}

export default App;
