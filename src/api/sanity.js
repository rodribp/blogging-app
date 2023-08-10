import { createClient } from "@sanity/client";
import { hashPassword } from "./security";
const PROJECT_ID = 'jrx60lbk';
const API_TOKEN = 'skZlBezOtpBXOcOi75aYhChP751RZkvfIPCAtObDWcIx3DsxDyHbGeDIJ3CzKxvi0BE4gxElfRhkLEcmmkQ92vtFgNOVOhBeLydHrF5fsJg2ugEf7feoyxuXYA1Wmzwi2KDHPvCSrpSWrV0k2M0ZAR341IV1EEeRQNTipkXRCllWU60azh0M';
const DATASET = 'dataset1';

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


export { userSchema, articleSchema, insertSanity, getUserIdByPrivKey, getAllArticles }