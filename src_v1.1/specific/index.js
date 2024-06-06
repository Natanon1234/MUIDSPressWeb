<<<<<<< Updated upstream
import { fetchFeatured } from "../module.js";

// News Folder
const folder = `news_v2.1`

async function displayFeaturedNews() {
    const template = document.querySelector("#templateNewsBox");
    const holder = document.querySelector("#newsBox");
    const tag = document.querySelector("#tag");
	// Variable Constants
	const nDisplayed = 6; // Indidcates how many articles are fetched in total
	
    // Fetch the data
    const fetchedData = await fetchFeatured(nDisplayed);

    // Name the imported data
    const selected = fetchedData.featured;
    const imgAddress = fetchedData.imgAddress;
    const year = fetchedData.year;
    const month = fetchedData.month;
    const news = fetchedData.news;

    for (let i = 0; i < nDisplayed; i++) {

      let clone = template.cloneNode(true);
      holder.appendChild(clone);

      if (selected[i]) {
        let data = selected[i];
        // Declaring the changed values
        let header = clone.querySelector("a");
        let content = clone.querySelector("p");
        let img = clone.querySelector("img");

        // Changing the values
        header.innerHTML = data.title;
        if (data.img !== "") {
          img.src = `${imgAddress}/${data.img}`;
        }
        content.innerHTML = data.p[0].substring(0, 150) + "...";

        // Updating the tags
        let localTag = clone.querySelector("#tag");
        localTag.remove();

        for (let j = 0; j < data.tag.length; j++) {
          let localTagHolder = clone.querySelector("#tagHolder");
          localTag.remove();
          let tagClone = tag.cloneNode(true);
          localTagHolder.appendChild(tagClone);
          tagClone.innerHTML = data.tag[j];
        }

        // Updating the href
        let newHref = `headline.html?id=${year}/${month}/${news.indexOf(data)}`;
        header.href = newHref;
      }
    }

    template.remove();
}

displayFeaturedNews();
