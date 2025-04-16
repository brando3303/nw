import ReactDOM from 'react-dom/client';
import {
    BrowserRouter,
    Routes,
    Route,
    useLocation,

  } from "react-router-dom";
import React, { ChangeEvent, Component, MouseEvent, useState } from 'react';
import App from './App';
import { Home } from './Home';
import { PlayerPage } from './PlayerPage' 
import { TitleBar, Footer } from './PageBorders'

export const API_URL = "https://nw-api.vercel.app";

function useQuery() {
    const { search } = useLocation();
  
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

// this Component Class contains all global data for the app. we route between paths with react-router-dom.
// the only globle data is cached player data for the home page. we don't cache player pages, it doesn't break up flow and 
// adds globle data complexity. data is a map from name to player data.
export function NSFApp () {
    let [roster, setRoster] = useState(null);
    let query = useQuery();

    const render = () => {
        return (
            <div>
                    <TitleBar/>
                    <Routes>
                        <Route path="/" element={<Home setRoster={setRoster} roster={roster}/>}/>
                        <Route path="/home" element={<Home setRoster={setRoster} roster={roster}/>}/>
                        <Route path="/player" element={<PlayerPage name={query.get("name")} />}/>
                    </Routes>
                    <Footer/>
            </div>


        )
    }

    return render();
}

export default NSFApp;