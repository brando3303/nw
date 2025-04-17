import ReactDOM from 'react-dom/client';
import React, { ChangeEvent, Component, MouseEvent } from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
    Link
  } from "react-router-dom";
  import styles from './Styles.module.css'
  import NSFlogo from './NSF-Logo.JPG';
  // import './testStyle.css';


export class TitleBar extends Component {
    render = () => {
        return (
            <div className={styles.navbar}>
              <img src={NSFlogo} alt={"Logo"}/>

              <Link to={"/home"} className={styles.navbar_item_back}>
                <span className={styles.navbar_item}>Home</span>
              </Link>
              <Link to={"/home"} className={styles.navbar_item_back}>
                <span className={styles.navbar_item}>About</span>
              </Link>
              <p className={styles.subtext}>College Football scouting reports by Nate Leland</p>
            </div>
        )};
        // return (
        //     <nav className={styles.topnav}>
        //       <div className={styles.logo}>
        //         <img src={NSFlogo} alt="Logo" />
        //         <a href="/home" className="active">Home</a>
        //       </div>
        //       <div className="nav-right">
        //         <a href="/home">About</a>
        //         <a href="/home">Contact</a>
        //       </div>
        //     </nav>
        //   );
        // return (<header class="header">
        //     <nav class="nav-container">
        //       <a href="#" class="logo">Your Logo</a>
        //       <ul class="nav-menu">
        //         <li><a href="#" class="nav-link">Home</a></li>
        //         <li><a href="#" class="nav-link">About</a></li>
        //         <li><a href="#" class="nav-link">Services</a></li>
        //         <li><a href="#" class="nav-link">Contact</a></li>
        //       </ul>
        //     </nav>
        //   </header>);
        // return (
        //     <header className="header">
        //       <nav className="nav-container">
        //         <a href="/" className="logo">
        //           <span className="logo-icon">🌿</span>
        //           EcoStore
        //         </a>
        //         <ul className="nav-menu">
        //           <li><a href="/" className="nav-link">Home</a></li>
        //           <li><a href="/products" className="nav-link">Products</a></li>
        //           <li><a href="/about" className="nav-link">About</a></li>
        //           <li><a href="/contact" className="nav-link">Contact</a></li>
        //         </ul>
        //       </nav>
        //     </header>
        //   );
    }


export class Footer extends Component {
    render = () => {
        return (<footer className={styles.footer}>
            <div className={styles.footer_content}>
              <div className={styles.footer_section}>
                <a href="https://www.linkedin.com/in/nate-leland-3b255b346/" target="_blank" rel="noopener noreferrer">
                  LinkedIn/NateLeland
                </a>
              </div>
              <div className={styles.footer_section}>
                <p>Contact: <a href="nfleland@gmail.com">nfleland@gmail.com</a></p>
              </div>
            </div>
          </footer>);
    }
}