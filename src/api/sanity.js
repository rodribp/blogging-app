import { createClient } from "@sanity/client";
import { hashPassword } from "./security";
const PROJECT_ID = 'jrx60lbk';
const API_TOKEN = 'skZlBezOtpBXOcOi75aYhChP751RZkvfIPCAtObDWcIx3DsxDyHbGeDIJ3CzKxvi0BE4gxElfRhkLEcmmkQ92vtFgNOVOhBeLydHrF5fsJg2ugEf7feoyxuXYA1Wmzwi2KDHPvCSrpSWrV0k2M0ZAR341IV1EEeRQNTipkXRCllWU60azh0M';
const DATASET = 'production';

const client = createClient({
    projectId: PROJECT_ID,
    dataset: DATASET,
    useCdn: false,
    token: API_TOKEN
});

const userSchema = async (name, walletname, password, privkey, lnurlStr) => {
    let hash = await hashPassword(password);
    return {
        _type: 'users',
        username: name,
        wallet: walletname,
        password: hash,
        key: privkey,
        lnurlp: lnurlStr
    }
}

const articleSchema = (title, content, usrId) => {
    return {
        _type: 'articles',
        title: title,
        content: content,
        author: {
            _type: 'reference',
            _ref: usrId
        }
    }
}

const followSchema = (loggedId, followedId) => {
    return {
        _type: 'following_ledger',
        follower: {
            _type: 'reference',
            _ref: loggedId
        },
        followed: {
            _type: 'reference',
            _ref: followedId
        }
    }
}

const insertSanity = async (data) => {
    try {
        const response = await client.create(data);
        return response;
    } catch (error) {
        console.error('error inserting data: ', error.message)
    }
}

const getUserIdByPrivKey = async (privkey) => {
    try {
      const userQuery = `*[_type == 'users' && key == $privkey]{ _id, password }`;
      const params = { privkey };
  
      const users = await client.fetch(userQuery, params);
  
      if (users.length > 0) {
        const user = {id: users[0]._id, hash: users[0].password};
        return user;
      } else {
        console.log(`User with privkey ${privkey} not found.`);
      }
    } catch (error) {
      console.error('Error fetching user:', error.message);
    }
}

const getAllArticles = async () => {
    try {
        const Query = `*[_type == 'articles'] | order(_createdAt desc) {"author": author -> {
            _id,
            username,
            wallet,
            lnurlp
        }, title, content}`;

        const articles = await client.fetch(Query);

        return articles;
    } catch (error) {
        console.error('Error fetching articles: ', error.message)
    }
}

async function deleteAllFollowingLedgerDocuments() {
    try {
      // Query to select all "following_ledger" documents
      const query = `*[_type == 'following_ledger']{_id}`;
  
      // Perform the Bulk Delete operation
      const documents = await client.fetch(query);
      const documentIds = documents.map((doc) => doc._id);
      
        documentIds.map(async (docId) => {const result = await client.delete(docId)});
  
      console.log(`${documentIds.length} following_ledger documents deleted successfully.`);
    } catch (error) {
      console.error('Error deleting following_ledger documents:', error.message);
    }
  }
  
  // Function to delete a single "following_ledger" document by ID
  async function deleteFollowingLedgerDocument(documentId) {
    try {
      // Use the Sanity client to perform the deletion
      await client.delete(documentId);
    } catch (error) {
      console.error(`Error deleting following_ledger document with ID ${documentId}:`, error.message);
      throw new Error(`Error deleting following_ledger document with ID ${documentId}`);
    }
  }

export { userSchema, articleSchema, insertSanity, getUserIdByPrivKey, getAllArticles, followSchema, deleteAllFollowingLedgerDocuments }