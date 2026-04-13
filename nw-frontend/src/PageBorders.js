import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import NSFlogo from './NSF-Logo.JPG';
import { isMobile } from "react-device-detect";

const yearTabClassName = "px-5 py-2.5 rounded-lg text-[0.96rem] no-underline transition-all duration-200 font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]";
const YEAR_TABS = ["all", "2025", "2026"];

const YearTab = ({ year }) => {
  const label = year === "all" ? "All" : year;
  return (
    <NavLink
      to={`/home/${year}`}
      className={({ isActive }) =>
        `${yearTabClassName} ${isActive
          ? "bg-white text-slate-900 shadow-[0_6px_14px_rgba(15,23,42,0.12)]"
          : "text-slate-600 hover:text-slate-900 hover:bg-white/75"
        }`
      }
    >
      {label}
    </NavLink>
  );
};


export class TitleBar extends Component {

  renderMobile = (element) => {
    if (!isMobile) {
      return;
    }
    return element;
  }

  renderNotMobile = (element) => {
    if (isMobile) {
      return;
    }
    return element;
  }

  render = () => {
    return (
      <div className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-md shadow-[0_10px_30px_rgba(15,23,42,0.07)]">
        <div className="mx-auto flex h-[104px] w-full max-w-[1440px] items-center justify-between px-6 sm:px-10 lg:px-14">
          <div className="flex items-center gap-5 lg:gap-7">
            <img
              src={NSFlogo}
              alt={"Logo"}
              className="h-16 w-16 rounded-2xl border border-black/10 bg-white p-0 shadow-[0_8px_20px_rgba(15,23,42,0.12)] sm:h-[76px] sm:w-[76px]"
            />
            {!isMobile && (
              <div className="hidden flex-col lg:flex">
                <p className="text-[1.45rem] font-semibold tracking-[0.2px] text-slate-900 leading-tight">
                  Next Star Football
                </p>
                <p className="text-[0.9rem] leading-tight bg-gradient-to-r from-red-700 via-red-500 to-orange-400 text-transparent bg-clip-text">
                  College Football Scouting Reports by Nate Leland
                </p>
              </div>
            )}
          </div>
          <div className="flex min-w-0 items-center pl-4 lg:pl-8">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100/85 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] overflow-x-auto">
              {YEAR_TABS.map((year) => (
                <YearTab key={year} year={year} />
              ))}
            </div>
          </div>
        </div>
        {this.renderMobile(
          <p className="pb-2 text-center text-[11pt] font-['Roboto',sans-serif] bg-gradient-to-r from-red-700 via-red-500 to-orange-300 text-transparent bg-clip-text">
            College Football scouting reports by Nate Leland
          </p>
        )}
      </div>
    )
  };
}




export class Footer extends Component {
  render = () => {
    return (<footer className="h-[120px] w-full flex bg-[#eeeeee] text-[#8c8c8c] border-t border-solid border-t-[#c9c9c9] font-['Playfair_Display',serif] text-[1rem] items-center justify-center">
      <div className="p-0">
        <div className="p-0">
          <a href="https://www.linkedin.com/in/nate-leland-3b255b346/" target="_blank" rel="noopener noreferrer">
            LinkedIn/NateLeland
          </a>
        </div>
        <div className="p-0">
          <p>Contact: <a href="nfleland@gmail.com">nfleland@gmail.com</a></p>
        </div>
      </div>
    </footer>
    );
  }
}