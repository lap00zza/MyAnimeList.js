// TODO: compatibility with browser
const fetch = require("node-fetch");
const { promisify } = require("util");
const parseString = promisify(require("xml2js").parseString);

const MyAnimeList = function (username, password) {
    this.username = username;
    this.password = password;
};

MyAnimeList.getUserList = async function (type="anime") {
    if (type !== "anime" && type !== "manga") {
        throw new Error("Argument type should be 'anime' or 'manga' only.");
    }
    try {
        const endpoint = `https://myanimelist.net/malappinfo.php?u=${this.username}&status=all&type=${type}`;
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(response.status.toString());
        }
        return await parseString(await response.text());
    } catch (err) {
        throw new Error(err.message);
    }
};

module.exports = MyAnimeList;