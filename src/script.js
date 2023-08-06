import { createClient } from "@sanity/client";

const PROJECT_ID = 'jrx60lbk';
const API_TOKEN = 'skZlBezOtpBXOcOi75aYhChP751RZkvfIPCAtObDWcIx3DsxDyHbGeDIJ3CzKxvi0BE4gxElfRhkLEcmmkQ92vtFgNOVOhBeLydHrF5fsJg2ugEf7feoyxuXYA1Wmzwi2KDHPvCSrpSWrV0k2M0ZAR341IV1EEeRQNTipkXRCllWU60azh0M';
const DATASET = 'production';

const client = createClient({
    projectId: PROJECT_ID,
    dataset: DATASET,
    useCdn: false,
    token: API_TOKEN
});

async function deleteAllArticles() {
    try {
      // Query to fetch all article documents
      const query = `*[_type == 'articles']{_id}`;
  
      // Fetch all article documents
      const articles = await client.fetch(query);
  
      // Delete each article document one by one
      for (const article of articles) {
        await deleteArticle(article._id);
        console.log(`Article with ID ${article._id} deleted.`);
      }
  
      console.log('All articles deleted successfully.');
    } catch (error) {
      console.error('Error deleting articles:', error.message);
    }
  }
  
  // Function to delete a single article by ID
  async function deleteArticle(articleId) {
    try {
      // Use the Sanity client to perform the deletion
      await client.delete(articleId);
    } catch (error) {
      console.error(`Error deleting article with ID ${articleId}:`, error.message);
      throw new Error(`Error deleting article with ID ${articleId}`);
    }
  }

deleteAllArticles();