const USER_ID = 'key1';
const USER_PRIV_KEY = 'key2';

const setUserId = (userId) => {
    localStorage.setItem(USER_ID, userId);
}

const setUserPrivKey = (userPrivKey) => {
    localStorage.setItem(USER_PRIV_KEY, userPrivKey);
}

const getUserId = () => {
    return localStorage.getItem(USER_ID);
}

const getUserPrivKey = () => {
    return localStorage.getItem(USER_PRIV_KEY);
}

const removeUserId = () => {
    localStorage.removeItem(USER_ID);
}

const removeUserPrivKey = () => {
    localStorage.removeItem(USER_PRIV_KEY);
}

const login = (userId, userPrivKey) => {
    setUserId(userId);
    setUserPrivKey(userPrivKey);
}

const logOut = () => {
    removeUserId();
    removeUserPrivKey();
}

const isLoggedIn = () => {
    if (getUserId() && getUserPrivKey()) {
        return true;
    } else {
        return false;
    }
}


export { login, logOut, isLoggedIn, getUserId, getUserPrivKey }