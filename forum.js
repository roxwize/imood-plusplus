class Post {
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
  }
  render() {
    const div = document.createElement("div");
    div.innerHTML = `
      <h4>${this.unread ? '<span style="color:red">+</span> ' : ""}${
      !this.user
        ? "Deleted User"
        : '<a href="' + this.userLink + '">' + this.user + "</a>"
    } | ${this.date.toDateString()}</h4>
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
  thread.forEach((el) => {
    const children = el.childNodes;
    posts.push(new Post(children[1], children[3], children[5]));
  });
  // change page content now
  document.querySelector(".content > h1").innerHTML +=
    " &raquo; " + posts[0].title;
  const div = document.createElement("div");
  posts.forEach((post) => {
    div.appendChild(post.render());
  });
  document.querySelector(".content > table").outerHTML = div.outerHTML;
})();
