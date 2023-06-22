class Post {
  /**
   * @param {HTMLTableCellElement} indicator New posts indicator
   * @param {HTMLTableCellElement} userdate User link + the date it was posted
   * @param {HTMLTableCellElement} msg Post body
   */
  constructor(indicator, userdate, msg) {
    /*
      yes i can use queryselector but i dont feel like it
      not like the layout will get changed anytime soon ...
    */
    this.unread = !(indicator.childNodes[0].alt === "no new posts");

    if (userdate.childNodes[1].nodeName === "A") {
      this.user = userdate.childNodes[1].textContent;
      this.userLink = userdate.childNodes[1].href;
      this.date = new Date(Date.parse(userdate.childNodes[3].textContent));
    } else {
      this.user = "";
      this.date = new Date(Date.parse(userdate.childNodes[2].textContent));
    }

    this.content = [];
    msg.querySelectorAll("p").forEach((p) => {
      this.content.push(p.outerHTML);
    });

    if (msg.childNodes[1].nodeName === "H2") {
      this.title = msg.childNodes[1].textContent;
    } else {
      this.title = "";
    }

    this.mood = "Fetching mood...";
  }
  /**
   * Gets the current mood text of the user plus its smiley
   * @param {string} userlink Link to the user's profile
   */
  getUserMood(userlink) {
    return new Promise(async (resolve, reject) => {
      const r = await fetch(userlink).catch(err => reject);
      const body = (new DOMParser()).parseFromString(await r.text(), "text/html");
      const moodHtml = body.querySelector(".profile-data:nth-of-type(2) > .profile-value > a");
      resolve(moodHtml)
    })
  }
  render(index) {
    const div = document.createElement("div");
    div.id = "im-post-" + index.toString();
    div.innerHTML = `
      <h4>${this.unread ? '<span style="color:red">+</span> ' : ""}${
      !this.user
        ? "Deleted User"
        : '<a href="' + this.userLink + '">' + this.user + "</a>"
    } | ${this.mood} | ${this.date.toDateString()}</h4>
      ${this.content.join("")}
    `;
    return div;
  }
}

(function () {
  if (
    window.location.pathname.slice(window.location.pathname.length - 3) ===
    "new"
  )
    return;
  const thread = document.querySelectorAll("tbody tr");
  const posts = [];
  thread.forEach((el, idx) => {
    const children = el.childNodes;
    posts.push(new Post(children[1], children[3], children[5]));
    if (posts[idx].user !== "") {
      posts[idx].getUserMood(posts[idx].userLink).then(val => {
        posts[idx].mood = val.innerHTML;
        document.getElementById("im-post-" + idx.toString()).outerHTML = posts[idx].render(idx).outerHTML;
      })
    }
  });
  // change page content now
  document.querySelector(".content > h1").innerHTML +=
    " &raquo; " + posts[0].title;
  const div = document.createElement("div");
  posts.forEach((post, index) => {
    div.appendChild(post.render(index));
  });
  document.querySelector(".content > table").outerHTML = div.outerHTML;
})();
