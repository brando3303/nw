import React, { Component, useState, useRef } from 'react';
import { Link } from "react-router-dom";
import styles from './Styles.module.css'
import searchStyles from './SearchDropdownStyles.module.css'
import NSFlogo from './NSF-Logo.JPG';
import { isMobile } from "react-device-detect";
import { API_URL } from './NSF';


export function TitleBar (props) {

  
  const renderMobile = (element) => {
    if (!isMobile) {
      return;
    }
    return element;
  }

  const renderNotMobile = (element) => {
    if (isMobile) {
      return;
    }
    return element;
  }
  
  const render = () => {
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
      <SearchBar/>
      {renderNotMobile(<p className={styles.subtext}>College Football scouting reports by Nate Leland</p>)}
      </div>
      {renderMobile(<p className={styles.mobile_subtext}>College Football scouting reports by Nate Leland</p>)}
      {renderMobile(<p className={styles.mobile_subtext}>Mobile Updates Coming Soon!</p>)}
      </div>
    )
  };

  return render();
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

  function SearchBar() {
    const [input, setInput] = useState('');  // the state of the input field
    const [sugList, setSugList] = useState([]);  // the list of cached suggestions
    const [suggestion, setSuggestion] = useState('');  // the current suggestion to display
    const [results, setResults] = useState([]);  // the list of results to display
    const [isActive, setIsActive] = useState(false);  // whether the input field is active or not
    const seqNum = useRef(0);  // sequence number to 
  
    const handleChange = (e) => {
      const [prev, lastToken] = breakInput(e.target.value);

      setInput(e.target.value);
      seqNum.current++;
      if (lastToken.length === 0) {
        if (!prev.endsWith(' ')) { 
          setResults([]);
        }
        setSuggestion(prev);
        return;
      }
      
      if (sugList.length > 0) {  // if there are any cached suggestions
        let suggestion = sugList.filter((sug) => {return sug.startsWith(lastToken.toLowerCase())});
        if (suggestion.length > 0) {  // if there is a matching cached word, use it as the suggestion
          setSuggestion(prev + suggestion[0]);
        } else {
          setSuggestion(e.target.value);  // no matching cached word, so just use the input value
        }
      }
      querySearch(lastToken.toLowerCase(), seqNum.current);
    };

    const querySearch = (value, sn) => {
      fetch(API_URL + '/search?search=' + value)
        .then(res => {doSearchResp(res, sn)})
        .catch(doSearchError);
    }

    const doSearchResp = (res, sn) => {
      if (res.status !== 200) {
        res.text()
           .then((msg) => doSearchError(`bad status code ${res.status}: ${msg}`))
           .catch(() => doSearchError("Failed to parse error response message"));
        return;
      } else if (sn !== seqNum.current) {
        return;
      }
      res.json()
         .then(e => doSearchJson(e, sn))
         .catch(doSearchError);
    }

    const doSearchJson = (data, sn) => {
      if (sn !== seqNum.current) {  // if the response is not the latest one, ignore it
        return;
      }
      const [prevWords, lastToken] = breakInput(input);
      if (!Array.isArray(data.closestWord) || data.closestWord.length === 0) {  // no suggestions, so just use the input value
        setSuggestion(prevWords + lastToken);
        setResults([]);
        return;
      }
      setSuggestion(prevWords + data.closestWord[0]);
      setSugList(data.closestWord);
      setResults(data.players || []);
      console.log("this sn == " + sn + ", search response: " + data.closestWord);
    }

    const doSearchError = (msg) => {
      console.error("error fetching from server: " + msg);
    }

    // breaks the value variable into part of text that is not being suggested and part that is.
    // For example, "I want to know the cap" would be broken into "I want to know the " and "cap".
    // " the top of t " => " the top of t " and "" (notice that spaces at the end mean there doesnt need to be a suggestion)
    // " the top of t" => " the top of " and "t"
    const breakInput = (value) => {
      const len = value.length;
      if (len === 0 || value.endsWith(' ')) {
        return [value, ""];
      }

      const queryTokens = value.split(/\s+/);
      const lastToken = queryTokens[queryTokens.length - 1];
      const lastTokenLen = lastToken.length;
      const prevString = value.slice(0, len - lastTokenLen);
      return [prevString, lastToken];
    }


    const render = () => {
      return (
        <div className={searchStyles.anchor}>
          <div className={searchStyles.container}>
          <div className={searchStyles.search_container}>
            <input
              type="text"
              value={suggestion}
              disabled
              className={searchStyles.search_suggestion}
            />
            <input
              type="text"
              value={input}
              onChange={handleChange}
              className={searchStyles.search_input}

            />
          </div>
          {results.length > 0 && (
            <div className={searchStyles.dropdown}>
                {results.map((item, index) => (
                  <SearchItem key={index} id={item.index} name={item.name} />
                ))}
            </div>
          )}
          </div>
    </div>
      );
    }

    function SearchItem(props) {
      return (
        <a href={"/player?id=" + props.id} className={searchStyles.item}>
            {props.name}
        </a>
      );
    }


    return render();
  }