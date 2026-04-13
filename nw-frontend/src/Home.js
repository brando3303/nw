import React, { useState, useEffect } from 'react';
import { API_URL } from './NSF';
import PlayerCard from './PlayerCard';

// class component for the home page of the site. facillitates retreiving the globa; data from the server api, sets the data of the parent.
// requires a setData prop and globalData prop. setData is a function which sets global data of the parent.
// globalData is the data given from the parent, if any.
export function Home(props) {
  const [show, setShow] = useState("LoadHome");
  const [roster, setRoster] = useState(props.roster);
  const selectedYear = props.selectedYear || "all";

  useEffect(() => {
    if (props.roster != null) {
      setRoster(props.roster);
      setShow("Home");
    }
  }, [props.roster]);

  useEffect(() => {
    if (roster != null) {
      return;
    }
    fetch(API_URL + '/playerRoster')
      .then(doListResp)
      .catch(doListError);
  }, [roster]);

  const getFilteredRoster = () => {
    if (!Array.isArray(roster)) {
      return [];
    }
    const filteredRoster = selectedYear === "all"
      ? roster
      : roster.filter((player) => player.year === selectedYear);

    return [...filteredRoster].sort((a, b) => {
      const yearA = Number.parseInt(a?.year, 10) || 0;
      const yearB = Number.parseInt(b?.year, 10) || 0;

      if (yearA !== yearB) {
        return yearB - yearA;
      }

      const nameA = (a?.name || "").trim();
      const nameB = (b?.name || "").trim();
      return nameA.localeCompare(nameB, undefined, { sensitivity: "base" });
    });
  };

  const render = () => {
    if (show === "LoadHome") {
      return renderLoadHome();
    } else if (show === "Home") {
      return renderHome();
    }
    console.error("invalid state");
    return null;
  }

  const renderLoadHome = () => {
    if (roster != null) {
      setShow("Home");
      return;
    }
    return (<div className="font-['Playfair_Display',serif] text-[1.5rem] text-[#333] flex justify-center items-center h-[90vh]">
                <p>Loading...</p>
                </div>)
  }

  const renderHome = () => {
    const filteredRoster = getFilteredRoster();
    return (
    <div className="p-0 mb-[30px]">
      {/* <div className="pt-4 pb-2 text-center text-slate-600 font-['Playfair_Display',serif] text-lg">
        {selectedYear === "all" ? "All Years" : selectedYear}
      </div> */}
      <div className="pt-[1%] flex flex-row flex-wrap gap-4 justify-center items-center">
        {filteredRoster.map((player, index) => (
          <PlayerCard
            player={player}
            className="player-card-fade-in"
            style={{ animationDelay: `${Math.min(index * 60, 900)}ms` }}
            key={index}
          />
        ))}
      </div>
      {filteredRoster.length === 0 && (
        <div className="font-['Playfair_Display',serif] text-[1.2rem] text-slate-500 flex justify-center items-center pt-10">
          No players found for this year.
        </div>
      )}
    </div>
    );
  };

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
      res.json()
        .then(doListJson)
        .catch(() => doListError("Failed to parse response data as JSON"))
    }
  }

  const doListJson = (data) => {
    if (!Array.isArray(data)) {
      doListError();
    } else {
      if (roster == null && show != "Home") {
        props.setRoster(data);
        console.log("setting roster: " + JSON.stringify(data));
        setRoster(data);
        setShow("Home");
      }
    }
  }
  const doListError = (msg) => {
    console.error("error fetching from server: " + msg)
  }

  return render();
}



