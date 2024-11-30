import { markdownToBlocks } from '@tryfabric/martian';
import TurndownService from 'turndown';

function htmlToMarkdownJSON(htmlContent) {
  try {
    const turndownService = new TurndownService();
    // Custom rule to remove all <script> tags and inline JS functions
    turndownService.addRule('removeScriptTags', {
      filter: 'script',
      replacement: () => '',
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

export default function htmlToNotionBlocks(htmlContent, url) {
  // console.log('Parsing HTML content ', htmlContent);
  const markdownJson = htmlToMarkdownJSON(htmlContent);
  // console.log('Parsed markdownJson:', markdownJson);
  const notionBlocks = jsonToNotionBlocks(markdownJson);
  // append Emb notion block
  notionBlocks.push({
    object: 'block',
    type: 'embed',
    embed: {
      url: url,
    },
  });
  return notionBlocks;
}
