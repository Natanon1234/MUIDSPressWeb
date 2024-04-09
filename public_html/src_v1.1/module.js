/*
Hello!

If you are here, it appears that you have discovered all the .json files!
Since the news are public, there is no necessity in hiding the .json files from the public.

If you are a new developer looking on how to add the news, then read the following:

The .json file is structured as:
{
    "title": "", --> inputs the title; make it as short as possible, preferably
    "author": "", --> inputs the author's name; use the initial of the middle name like (John S. Miller)
    "tag": [""], --> inputs the tag (max: 5) into the "" as elemenet of array
    "date": "", --> put the date in the format of DD/MM/YYYY e.g. 01/01/1970
    "p": [ --> input the paragraphs
    ],
    "img": "", "" --> leave blank if there is no img
    "ref": "" --> add any references
}

Name the json file a number the same as the title

Please also log the .json file as well when adding a new month 
*/

// Export
export { fetchFeatured, fetchLog, fetchNews, fetchNewsList, search, part };

// News Folder
const folder = `news_v2.1`;

// Code
const fetchLog = (loc) => {
  return fetch(loc)
    .then((response) => response.json())
    .then((array) => {
      const [month, year] = array.featured.split("/");
      const jsonAddress = `${folder}/${year}/${month}/${month}.json`;
      const imgAddress = `${folder}/${year}/${month}/imgs`;

      return {
        month: month,
        year: year,
        jsonAddress: jsonAddress,
        imgAddress: imgAddress,
      };
    });
};

const fetchFeatured = async (top) => {
  const initAddress = await fetchLog(`${folder}/log.json`);

  return fetch(initAddress.jsonAddress)
    .then((response) => response.json())
    .then((array) => {
      const news = array.news;
      let selected = [];

      // Randomizing function for featured
      const roll = (list) => {
        for (let i = 0; i < top; i++) {
          const index = Math.floor(Math.random() * list.length);
          if (selected.indexOf(list[index]) === -1) {
            selected.push(list[index]);
          }
        }

        // Check
        if (selected.length !== top) {
          let k = 0;
          while (selected.length !== top && selected.length <= news.length) {
            if (selected.indexOf(news[k]) === -1) {
              selected.push(news[k]);
            }
            k += 1;
            if (k + 1 == news.length) {
              break;
            }
          }
        }
      };

      // Calling the function
      roll(news);
      return {
        news: news,
        imgAddress: initAddress.imgAddress,
        featured: selected,
        month: parseInt(initAddress.month),
        year: parseInt(initAddress.year),
      };
    });
};

const fetchNews = async ([year, month, i]) => {
  const loc = `${folder}/${year}/${month}/${month}.json`;
  return fetch(loc)
    .then((response) => response.json())
    .then((array) => {
      return {
        data: array.news[i],
      };
    });
};

const fetchNewsList = async ([year, month]) => {
  const loc = `${folder}/${year}/${month}/${month}.json`;
  return fetch(loc)
    .then((response) => response.json())
    .then((array) => {
      return {
        data: array.news,
      };
    });
};

const search = async (query) => {
  const initDate = new Date(query.initDate);
  const endDate = new Date(query.endDate);

  const log = await fetchLog(`${folder}/log.json`);

  if (
    endDate < initDate ||
    initDate < new Date("2024-01-01") ||
    endDate > new Date(`20${log.year}, ${parseInt(log.month) + 2}, 0`)
  ) {
    return {
      type: "error",
      data: "invalid date",
    };
  } else {
    const times = (i, e) => {
      if (i.getFullYear() == e.getFullYear()) {
        return e.getMonth() - i.getMonth() + 1;
      } else {
        const yearDif = e.getFullYear() - i.getFullYear() - 1;
        let count = 12 - i.getMonth() + (e.getMonth() + 1);
        yearDif > 0 ? (count += 12 * yearDif) : (count = count);
        return count;
      }
    };

    let holder = [];
    for (let i = 0; i < times(initDate, endDate); i++) {
      let y = (initDate.getFullYear() - 2000 + Math.floor(i / 12)).toString();
      let m = initDate.getMonth() + (i % 12) + 1;
      m <= 9 ? (m = "0" + m.toString()) : (m = m.toString());
      const j = await fetchNewsList([y, m]);
      if (j != undefined) {
        for(let el of j.data) {
          el["index"] = j.data.indexOf(el);
          holder.push(el);
        }
      }
    }

    let matched = [];
    let agreg = [];

    for (let el of holder) {
      const dataDate = new Date(el.date);
      dataDate.setHours(7);

      if (initDate <= dataDate && dataDate <= endDate) {
        if (
          query.key !== undefined &&
          el.title.toLowerCase().includes(query.key)
        ) {
          agreg.push(el);
        }

        if (query.tag !== undefined) {
          for (let k = 0; k < el.tag.length; k++) {
            if (query.tag[k] !== undefined) {
              let em = query.tag[k].toLowerCase();
              em = em[0].toUpperCase(0) + em.substring(1);
              if (el.tag.includes(em)) {
                agreg.push(el);
              }
            }
          }
        }

        if (
          query.author !== undefined &&
          el.author.toLowerCase().includes(query.author)
        ) {
          agreg.push(el);
        }
      }
    }

    let freq = [];

    const checkPres = (el) => {
      for (const x of freq) {
        if (x.obj == el) {
          return freq.indexOf(x);
        }
      }
      return -1;
    };

    for (const el of agreg) {
      if (checkPres(el) == -1) {
        freq.push({ obj: el, rep: 0 });
      } else {
        freq[checkPres(el)].rep += 1;
      }
    }
    freq.sort((a, b) => b.rep - a.rep);

    for (const el of freq) {
      matched.push(el.obj);
    }

    return {
      type: "found",
      data: matched,
    };
  }
};

// Part
const part = (arr, n) => {
  let hold = [];

  for (let i = 0; i < arr.length; i += n) {
    hold.push(arr.slice(i, i + n));
  }

  return hold;
};
