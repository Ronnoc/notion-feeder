const { Client } = require("@notionhq/client");

// Initialize the Notion client
const notion = new Client({ auth: process.env.NOTION_API_TOKEN });

async function fetchFeeds() {
  try {
    const databaseId = process.env.NOTION_FEEDS_DATABASE_ID;

    if (!databaseId) {
      console.error("NOTION_FEEDS_DATABASE_ID is not set.");
      process.exit(1);
    }

    console.log("Fetching items from the Notion Feeds database...");
    const response = await notion.databases.query({
      database_id: databaseId,
    });

    console.log("Items in Feeds Database:");
    console.log(JSON.stringify(response.results, null, 2));
  } catch (error) {
    console.error("Error fetching data:", error.message);
    process.exit(1);
  }
}

fetchFeeds();
