`# Not yet ready for use. Please use at own risk.`

# MyAnimeList.js
API wrapper for MyAnimeList.net

## Download
* `npm install --save myanimelist.js`

## Usage
```js
const MyAnimeList = require("myanimelist.js");

// Get users Anime or Manga list
MyAnimeList.getUserList("lapoozza", "anime")
    .then(r => r.myanimelist.anime.forEach(x => console.log("+", x.series_title[0])))
    .catch(e => console.error(e));

// Search for Anime or Manga
const mal = new MyAnimeList("USERNAME", "PASSWORD");
mal.search("boruto", "anime")
    .then(r => console.log(r))
    .catch(e => console.error(e));
```

## License
[MIT](https://github.com/lap00zza/MyAnimeList.js/blob/master/LICENSE)

Copyright (c) 2017 Jewel Mahanta