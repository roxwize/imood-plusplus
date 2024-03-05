const PLACEHOLDER = "https://theki.club/imood.png";

/** @type {Object<string, UserInfo>} */
const cachedUserInfo = {};

class Post {
  /**
   * @param {HTMLTableCellElement} indicator New posts indicator
   * @param {HTMLTableCellElement} userdate User link + the date it was posted
   * @param {HTMLTableCellElement} msg Post body
   */
  constructor(indicator, userdate, msg) {
    /**
     * @type {UserInfo}
     */
    this.uinfo = new UserInfo();
    this.unread = !(indicator.childNodes[0].alt === "no new posts");

    if (userdate.childNodes[1].nodeName === "A") {
      this.uinfo.user = userdate.childNodes[1].textContent;
      this.uinfo.ulink = new URL(userdate.childNodes[1].href);
      this.uinfo.id = this.uinfo.ulink.pathname.substring(7);
      this.date = new Date(Date.parse(userdate.childNodes[3].textContent));
    } else {
      this.uinfo.user = "";
      this.date = new Date(Date.parse(userdate.childNodes[2].textContent));
    }

    // add paragraphs
    this.content = [];
    msg.querySelectorAll("p").forEach((p) => {
      this.content.push(p.outerHTML);
    });

    // if the top post then set title
    if (msg.childNodes[1].nodeName === "H2") {
      this.title = msg.childNodes[1].textContent;
    } else {
      this.title = "";
    }
  }
  /**
   * Gets UserInfo parameters not immediately available on the thread page
   * @param {string} userlink Link to the user's profile
   * @returns {UserInfo}
   */
  getServerUserInfo() {
    return new Promise(async (resolve, reject) => {
      if (!this.uinfo.user) {
        resolve(`Requested user "${this.uinfo.user}" does not exist`);
        return;
      }
      // if we're cached already then just set our data to what's in the cache and dip out
      if (cachedUserInfo[this.uinfo.user]) {
        resolve(cachedUserInfo[this.uinfo.user]);
        this.uinfo = cachedUserInfo[this.uinfo.user];
        return;
      }
      let r;
      try {
        r = await fetch(this.uinfo.ulink);
      } catch (err) {
        reject(err);
        return;
      }
      const body = new DOMParser().parseFromString(await r.text(), "text/html");
      const mood = body.querySelector(
        ".profile-data:nth-of-type(2) > .profile-value > a"
      );
      if (mood) this.uinfo.mood = mood.innerHTML;
      const icon = body.querySelector(".profile-image > img");
      if (icon && icon.getAttribute("src"))
        this.uinfo.icon = icon.getAttribute("src");
      else this.uinfo.icon = PLACEHOLDER;
      cachedUserInfo[this.uinfo.user] = this.uinfo;
      resolve(this.uinfo);
    });
  }
  render(index) {
    const div = document.createElement("div");
    div.classList.add("im-post", `im-post-u-${this.uinfo.id}`);
    div.id = "im-post-" + index.toString();
    div.innerHTML = `
    <div class="im-post-icon">
      <img
        alt="Profile picture for ${this.uinfo.user}"
        src="${this.uinfo.icon}"
        id="im-post-icon-${index}"
      >
    </div>
    <div class="im-post-content">
      <h4>&numero;${index} ${
      this.unread ? '<span style="color:red">+</span> ' : ""
    }${
      !this.uinfo.ulink
        ? this.uinfo.user
        : '<a href="' + this.uinfo.ulink + '">' + this.uinfo.user + "</a>"
    } | <span class="im-post-mood">${
      this.uinfo.mood
    }</span> | ${this.date.toDateString()}</h4>
      ${this.content.join("")}
    </div>
    `;

    const img = div.querySelector(`#im-post-icon-${index}`);
    img.onerror = () => {
      img.onerror = null;
      img.src = PLACEHOLDER;
      this.uinfo.icon = img.src;
      // replace all pre-existing posts by the user with the placeholder
      document.querySelectorAll(`.im-post-u-${this.uinfo.id}`).forEach((e) => {
        e.querySelector("img").src = PLACEHOLDER;
      });
    };

    return div;
  }
}

class UserInfo {
  constructor() {
    this.user = "Deleted User";
    this.id = "";
    /** @type {URL?} */
    this.ulink = null;
    this.mood = "Unknown mood";
    this.icon = "";
  }
}

(async function () {
  if (
    window.location.pathname.slice(window.location.pathname.length - 3) ===
    "new"
  )
    return;
  const thread = document.querySelectorAll("tbody tr");
  const posts = [];

  // make post
  thread.forEach((post) => {
    const children = post.childNodes;
    posts.push(new Post(children[1], children[3], children[5]));
  });
  // change page content now
  document.querySelector(".content > h1").innerHTML +=
    " &raquo; " + posts[0].title;
  const div = document.createElement("div");
  div.id = "im-posts-container";
  posts.forEach((post, index) => {
    div.appendChild(post.render(index));
  });
  document.querySelector(".content > table").outerHTML = div.outerHTML;

  // now get their moods
  let idx = 0;
  for (let post of posts) {
    if (post.user === "") {
      idx++;
      continue;
    }
    await post.getServerUserInfo(post.userLink);
    document.getElementById("im-post-" + idx).outerHTML =
      post.render(idx).outerHTML;
    idx++;
  }
})();
