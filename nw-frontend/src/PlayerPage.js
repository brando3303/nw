import React, { useState, useEffect } from 'react';
import { API_URL } from './NSF';

// class component player page. requires 
export function PlayerPage(props) {
    let [show, setShow] = useState("loadPlayer");
    let [player, setPlayer] = useState(null);

    const getScoreColor = (score) => {
        const value = Number(score);
        if (!Number.isFinite(value)) {
            return "#6b7280";
        }
        const clamped = Math.max(0, Math.min(100, value));
        const normalized = Math.max(0, Math.min(1, (clamped - 60) / 40));
        const t = Math.pow(normalized, 0.6);
        const r = Math.round(107 + (220 - 107) * t);
        const g = Math.round(114 + (38 - 114) * t);
        const b = Math.round(128 + (38 - 128) * t);
        return `rgb(${r}, ${g}, ${b})`;
    };

    ///////////////////////////////////////////////////////////////////////////////
    // network response handlers
    ///////////////////////////////////////////////////////////////////////////////
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
            if (players.length === 0) {
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
        console.error("error fetching player from server: " + msg);
        setShow("error");
    }

    ///////////////////////////////////////////////////////////////////////////////
    // hooks
    ///////////////////////////////////////////////////////////////////////////////


    useEffect(() => {
        console.log(props.name);
        fetch(API_URL + '/player?id=' + props.id)
            .then(doPlayerResp)
            .catch(doPlayerError);
    }, [])

    ///////////////////////////////////////////////////////////////////////////////
    // state renderers
    ///////////////////////////////////////////////////////////////////////////////


    const render = () => {
        console.log("rerender");
        if (show === "loadPlayer") {
            return renderPlayerPageLoading();
        } else if (show === "player") {
            return renderPlayerPage();
        } else if (show === "error") {
            return renderError();
        }
    }

    const renderPlayerPageLoading = () => {
        return (<div className="font-['Playfair_Display',serif] text-[1.5rem] text-[#333] flex justify-center items-center h-[90vh]">
            <p>Loading...</p>
        </div>)
    }

    const renderPlayerPage = () => {

        return (<div>
            <div className="relative w-full h-[40vh] overflow-visible flex justify-center items-start max-md:h-[30vh]">
                <img src={player.player_img} alt={player.name} className="w-full h-auto object-cover object-top" />
            </div>
            <SlideInText player={player} />
        </div>)
    }

    const renderError = () => {
        return <p>Sorry, there was an error loading this page...</p>;
    }


    return render();
}


function SlideInText(props) {
    const [show, setShow] = useState(false);
    useEffect(() => {
        // Trigger the animation shortly after mount
        setTimeout(() => set(), 100);
    }, []);

    const set = () => {
        console.log("setting to true");
        setShow(true)
    }

    return (
        <div className={`font-['Playfair_Display',serif] text-lg leading-[1.8] text-[#333] bg-[#faf9f7] my-8 mx-auto max-w-[800px] p-6 text-justify tracking-[0.3px] [word-spacing:1px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] rounded-[12px] transition-[transform,opacity] duration-[400ms] ease-[ease] [&>p]:mb-5 last:[&>p]:mb-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4 [&_li]:mb-2 ${show ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}>
            <div className="flex items-end gap-10 max-w-[90%] w-full justify-center">
                <div className="text-[2.5rem] truncate">{props.player.name}</div>
                <div className="flex items-end gap-1">
                    <span className="text-[2.5rem] font-semibold text-red-500">{props.player.score}</span>
                    <span className="text-sm text-[#9aa0a6] mb-1">/100</span>
                </div>
            </div>
            <div dangerouslySetInnerHTML={{ __html: props.player.playerpage }} />
        </div>
    );
};