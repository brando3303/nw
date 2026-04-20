/* Copyright (c) 2025 Brandon C Bailey
 * Program to pull from the notion workspace, process the data, and push to
 * the database provided. requires bundling with the api password.
*/
const { config } = require("dotenv");
const { NotionHelper } = require("./NotionHelper");
const postgres = require("postgres");

config();
const database_key = process.env.VERCEL_POSTGRES_DB_URL;
const notion_key = process.env.NOTION_API_KEY_NATE_LELAND_SCOUTING;
const notion_page = process.env.NOTION_PAGE_ID_SCOUNTING;

const parseCliArgs = (argv) => {
    const options = {
        pushToDb: false,
        printAllData: false,
        printField: null,
        showHelp: false,
        parseError: null,
    };

    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];

        if (arg === "--help" || arg === "-h") {
            options.showHelp = true;
        } else if (arg === "--push-db") {
            options.pushToDb = true;
        } else if (arg === "--no-push-db") {
            options.pushToDb = false;
        } else if (arg === "--print-all") {
            options.printAllData = true;
        } else if (arg === "--field") {
            const fieldName = argv[i + 1];
            if (fieldName && !fieldName.startsWith("--")) {
                options.printField = fieldName;
                i += 1;
            } else {
                options.parseError = "Missing value for --field. Example: --field year";
            }
        } else if (arg.startsWith("--")) {
            options.parseError = `Unknown option: ${arg}`;
        }
    }

    return options;
};

const printUsage = () => {
    console.log("Usage: node index.js [--push-db] [--print-all] [--field <name>] [--help]");
    console.log("");
    console.log("Options:");
    console.log("  --push-db          Push processed data to the database");
    console.log("  --no-push-db       Explicitly skip database push (default)");
    console.log("  --print-all        Print the full processed payload");
    console.log("  --field <name>     Print a single field for all entries");
    console.log("  --help, -h         Show this help message");
    console.log("");
    console.log("Examples:");
    console.log("  node index.js --push-db --field year");
    console.log("  node index.js --print-all");
    console.log("  node index.js --push-db --print-all");
};

const program = async () => {
    console.log("NSF-NATELELAND.com data retreival. Copyright (c) Brandon C Bailey.")

    const { pushToDb, printAllData, printField, showHelp, parseError } = parseCliArgs(process.argv.slice(2));

    if (parseError) {
        console.error(`Argument error: ${parseError}`);
        printUsage();
        process.exit(1);
    }

    if (showHelp) {
        printUsage();
        process.exit();
    }

    console.log("Retreiving notion pages...")
    const nh = new NotionHelper(notion_key);
    await nh.getData(["2025", "2026"]);
    console.log("Finished retreiving pages, processing data");
    const data = await nh.processDataToHTML();
    console.log("Processing complete.");
    
    // Print output based on arguments
    if (printAllData) {
        console.log(JSON.stringify(data, null, 2));
    } else if (printField) {
        console.log(`\nField "${printField}" for all entries:`);
        data.forEach((entry, index) => {
            console.log(`[${index}] ${entry[printField]}`);
        });
    }
    
    // Push to database if requested
    if (pushToDb) {
        console.log("Sending to database...");
        const sql = postgres(database_key);
        await sql`DELETE FROM players`

         await sql`CREATE TABLE players (
             id SERIAL PRIMARY KEY,
             name Text,  
             position Text,
             score Int,
             playerpage Text,
             playerpage_prev Text,
             date_edited Date,
             player_img Text,
             team_img Text,
             year Text
         )`;
         console.log("Created table. sending data");
        await sql`DELETE FROM players`;
        await sql`INSERT INTO players ${sql(data)}`;

        console.log("Data sent.");
    } else {
        console.log("Database push skipped.");
    }
    
    process.exit();
}

program();