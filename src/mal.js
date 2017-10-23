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
 * @param {String} type - Type of list. Can be "anime" or "manga".
 * @static
 */
MyAnimeList.getUserList = function (username, type = "anime") {
    if (!username) {
        throw new Error("username is required")
    }
    if (type !== "anime" && type !== "manga") {
        throw new Error("type should be 'anime' or 'manga' only");
    }
    const endpoint = `https://myanimelist.net/mal23appinfo.php?u=${username}&status=all&type=${type}`;
    return new Promise((resolve, reject) => {
        request.get(endpoint, function (err, resp, body) {
            if (err) { /* Other errors */
                return reject(err);
            }
            if (resp.statusCode < 200 || resp.statusCode > 299) { /* Status Code errors */
                return reject(resp.statusCode);
            }
            parseString(body, function (err, result) {
                resolve(result);
            });
        });
    });
};


/**
 * Search MyAnimeList for anime or manga. Remember if this promise is rejected
 * with 204, it means that the anime or manga does not exist in MyAnimeList.
 * @param {String} name - Name of the anime or manga.
 * @param {String} type - Type of list. Can be "anime" or "manga".
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
                return reject(204);
            }
            if (err) { /* Other errors */
                return reject(err);
            }
            if (resp.statusCode < 200 || resp.statusCode > 299) { /* Status Code errors */
                return reject(resp.statusCode);
            }
            parseString(body, function (err, result) {
                resolve(result);
            });
        });
    });
};

module.exports = MyAnimeList;
