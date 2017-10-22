# MyAnimeList.js
API wrapper for MyAnimeList.net

## Download
* `npm install --save myanimelist.js`

## Usage
```js
const MyAnimeList = require("myanimelist.js");

MyAnimeList.getUserList("lapoozza", "anime")
    .then(r => r.myanimelist.anime.forEach(x => console.log("+", x.series_title[0])))
    .catch(e => console.error(e));
```

## License
[MIT](https://github.com/lap00zza/MyAnimeList.js/blob/master/LICENSE)

Copyright (c) 2017 Jewel Mahanta