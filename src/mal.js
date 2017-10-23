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
            if (err) reject(err);
            if (resp.statusCode < 200 || resp.statusCode > 299) {
                reject(resp.statusCode);
            }
            parseString(body, function (err, result) {
                resolve(result);
            });
        })
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
        // Why not use the callback method?
        // Well, with that approach we cant capture the 204 because
        // request starts parsing the body. And since 204 returns no
        // body, we end up getting a Parse Error.
        request
            .get({
                url: endpoint,
                headers: {
                    authorization: `Basic ${this.token}`,
                }
            })
            .on("response", function (resp) {
                if (resp.statusCode === 204) {
                    reject(204);
                }
                if (resp.statusCode < 200 || resp.statusCode > 299) {
                    reject(resp.statusCode);
                }
                resolve(resp);
            })
            .on("error", function (err) {
                reject(err);
            })
    });
};

module.exports = MyAnimeList;
