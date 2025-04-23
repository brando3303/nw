import {
    Routes,
    Route,
    useLocation,
  } from "react-router-dom";
import React, { useState } from 'react';
import { Home } from './Home';
import { PlayerPage } from './PlayerPage' 
import { TitleBar, Footer } from './PageBorders'
import { Analytics } from '@vercel/analytics/react';

export const API_URL = "https://nw-api.vercel.app";

// hook for getting query params
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
                <Analytics/>
                <TitleBar/>
                <Routes>
                    <Route path="/" element={<Home setRoster={setRoster} roster={roster}/>}/>
                    <Route path="/home" element={<Home setRoster={setRoster} roster={roster}/>}/>
                    <Route path="/player" element={<PlayerPage id={query.get("id")} />}/>
                </Routes>
                <Footer/>
            </div>


        )
    }

    return render();
}

export default NSFApp;