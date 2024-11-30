import axios from 'axios';
import getNewFeedItems from './feed';
import {
  addFeedItemToNotion,
  deleteOldUnreadFeedItemsFromNotion,
} from './notion';
import htmlToNotionBlocks from './parser';

async function index() {
  try {
    console.log('Fetching new feed items...');
    const feedItems = await getNewFeedItems();
    console.log(`Retrieved ${feedItems.length} feed items`);

    for (let i = 0; i < feedItems.length; i++) {
      const item = feedItems[i];

      // const { data: pageData } = await axios.get(item.link, {
      // });

      const notionItem = {
        title: item.title,
        link: item.link,
        content: htmlToNotionBlocks(item.content, item.link),
        guid: item.guid,
        feedUrl: item.feedUrl,
        pubDate: item.pubDate,
      };

      console.log(`Adding feed item to Notion: ${notionItem.title}`);
      await addFeedItemToNotion(notionItem);
      console.log(`Feed item added: ${notionItem.title}`);
    }

    // console.log('Deleting old unread feed items from Notion...');
    // await deleteOldUnreadFeedItemsFromNotion();
    // console.log('Old unread feed items deleted');
  } catch (error) {
    console.error('Error during process:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
  }
}

index();
