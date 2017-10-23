const request = require("request");
const parseString = require("xml2js").parseString;

const MyAnimeList = function (username, password) {
    this.username = username;
    this.password = password;
    this.token = Buffer.from(`${this.username}:${this.password}`).toString("base64");
};

/**
 * Fetch users anime or manga list.
 * @param {String} username - MAL username
 * @param {String} type - Type of list. Can be "anime" or "manga"
 * @returns {Array} - Array of anime of manga
 * @static
 */
MyAnimeList.getUserList = function (username, type = "anime") {
    if (!username) {
        throw new Error("username is required")
    }
    if (type !== "anime" && type !== "manga") {
        throw new Error("type should be 'anime' or 'manga' only");
    }
    const endpoint = `https://myanimelist.net/malappinfo.php?u=${username}&status=all&type=${type}`;
    return new Promise((resolve, reject) => {
        request.get(endpoint, function (err, resp, body) {
            if (err) { /* Other errors */
                return reject(err);
            }
            if (resp.statusCode < 200 || resp.statusCode > 299) { /* Status Code errors */
                return reject(resp.statusCode);
            }
            parseString(body, function (err, result) {
                resolve(result["myanimelist"][type] || []);
            });
        });
    });
};


/**
 * Search MyAnimeList for anime or manga.
 * @param {String} name - Name of the anime or manga
 * @param {String} type - Type of list. Can be "anime" or "manga"
 * @returns {Array} - Array of anime of manga
 */
MyAnimeList.prototype.search = function (name, type = "anime") {
    if (!name) {
        throw new Error("name is required")
    }
    if (type !== "anime" && type !== "manga") {
        throw new Error("type should be 'anime' or 'manga' only");
    }
    const endpoint = `https://myanimelist.net/api/${type}/search.xml?q=${name}`;
    return new Promise((resolve, reject) => {
        request.get({
            url: endpoint,
            headers: {
                authorization: `Basic ${this.token}`,
            }
        }, function (err, resp, body) {
            if (err && !body) { /* happens during 204 only */
                return resolve([]);
            }
            if (err) { /* Other errors */
                return reject(err);
            }
            if (resp.statusCode < 200 || resp.statusCode > 299) { /* Status Code errors */
                return reject(resp.statusCode);
            }
            parseString(body, function (err, result) {
                resolve(result["anime"]["entry"]);
            });
        });
    });
};

module.exports = MyAnimeList;
