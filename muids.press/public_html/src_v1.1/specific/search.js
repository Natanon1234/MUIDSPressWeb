import { search, fetchNewsList, part } from "../module.js";

// News Folder
const folder = `news_v2.1`

// Get the data :3
const form = document.querySelector("#searchForm");
const searchBox = form.querySelector("#searchBox");
const tagBox = form.querySelector("#tagBox");
const initDateInput = form.querySelector("#initDate");
const endDateInput = form.querySelector("#endDate");
const authorBox = form.querySelector("#authorBox");

const template = document.querySelector("#resultTemplate");
const holder = document.querySelector("#resultBox");

// page selector
const l = document.querySelector("#l");
const m = document.querySelector("#m");
const r = document.querySelector("#r");

const clear = () => {
  while (holder.firstChild) {
    holder.removeChild(holder.firstChild);
  }
};

// displaySearch
const displaySearch = async () => {
  document.querySelector("#result").classList.add("showResult");
  let tagVal;
  tagBox.value != ""
    ? (tagVal = tagBox.value.split(","))
    : (tagVal = undefined);

  let title;
  let author;
  let tag;

  searchBox.value.length == 0
    ? (title = undefined)
    : (title = searchBox.value.toLowerCase());
  tagVal == undefined ? (tag = undefined) : (tag = tagVal);
  authorBox.length == 0
    ? (author = undefined)
    : (author = authorBox.value.toLowerCase());

  const query = {
    key: title,
    tag: tag,
    initDate: initDateInput.value,
    endDate: endDateInput.value,
    author: author,
  };

  const response = await search(query);
  const list = response.data;

  // Remove old response
  clear();

  // Error!
  if (response.type == "error") {
    if (document.querySelector("#wait").classList.contains("hide")) {
      document.querySelector("#wait").classList.remove("hide");
    }
    document.querySelector(
      "#wait"
    ).innerHTML = `There is an error in the submitted date! ((((；ﾟДﾟ)))))))`;
    if (!l.classList.contains('hide')) { l.classList.add('hide') }
    if (!m.classList.contains('hide')) { m.classList.add('hide') }
    if (!r.classList.contains('hide')) { r.classList.add('hide') }
    return;
  }

  // Amplify the response
  if (list.length == 0) {
    if (document.querySelector("#wait").classList.contains("hide")) {
      document.querySelector("#wait").classList.remove("hide");
    }
    document.querySelector("#wait").innerHTML = `We can't find it... (T^T)`;
    if (!l.classList.contains('hide')) { l.classList.add('hide') }
    if (!m.classList.contains('hide')) { m.classList.add('hide') }
    if (!r.classList.contains('hide')) { r.classList.add('hide') }
    return;
  } else {
    document.querySelector("#wait").classList.add("hide");
  }

  // partition
  let displayList = part(list, 10);

  // initPage
  for (const el of displayList[0]) {
    const newDate = new Date(el.date);
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear() - 2000;
    let clone = template.cloneNode(true);
    clone.classList.add('cloneN');
    holder.appendChild(clone);
    clone.classList.remove("hide");
    let th = clone.querySelector("#tagHolder");
    let tagLoc = clone.querySelector("#tag");

    clone.querySelector("h2").innerHTML = el.title;
    clone.querySelector(
      "a"
    ).href = `headline.html?id=${year}/${month}/${el.index}`;
    clone.querySelector("p").innerHTML = `${el.p[0].substring(0, 150)}...`;
    for (const mem of el.tag) {
      let tagClone = tagLoc.cloneNode(true);
      th.appendChild(tagClone);
      tagClone.innerHTML = mem;
    }
    tagLoc.remove();
  }

  // page moving
  const move = (button) => {
    let lv = parseInt(l.innerHTML.trim().substring(4));
    let mv = parseInt(m.innerHTML);
    let rv = parseInt(r.innerHTML.trim().substring(0, r.innerHTML.length - 5));

    if (button == 'l') {
      lv--;
      mv--;
      rv--;
      if (lv == 0) {
        l.classList.add('visHide');
      }
      if (r.classList.contains('visHide')) {
        r.classList.remove('visHide');
      }
    } else {
        lv++;
        mv++;
        rv++;
        if (rv == displayList.length) {
          r.classList.add('visHide');
        }
        if (l.classList.contains('visHide')) {
          l.classList.remove('visHide');
        }
    }

    l.innerHTML = `< ${lv}`;
    m.innerHTML = mv;
    r.innerHTML = `${rv} >`;
    clear();
    for (const el of displayList[mv - 1]) {
      const newDate = new Date(el.date);
      let month = newDate.getMonth() + 1;
      let year = newDate.getFullYear() - 2000;
      year.substring(2);
      let clone = template.cloneNode(true);
      holder.appendChild(clone);
      clone.classList.remove("hide");
      let th = clone.querySelector("#tagHolder");
      let tagLoc = clone.querySelector("#tag");
  
      clone.querySelector("h2").innerHTML = el.title;
      clone.querySelector(
        "a"
      ).href = `headline.html?id=${year}/${month}/${el.index}`;
      clone.querySelector("p").innerHTML = `${el.p[0].substring(0, 150)}...`;
      for (const mem of el.tag) {
        let tagClone = tagLoc.cloneNode(true);
        th.appendChild(tagClone);
        tagClone.innerHTML = mem;
      }
      tagLoc.remove();
    }
  };

  // Initiate page selector
  if (displayList.length > 1) {
    l.innerHTML = '< 0';
    m.innerHTML = 1;
    r.innerHTML = '2 >';
    l.classList.remove("hide");
    m.classList.remove("hide");
    r.classList.remove("hide");
    l.classList.add("visHide");

    l.addEventListener('click', () => move('l'));
    r.addEventListener('click', () => move('r'));
  } else {
    if (!l.classList.contains('hide')) { l.classList.add('hide') }
    if (!m.classList.contains('hide')) { m.classList.add('hide') }
    if (!r.classList.contains('hide')) { r.classList.add('hide') }
  }
};
// Remove template button
template.classList.add("hide");
l.classList.add("hide");
m.classList.add("hide");
r.classList.add("hide");

// Button watching
const button = document.querySelector("#submit");
button.addEventListener("click", displaySearch);
