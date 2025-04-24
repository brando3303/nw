import React, { Component } from 'react';
import { Link } from "react-router-dom";
import styles from './Styles.module.css'
import NSFlogo from './NSF-Logo.JPG';
import { isMobile } from "react-device-detect";


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
      <div className={styles.navbar}>
      <img src={NSFlogo} alt={"Logo"}/>
      <Link to={"/home"} className={styles.navbar_item_back}>
      <span className={styles.navbar_item}>Home</span>
      </Link>
      <Link to={"/home"} className={styles.navbar_item_back}>
      <span className={styles.navbar_item}>About</span>
      </Link>
      {this.renderNotMobile(<p className={styles.subtext}>College Football scouting reports by Nate Leland</p>)}
      </div>
      {this.renderMobile(<p className={styles.mobile_subtext}>College Football scouting reports by Nate Leland</p>)}
      {this.renderMobile(<p className={styles.mobile_subtext}>Mobile Updates Coming Soon!</p>)}
      </div>
    )
  };
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
        </footer>
      );
    }
  }