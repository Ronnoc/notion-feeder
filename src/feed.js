import Parser from 'rss-parser';
import dotenv from 'dotenv';
import timeDifference from './helpers';
import { getFeedUrlsFromNotion } from './notion';

dotenv.config();

const { RUN_FREQUENCY } = process.env;

async function getNewFeedItemsFrom(feedUrl) {
  const parser = new Parser();
  let rss;
  let attempts = 0;
  const maxAttempts = 3;
  const retryDelay = 3000; // Delay in milliseconds before retrying

  while (attempts < maxAttempts) {
    try {
      rss = await parser.parseURL(feedUrl);
      break; // Exit loop if request is successful
    } catch (error) {
      attempts++;
      console.error(`Error fetching feed from ${feedUrl} (Attempt ${attempts}):`, error.message);

      if (attempts >= maxAttempts) {
        console.error(`Failed to fetch feed after ${maxAttempts} attempts.`);
        return []; // Return an empty array if all retries fail
      }

      console.log(`Retrying in ${retryDelay / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay)); // Wait before retrying
    }
  }

  const currentTime = new Date().getTime() / 1000;

  // Filter out items that fall in the run frequency range
  return rss.items.filter((item) => {
    const blogPublishedTime = new Date(item.pubDate).getTime() / 1000;
    const { diffInSeconds } = timeDifference(currentTime, blogPublishedTime);
    return diffInSeconds < RUN_FREQUENCY;
  });
}

export default async function getNewFeedItems() {
  let allNewFeedItems = [];

  const feeds = await getFeedUrlsFromNotion();

  for (let i = 0; i < feeds.length; i++) {
    const { feedUrl } = feeds[i];
    const feedItems = await getNewFeedItemsFrom(feedUrl);
    allNewFeedItems = [...allNewFeedItems, ...feedItems];
  }

  // Sort feed items by published date
  allNewFeedItems.sort((a, b) => new Date(a.pubDate) - new Date(b.pubDate));

  return allNewFeedItems;
}
