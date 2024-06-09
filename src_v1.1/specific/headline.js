import { fetchFeatured, fetchNews } from "../module.js";

// News Folder
const folder = `news_v2.1`

// Updating the news
const update = async () => {
  const query = window.location.search.split("?");
  let [year, month, i] = query[1].slice(3).split("/")
  console.log([year, month, i])
  if(month < 10) {
    month = '0' + month.toString();
  }
  console.log([year, month, i])
  const fetchedNews = await fetchNews([year, month, i]);
  const data = fetchedNews.data;

  const newsHeader = document.querySelector('#newsTitle');
  newsHeader.querySelector('h1').innerHTML = data.title;
  newsHeader.querySelector('#author').innerHTML = `By ${data.author}`;
  newsHeader.querySelector('#date').innerHTML = `${data.date}`;

  const tagHolder = document.querySelector('#tagHolder');
  const tag = tagHolder.querySelector("#tag");
  tag.remove();

  for (let j = 0; j < data.tag.length; j++) {
    let tagClone = tag.cloneNode(true);
    tagHolder.appendChild(tagClone);
    tagClone.innerHTML = data.tag[j];
  }
  
  const title = document.querySelector('title');
  title.innerHTML = data.title;
  
  const newsBody = document.querySelector('#newsBody');
  const p = document.querySelector('#pTemplate');

  for (let k = 0; k < data.p.length; k++) {
    let pClone = p.cloneNode(true);
    newsBody.appendChild(pClone);
    let con = pClone.querySelector('p');
    con.innerHTML = data.p[k];
  }

  p.remove();

  const ref = document.querySelector('#ref');

  if(data.ref == "") {
    ref.remove();
  } else {
    ref.querySelector('cite').innerHTML = data.ref;
  }

  console.log(data.img);
  if(data.img !== "") {
    document.querySelector('#newsImg').querySelector('img').src = `${folder}/${year}/${month}/imgs/${data.img}`;
  }
}

// Updating featured
const displayFeaturedNews = async () => {
  const fetchedData = await fetchFeatured(6);

  const template = document.querySelector('#featuredTemplate');
  const holder = document.querySelector('#newsHolder');

  // Name the imported data
  const selected = fetchedData.featured;
  const year = fetchedData.year;
  const month = fetchedData.month;
  const news = fetchedData.news;

  for (let i = 0; i < 6; i++) {
    let clone = template.cloneNode(true);
    holder.appendChild(clone);

    if (selected[i]) {
      let data = selected[i];
      // Declaring the changed values
      let header = clone.querySelector("a");
      let content = clone.querySelector("p");

      // Changing the values
      header.innerHTML = data.title;
      content.innerHTML = data.p[0].substring(0, 100) + "...";

      // Updating the tags
      let localTagHolder = clone.querySelector("#tagHolder");
      let localTag = clone.querySelector("#tag");
      localTag.remove();

      for (let j = 0; j < data.tag.length; j++) {
        let tagClone = localTag.cloneNode(true); // This should be changed
        localTagHolder.appendChild(tagClone);
        tagClone.innerHTML = data.tag[j];
      }

      // Updating the href
      let newHref = `headline.html?id=${year}/${month}/${news.indexOf(data)}`;
      header.href = newHref;
    }
  }

  template.remove();
};

displayFeaturedNews();
update();
