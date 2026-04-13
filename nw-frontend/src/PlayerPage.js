import React, { useState, useEffect } from 'react';
import { API_URL } from './NSF';

// class component player page. requires 
export function PlayerPage(props) {
    let [show, setShow] = useState("loadPlayer");
    let [player, setPlayer] = useState(null);

    const getScoreColor = (score) => {
        const value = Number(score);
        if (!Number.isFinite(value)) {
            return "#94a3b8"; // slate-400
        }
        const clamped = Math.max(0, Math.min(100, value));

        // Color stops: [score threshold, r, g, b]
        const stops = [
            [60,  148, 163, 184], // slate-400  — low
            [73,  251, 191,  36], // amber-400  — below average
            [85,  249, 115,  22], // orange-500 — average
            [93,  239,  68,  68], // red-500    — good
            [100, 220,  38,  38], // red-600    — elite
        ];

        if (clamped <= stops[0][0]) return `rgb(${stops[0][1]}, ${stops[0][2]}, ${stops[0][3]})`;

        for (let i = 1; i < stops.length; i++) {
            const [prevScore, pr, pg, pb] = stops[i - 1];
            const [nextScore, nr, ng, nb] = stops[i];
            if (clamped <= nextScore) {
                const t = (clamped - prevScore) / (nextScore - prevScore);
                return `rgb(${Math.round(pr + (nr - pr) * t)}, ${Math.round(pg + (ng - pg) * t)}, ${Math.round(pb + (nb - pb) * t)})`;
            }
        }

        const last = stops[stops.length - 1];
        return `rgb(${last[1]}, ${last[2]}, ${last[3]})`;
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
        const scoreColor = getScoreColor(player?.score);

        return (<div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fff6f4_0%,_#ffffff_45%,_#f6f8fb_100%)] pb-10">
            <div className="relative h-[52vh] w-full overflow-hidden max-md:h-[44vh]">
                <img
                    src={player.player_img}
                    alt={player.name}
                    className="h-full w-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/35 to-transparent" />

                <div className="absolute bottom-0 left-1/2 w-full max-w-5xl -translate-x-1/2 px-4 pb-5">
                    <div className="rounded-2xl border border-white/30 bg-white/20 p-4 text-white shadow-[0_10px_35px_rgba(15,23,42,0.28)] backdrop-blur-md md:p-5">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <div className="text-[0.78rem] uppercase tracking-[0.2em] text-white/80">Player Profile</div>
                                <h1 className="mt-1 font-['Playfair_Display',serif] text-[2.1rem] leading-tight md:text-[2.6rem]">
                                    {player.name}
                                </h1>
                                <div className="mt-2 flex flex-wrap items-center gap-2 text-[0.78rem] tracking-wide text-white/90">
                                    {player.position && <span className="rounded-full border border-white/35 px-3 py-1">{player.position}</span>}
                                    {player.year && <span className="rounded-full border border-white/35 px-3 py-1">Class of {player.year}</span>}
                                </div>
                            </div>

                            <div className="rounded-xl border border-white/40 bg-white/15 px-4 py-3 text-right">
                                <div className="text-[0.7rem] uppercase tracking-[0.14em] text-white/75">Score</div>
                                <div className="leading-none" style={{ color: scoreColor }}>
                                    <span className="text-[2.15rem] font-semibold">{player.score}</span>
                                    <span className="ml-1 text-sm text-white/80">/100</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <SlideInText player={player} scoreColor={scoreColor} />
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
        const timer = setTimeout(() => setVisible(), 80);
        return () => clearTimeout(timer);
    }, []);

    const setVisible = () => {
        console.log("setting to true");
        setShow(true)
    }

    return (
        <div className="mx-auto mt-8 w-full max-w-5xl px-4">
            <div className={`rounded-2xl border border-slate-200/80 bg-white px-5 py-6 shadow-[0_12px_34px_rgba(15,23,42,0.08)] transition-[transform,opacity] duration-500 ease-out md:px-8 md:py-8 ${show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                        <div className="font-['Playfair_Display',serif] text-[1.7rem] text-slate-900 md:text-[2rem]">Scouting Notes</div>
                    </div>
                    <div className="flex items-end gap-1">
                        <span className="text-[1.9rem] font-semibold" style={{ color: props.scoreColor }}>{props.player.score}</span>
                        <span className="mb-1 text-sm text-slate-400">/100</span>
                    </div>
                </div>

                <div
                    className="font-['Playfair_Display',serif] text-[1.08rem] leading-[1.9] tracking-[0.2px] text-slate-700 [&>p]:mb-5 last:[&>p]:mb-0 [&_a]:font-medium [&_a]:text-red-700 hover:[&_a]:text-red-800 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2"
                    dangerouslySetInnerHTML={{ __html: props.player.playerpage }}
                />
            </div>
        </div>
    );
};