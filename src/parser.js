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
  console.log('Parsing HTML content ', htmlContent);
  const markdownJson = htmlToMarkdownJSON(htmlContent);
  console.log('Parsed markdownJson (JSON):', JSON.stringify(markdownJson, null, 2));
  const notionBlocks = jsonToNotionBlocks(markdownJson);
  console.log('Parsed notionBlocks (JSON):', JSON.stringify(notionBlocks, null, 2));
  return notionBlocks;
}
