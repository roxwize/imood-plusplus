<div style="text-align:center;"><img src="src/icons/icon128.png"></div>

# imood++

reviewers see [here](#imood-reviewer-notes)

### [chrome](https://chromewebstore.google.com/detail/imood++/oooolmgjjlfahaenjbdplplfljkabkmk) | firefox

imood++ is a web extension created by [hoylecake on imood](https://www.imood.com/users/hoylecake) that improves parts of the frontend

if you want to use it locally, find [the latest release](https://github.com/roxwize/imood-plusplus/releases) and download it as a zip&mdash; load it into your browser's extensions manager from there. pre-packaged versions on the firefox addons marketplace will come ASAP

## features

- turn the table-based forum layout into a simpler, purely vertical one (see below for screenshots)
- add a piechart to the internet mood and personal mood pages to view mood frequencies

## screenshots

![new forum layout](screenshots/forum.png)

revamped forum layout... whoa...

![cool pie chart](screenshots/moodchart.png)

look at those colors ...

## installing from source

**to addon reviewers**: read `FOR_REVIEWERS.md`!

clone the repository first, then download the modules using your package manager of choice. then run the `build` script, or `dev` to have it rebuilt as you make changes

```bash
git clone https://github.com/roxwize/imood-plusplus.git
cd imood-plusplus
pnpm install
pnpm dev
```

# imood++ reviewer notes

hullo! this is the source code for imood++, you can find a mirror of it on [https://github.com/roxwize/imood-plusplus/](https://github.com/roxwize/imood-plusplus)

## build environment

imood is built with the following system specs:

```
openSUSE Tumbleweed 20240129
16GB RAM
8x Intel Core i7-6700 CPU @ 3.40GHz

Node.js version 21.5.0
PNPM version 8.14.3
```

**[Rollup](https://rollupjs.org) v[4.10.0](https://github.com/rollup/rollup/tree/v4.10.0)** is used to build the extension and bundle **[Chart.js](https://www.chartjs.org) v[4.4.1](https://github.com/chartjs/Chart.js/tree/v4.4.1)** into moodchart.js. forum.js has no external dependencies, and is just minified like the other content scripts. all of these dependencies are installed automatically when you run `npm install` in the extension directly. node.js and pnpm are the only hard and fast external dependencies that you need to install.

## to build imood++

**node.js is**. your version of node should preferably be 20 or over; npm will come installed with it. if youre on opensuse (as am i) you can run `sudo zypper install nodejs21` to install it, check your distro's repository for a similar package. if you cant find it or you're on windows, you can visit [the node.js website](https://nodejs.org/en) to get the latest version. after that, no further dependencies are required, besides the ones installed by pnpm when you run the script below

additionally, you'll probably notice that the lockfile is in `pnpm-lock.yaml`; the project is built using pnpm rather than npm, which can be installed at [pnpm's website](https://pnpm.io)

**pnpm**

the specific version of pnpm used can be downloaded by running `curl -fsSL https://get.pnpm.io/install.sh | env PNPM_VERSION=8.14.3 sh -` in the command line (sourced from [https://pnpm.io/installation/](https://pnpm.io/installation))

```bash
# in the directory of the source code, run:
pnpm install
pnpm build
# generated extension will be in ./dist/
```

**npm**

```bash
npm install
npm run build
```
