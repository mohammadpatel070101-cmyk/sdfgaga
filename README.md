# Happy Raksha Bandhan, Shreya ❤️

A cinematic, personal digital gift website — built as a Raksha Bandhan surprise.

## How to open it

1. Unzip the folder.
2. Double-click **`index.html`** — it opens straight in your browser (Chrome, Safari, Edge, Firefox all work).
3. No installation, no server, no build step needed. It works fully offline.

To send it to Shreya, you can either:
- Zip the whole folder and send it to her — she extracts it and opens `index.html`, or
- Upload the folder to a free static host (GitHub Pages, Netlify, Vercel) and just send her the link, which is the easiest way to open it on her phone.

## Project structure

```
raksha-bandhan-shreya/
├── index.html          ← the whole site (one page)
├── css/style.css        ← all styling & animations
├── js/script.js         ← all interactivity, particles & the CONFIG below
├── assets/
│   ├── music/             ← raksha-bandhan.mp3 (background music)
│   └── icons/
└── README.md
```

## Personalize it in 30 seconds

Open **`js/script.js`** and look at the very top:

```js
const CONFIG = {
  sisterName: "Shreya",
  brotherName: "Dane",
  musicPath: "assets/music/raksha-bandhan.mp3"
};
```

- Change `sisterName` / `brotherName` if you ever reuse this for someone else.
- The name "Shreya" is also written directly in a few emotional spots in `index.html`
  (the letter, the final surprise, the hero title) — search for "Shreya" in that file
  if you want to tweak the exact wording.

## Adding your own song

The site ships with a short original instrumental placeholder at
`assets/music/raksha-bandhan.mp3` so the music button always works out of the box.
I can't legally pull audio directly from YouTube or bundle a commercial song into
the project myself, but swapping in the real track only takes a minute:

1. Get the **audio file** for the song. A couple of easy, legitimate ways:
   - If you already own the song (purchased on iTunes/Amazon Music, or it's in your
     own music library), just use that file.
   - Otherwise, buy/download it from a store like iTunes or Amazon Music, or export
     audio from a track you have rights to use.
2. Convert it to **MP3** if it isn't already (free tools like `ffmpeg`, or any
   online audio converter, can do this in seconds).
3. Rename the file to exactly `raksha-bandhan.mp3` and drop it into
   `assets/music/`, replacing the placeholder file that's already there.
4. That's it — no code changes needed, the player will pick it up automatically.

The music never autoplays before Shreya interacts with the page (mobile browsers block
that anyway) — it starts right when she taps "Open Your Gift 🎁", and she can play, pause,
or mute it anytime with the floating 🎵 button.

## Editing the letter

Open `index.html` and find `<div class="envelope-stage">` → `<div class="letter-paper">`.
Each paragraph is a `<p class="letter-line">…</p>` — edit the text directly. Lines reveal
one at a time automatically, in the order they appear in the file, so you can add or
remove lines freely.

## Editing the quiz

In `index.html`, find `<section class="quiz-section">`. There are three
`<div class="quiz-question">` blocks, each with a question and three
`<button class="quiz-option">` answers. Edit the text directly — the logic in
`js/script.js` (`initQuiz`) automatically moves to the next question and works with
however many options you leave in place. To add or remove a whole question, copy or
delete one `.quiz-question` block (and update the `data-q` index).

## Performance & compatibility notes

- The site automatically detects device power (screen size, CPU cores, memory) and scales
  particle counts and effects up on desktop, down on phones — so it stays smooth everywhere.
- It respects the OS-level "Reduce Motion" accessibility setting: heavy animation is toned
  down automatically if Shreya has that turned on.
- Tested layouts at 360px, 375px, 390px, 412px and 430px wide, plus tablet and desktop sizes.
  No horizontal scrolling at any size.
- Works fully offline once opened — nothing is required to load except two font/library
  requests (Google Fonts + GSAP from a CDN) for the nicest visuals. If there's no internet
  connection, the site still works, just with the browser's default font and CSS-only
  animations instead of GSAP-powered ones.

## Made with

Plain HTML, CSS and JavaScript, plus [GSAP](https://gsap.com/) for the smoothest scroll
and reveal animations. No build tools or frameworks required.

---

Happy Raksha Bandhan. ❤️
