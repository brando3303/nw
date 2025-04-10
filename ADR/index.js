import { Client as Client } from "@notionhq/client"
import { config } from "dotenv"
import { sql, createPool } from "@vercel/postgres"
import {DataBaseHelper} from "./DataBaseHelper.js"

config();



const apiKey = process.env.NOTION_API_KEY_NATE_LELAND_SCOUTING;
const vercelConnectionKey = process.env.VERCEL_POSTGRES_DB_URL;
console.log(vercelConnectionKey)

const notion = new Client({ auth: apiKey });

async function main() {

    // db testing
    let h = new DataBaseHelper(vercelConnectionKey);
    await h.init();
    await h.insertMany([{name:"nqqqt", position: "scot", playerpage:"lackig"}, {name:"ndddt", position: "scot", playerpage:"lackig"}]);
    console.log([{name:"nqqqt", position: "scot", playerpage:"lackig"}, {name:"ndddt", position: "scot", playerpage:"lackig"}]);
    // get the results from the entire database (max 3 pages of pages)
    let results = await searchRootAll(10);

    console.log("length: " + results.length);
    // create the datastructure of the entire player database
    //console.log(JSON.stringify(results, null, 2));
    results = processSearchData(results);
    //console.log(JSON.stringify(results, null, 1));

    console.log(results.positions[0].players[0].name);
    // const response = await notion.blocks.children.list({
    //     block_id: results.positions[0].players[0].pageId,
    //     page_size: 100,
    // });
    // console.log(JSON.stringify(response,null,2));
    console.log(await playerPageToHTML(results.positions[0].players[0].pageId));
    //console.log(await positionListToPlayerList(results.positions))
    h.insertMany(await positionListToPlayerList(results.positions));
    // const response = await notion.search({
    //     //query: '2025',
    //     // filter: {
    //     //     value: 'page',
    //     //     property: 'object'
    //     // },
    //     sort: {
    //         direction: 'ascending',
    //         timestamp: 'last_edited_time'
    //     },
    // });
    // //console.log("response: " + JSON.stringify(response, null, 2));
    // let results = response.results;
    // console.log(results.length + " results in total");

}

// creates an HTML page from the contents of the page pageId refers to.
// currently limited to 100 blocks. supports paragraphs and bullet lists.
// returns null if error occurs (silently haha). returns a string containing
// HTML
const playerPageToHTML = async (pageId) => {
    // get notion page connected to player
    const page = await notion.blocks.children.list({
        block_id: pageId,
        page_size: 100,
    });
    // iterate through player page and compile blocks into HTML
    let outHTML = "<div>";
    let bulleted = false;
    for (let block of page.results) {
        if (block.type === "paragraph") {
            if(bulleted) {
                bulleted = false;
                outHTML += "</ul>";
            }
            outHTML += "<p>" + getParagraph(block) + "</p>";
        } else if (block.type === "bulleted_list_item") {
            if(!bulleted) {
                bulleted = true;
                outHTML += "<ul>";
            }
            if (block.bulleted_list_item.rich_text != null && block.bulleted_list_item.rich_text[0] != null && 
                block.bulleted_list_item.rich_text[0].plain_text != null) {
                outHTML += "<li>" + block.bulleted_list_item.rich_text[0].plain_text + "</li>";
            }
        }
    }
    outHTML += "</div>"
    return outHTML;
}

// gets the text paragraph from a text block
const getParagraph = (block) => {
    if (block.type !== "paragraph") return null;
    if (block.paragraph.rich_text != null && block.paragraph.rich_text[0] != null && 
        block.paragraph.rich_text[0].plain_text != null) {
        return block.paragraph.rich_text[0].plain_text;
    }
}

// post search notion root num_pages times. places all results into an array and returns it.
const searchRootAll = async (num_pages) => {
    let has_more = true;
    let results = [];
    let start_cursor = undefined;
    for (let i = 0; has_more && i < num_pages; i++) {
        console.log("new call, res len: " + results.length);
        const response = await notion.search({
            //query: '2025',
            // filter: {
            //     value: 'page',
            //     property: 'object'
            // },
            sort: {
                direction: 'ascending',
                timestamp: 'last_edited_time'
            },
            start_cursor: start_cursor,
        });
        //_printNames(response.results);
        //console.log("current response len: " + response.results.length);
        has_more = response.has_more;
        results = results.concat(response.results);
        start_cursor = response.next_cursor;
    }

    return results;
}

// prints the names of pages. rs is an array of pages
const _printNames = (rs) => {
    for(let res of rs){
        console.log(res.properties.title.title[0].text.content);
    }
}

// takes search data and places it into the required
// data structure (2025 -> positions -> players -> (name, ...))
const processSearchData = (searchResults) => {
    // check that the input is correct
    if (!Array.isArray(searchResults)) {
        console.error("processSearchData: passed argument was not an array");
        return null;
    };

    let processed = {positions:[]};
    // 1) find 2025 (ttf), get pageId
    let ttfPage = getPageInSearchTitle(searchResults, "2025");
    let ttfPageId = ttfPage.id;
    // 2) fill in the data structure
    for (let i = 0; i < searchResults.length; i++) {
        let position = searchResults[i];
        if(position.parent.page_id === ttfPageId) {
            //populate this position
            let positionEntry = {positionName: getPageTitle(position),
                                 pageId: position.id,
                                 players: []
                                }

            //found a position page, next find all children (players)
            //searchResults = searchResults.splice(i,1);
            for (let j = 0; j < searchResults.length; j++) {
                let player = searchResults[j];
                if (player.parent.page_id === positionEntry.pageId) {
                    // found a child (player), populate and add to position
                    let playerEntry = 
                    {
                        name: getPageTitle(player),
                        pageId: player.id,
                        parentPageId: player.parent.page_id
                    }
                    positionEntry.players.push(playerEntry);
                }
            }
            processed.positions.push(positionEntry);
        }
    }

    return processed;
}

// finds and returns the search result profile of a 
// page with the specified title. returns null if does 
// not exist.
const getPageInSearchTitle = (searchResults, title) => {
    for (let p of searchResults) {
        if (p.properties.title.title[0].text.content === title) {
            return p;
        }
    }
    return null;
}

// requires page is a notion page. returns the page's title
const getPageTitle = (page) => {
    return page.properties.title.title[0].text.content;
}
// finds all pages in an array with a matching parent pageId. returns 
// an array of them.
const getPageInSearchParent = (pageArr, parentPageId) => {
    let out = [];
    for (let p of pageArr) {
        if(p.parent.page_id === parentPageId) {
            out.push(p);
        }
    }
    return out;

}

const getPlayerFromProcRes = (name, results) => {
    for (let pos of results.position) {
        for (let plr of pos.positions) {
            if (plr.name === name) {
                return plr;
            }
        }
    }
    return null;
}

const positionListToPlayerList = async (positions) => {
    const list = [];
    for (let pos of positions) {
        for (let player of pos.players) {
            if (player.name == null || pos.positionName == null ||player.pageId == null) {
                console.log(player.name + pos.positionName + playerPageToHTML(player.pageId));
            }
            if (typeof player.name ==='string' && typeof pos.positionName === 'string'){
                list.push({
                    name: player.name,
                    position: pos.positionName,
                    playerpage: await playerPageToHTML(player.pageId)
                });
            }
        }
    }   
    return list;
}

main();
