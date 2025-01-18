import { Client as Client } from "@notionhq/client"
import { config } from "dotenv"

config();



const pageId = process.env.NOTION_PAGE_ID_SCOUTING;
const apiKey = process.env.NOTION_API_KEY_NATE_LELAND_SCOUTING;

const notion = new Client({ auth: apiKey });

async function main() {


    let results = await searchRootAll();

    console.log("length: " + results.length);
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

const searchRootAll = async () => {
    let has_more = true;
    let results = [];
    let start_cursor = undefined;
    while(has_more){
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

const _printNames = (rs) => {
    for(let res of rs){
        console.log(res.properties.title.title[0].text.content);
    }
}


main();
