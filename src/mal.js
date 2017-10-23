const {promisify} = require("util");
const request = require("request-promise-native");
const parseString = promisify(require("xml2js").parseString);

const MyAnimeList = function (username, password) {
    this.username = username;
    this.password = password;
    this.token = Buffer.from(`${this.username}:${this.password}`).toString("base64");
};

/**
 * Fetch users anime or manga list.
 * @param {String} username - MAL username
 * @param {String} type - Type of list. Can be "anime" or "manga".
 * @static
 */
MyAnimeList.getUserList = async function (username, type = "anime") {
    if (!username) {
        throw new Error("username is required")
    }
    if (type !== "anime" && type !== "manga") {
        throw new Error("type should be 'anime' or 'manga' only");
    }
    const endpoint = `https://myanimelist.net/malappinfo.php?u=${username}&status=all&type=${type}`;
    try {
        const response = await request.get(endpoint);
        return await parseString(response);
    } catch (err) {
        throw new Error(err.message);
    }
};


/**
 * Search MyAnimeList for anime or manga.
 * @param {String} name - Name of the anime or manga.
 * @param {String} type - Type of list. Can be "anime" or "manga".
 * @todo: need to handle 204 empty returns
 */
MyAnimeList.prototype.search = async function (name, type="anime") {
    if (!name) {
        throw new Error("name is required")
    }
    if (type !== "anime" && type !== "manga") {
        throw new Error("type should be 'anime' or 'manga' only");
    }
    const endpoint = `https://myanimelist.net/api/${type}/search.xml?q=${name}`;
    try {
        const response = await request.get(endpoint, {
            headers: {
                authorization: `Basic ${this.token}`,
            }
        });
        return await parseString(response);
    } catch (err) {
        throw new Error(err.message);
    }
};

module.exports = MyAnimeList;
