import axios from 'axios';
import Parser from 'rss-parser';
import dotenv from 'dotenv';
import timeDifference from './helpers';
import { getFeedUrlsFromNotion } from './notion';

dotenv.config();

const { RUN_FREQUENCY } = process.env;

async function getNewFeedItemsFrom(feedUrl) {
  const parser = new Parser();

  try {
    // Fetch the RSS feed as a string using axios
    const { data: rssString } = await axios.get(feedUrl, {
    });

    // Parse the RSS string into a JSON object
    const rss = await parser.parseString(rssString);
    // Debug: Log the parsed JSON object to check its structure
    console.log('Parsed RSS Feed (JSON):', JSON.stringify(rss, null, 2));

    // add feedUrl to each item
    rss.items = rss.items.map((item) => ({
      ...item,
      feedUrl: feedUrl,
    }));

    return rss.items;

  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function getNewFeedItems() {
  let allNewFeedItems = [];

  const feeds = await getFeedUrlsFromNotion();

  for (let i = 0; i < feeds.length; i++) {
    const { feedUrl } = feeds[i];
    const feedItems = await getNewFeedItemsFrom(feedUrl);
    allNewFeedItems = [...allNewFeedItems, ...feedItems];
  }

  // sort feed items by published date
  allNewFeedItems.sort((a, b) => new Date(a.pubDate) - new Date(b.pubDate));

  return allNewFeedItems;
}
