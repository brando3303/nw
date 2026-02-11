import React, { Component } from 'react';
import { Link } from "react-router-dom";
import NSFlogo from './NSF-Logo.JPG';
import { isMobile } from "react-device-detect";

const navItemClassName = "text-slate-600 px-4 py-2 no-underline text-xl m-2 font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif] h-full flex items-center rounded-lg transition-all duration-200 ease-out hover:text-slate-900 hover:bg-red-300/10 hover:shadow-md hover:-translate-y-0.5";

const NavItem = ({ to, children }) => (
  <Link to={to} className="h-full flex p-1 items-center no-underline">
    <span className={navItemClassName}>{children}</span>
  </Link>
);


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
      <div>
        <div className="flex items-center h-[90px] bg-[#FAFAFA] top-0 w-full px-4">
          <img src={NSFlogo} alt={"Logo"} className="border-2 border-black/25 h-20 w-20 rounded-xl p-0 bg-white shadow-sm mr-4" />
          {!isMobile &&
            (
              <p className="flex items-center text-2xl bg-gradient-to-r from-red-700 via-red-500 to-red-400 text-transparent bg-clip-text ml-3">
                College Football Scouting Reports by Nate Leland
              </p>
            )}
          <div className="ml-auto flex items-center h-full">
            <NavItem to={"/home"}>Home</NavItem>
            <NavItem to={"/home"}>About</NavItem>
          </div>
        </div>
        {this.renderMobile(<p className="font-['Roboto',sans-serif] w-full flex justify-center items-center text-[12pt] bg-gradient-to-r from-red-700 via-red-500 to-red-200 text-transparent bg-clip-text">College Football scouting reports by Nate Leland</p>)}
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