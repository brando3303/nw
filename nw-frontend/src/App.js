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
    fetch(API_URL + '/playerRoster')
      .then(this.doListResp)
      .catch(this.doListError);
  }

  render = () => {
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
    return <p>home temp, data = ${this.state.data}</p>;
  }

  renderPlayer = (name) => {
    return <p>player: </p>
  }

  doListResp = (res) => {
    if (res.status !== 200) {
      res.text()
         .then((msg) => this.doListError(`bad status code ${res.status}: ${msg}`))
         .catch(() => this.doListError("Failed to parse error response message"));
    } else {
      res.json()
        .then(this.doListJson)
        .catch(() => this.doListError("Failed to parse response data as JSON"))
    }
  }

  doListJSON = (data) => {
    if (!Array.isArray(data)) {
      this.doListError();
    } else {
      this.state.data = data;
    }
  }
  doListError = (msg) => {
    console.log(msg)
  }
}

export default App;
