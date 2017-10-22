const fetch = require("node-fetch");
const { promisify } = require("util");
const parseString = promisify(require("xml2js").parseString);


const MyAnimeList = function (username, password) {
    this.username = username;
    this.password = password;
};

MyAnimeList.prototype.getUserList = async function () {
    try {
        const endpoint = `https://myanimelist.net/malappinfo.php?u=${this.username}&status=all&type=anime`;
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