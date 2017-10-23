const {promisify} = require("util");
const request = require("request-promise-native");
const parseString = promisify(require("xml2js").parseString);

const MyAnimeList = function (username, password) {
    this.username = username;
    this.password = password;
};

/**
 * Fetches users anime or manga list
 * @param {String} username - MAL username
 * @param {String} type - Type of list. Can be "anime" or "manga".
 * @static
 */
MyAnimeList.getUserList = async function (username, type = "anime") {
    if (!username) {
        throw new Error("username is required")
    }
    if (type !== "anime" && type !== "manga") {
        throw new Error("type should be 'anime' or 'manga' only.");
    }
    try {
        const endpoint = `https://myanimelist.net/malappinfo.php?u=${username}&status=all&type=${type}`;
        const response = await request.get(endpoint);
        return await parseString(response);
    } catch (err) {
        throw new Error(err.message);
    }
};

module.exports = MyAnimeList;
