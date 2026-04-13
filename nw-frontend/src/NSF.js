import {
    Routes,
    Route,
    useLocation,
    useParams,
    Navigate,
  } from "react-router-dom";
import React, { useState } from 'react';
import { Home } from './Home';
import { PlayerPage } from './PlayerPage' 
import { TitleBar, Footer } from './PageBorders'
import { Analytics } from '@vercel/analytics/react';

export const API_URL = "http://localhost:3030";   // "https://nw-api.vercel.app";
const SUPPORTED_YEARS = ["all", "2025", "2026"];

// hook for getting query params
function useQuery() {
    const { search } = useLocation();
  
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

// this Component Class contains all global data for the app. we route between paths with react-router-dom.
// the only global data is cached player data for the home page. we don't cache player pages, it doesn't break up flow and 
// adds global data complexity. data is a map from name to player data.
export function NSFApp () {
    const [roster, setRoster] = useState(null);
    const query = useQuery();

    const HomeRoute = () => {
        const { year } = useParams();
        const selectedYear = (year || "all").toLowerCase();
        if (!SUPPORTED_YEARS.includes(selectedYear)) {
            return <Navigate to="/home/all" replace />;
        }
        return <Home setRoster={setRoster} roster={roster} selectedYear={selectedYear} />;
    };

    const render = () => {
        return (
            <div>
                <Analytics/>
                <TitleBar/>
                <Routes>
                    <Route path="/" element={<Navigate to="/home/all" replace />}/>
                    <Route path="/home" element={<Navigate to="/home/all" replace />}/>
                    <Route path="/home/:year" element={<HomeRoute />}/>
                    <Route path="/player" element={<PlayerPage id={query.get("id")} />}/>
                </Routes>
                <Footer/>
            </div>


        )
    }

    return render();
}

export default NSFApp;