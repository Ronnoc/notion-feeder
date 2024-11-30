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

    // Debug: Log the raw RSS string to inspect its contents
    console.log('Raw RSS Feed String:', rssString);
    // Parse the RSS string into a JSON object
    const rss = await parser.parseString(rssString);
    // Debug: Log the parsed JSON object to check its structure
    console.log('Parsed RSS Feed (JSON):', JSON.stringify(rss, null, 2));

    const currentTime = new Date().getTime() / 1000;

    // Filter out items that fall in the run frequency range
    return rss.items.filter((item) => {
      const blogPublishedTime = new Date(item.pubDate).getTime() / 1000;
      const { diffInSeconds } = timeDifference(currentTime, blogPublishedTime);
      return diffInSeconds < RUN_FREQUENCY;
    });

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
