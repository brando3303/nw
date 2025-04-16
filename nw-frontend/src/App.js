import logo from './logo.svg';
import React, { ChangeEvent, Component, MouseEvent } from 'react';
import './App.css';

let API_URL = "https://nw-api.vercel.app"

export class App extends Component {
  constructor(props) {
    super(props)
    this.state = {show: "loadingHome", data: {}, name:null};
  }

  setState = (state) => {
    super.setState(state);
    console.log("setting state.show to: " + state.show)
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
    console.log("onPlayerClick")
    fetch(API_URL + '/player?name=' + player.name)
    .then(this.doPlayerResp)
    .catch(this.doPlayerError);
  }
  

  renderPlayer = (name) => {
    let p = this.getPlayer(name);
    return     <div dangerouslySetInnerHTML={{ __html: p.playerPage }}/>
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

  doPlayerResp = (res) => {
    console.log("getting response");
    if (res.status !== 200) {
      console.log("res code not 200");
      res.text()
         .then((msg) => this.doPlayerError(`bad status code ${res.status}: ${msg}`))
         .catch(() => this.doPlayerError("Failed to parse error response message"));
    } else {
      console.log("res code = 200");
      res.json()
        .then(this.doPlayerJson)
        .catch(() => this.doPlayerError("Failed to parse response data as JSON"))
    }
  }

  doPlayerJson = (players) => {
    console.log("reached")
    if (!Array.isArray(players)) {
      this.doPlayerError();
    } else {
      let playerData = players[0];
      console.log("setting state: " + JSON.stringify(playerData));
      this.addPlayerPageToState(playerData);
    }
  }
  doPlayerError = (msg) => {
    console.error("error fetching from server: " + msg)
  }

  // also sets state to "player"
  addPlayerPageToState = (player) => {
    let index = this.state.data.findIndex(p => p.name === player.name);
    this.state.data[index].playerPage = player.playerpage;
    this.setState({show:"player", data:this.state.data, name:player.name});
  }

  getPlayer = (name) => {
    let index = this.state.data.findIndex(p => p.name === name);
    return this.state.data[index];
  }
}

export default App;
