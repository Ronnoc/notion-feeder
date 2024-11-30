import { markdownToBlocks } from '@tryfabric/martian';
import TurndownService from 'turndown';

function htmlToMarkdownJSON(htmlContent) {
  try {
    const turndownService = new TurndownService();
    // Custom rule to remove all <script> tags and inline JS functions
    turndownService.addRule('removeScriptTags', {
      filter: 'script',
      replacement: () => ''
    });

    return turndownService.turndown(htmlContent);
  } catch (error) {
    console.error(error);
    return {};
  }
}

function jsonToNotionBlocks(markdownContent) {
  return markdownToBlocks(markdownContent);
}

export default function htmlToNotionBlocks(htmlContent) {
  // console.log('Parsing HTML content ', htmlContent);
  const markdownJson = htmlToMarkdownJSON(htmlContent);
  // console.log('Parsed markdownJson:', markdownJson);
  const notionBlocks = jsonToNotionBlocks(markdownJson);
  // console.log('Parsed notionBlocks (JSON):', JSON.stringify(notionBlocks, null, 2));
  // if notionBlocks length is greater than 100, resize to 100
  // as Notion API has a limit of 100 blocks per request
  // if (notionBlocks.length > 100) {
  //   notionBlocks.length = 100;
  // }
  return notionBlocks;
}
