# World Media — globe showcase (v3)

The client's new direction: the globe is the site's main interaction, and every page comes out of
it. Type and page style take their cue from opraah.in (big, confident type, short playful copy)
without copying it. Black and dark grey, with the orange-red `#EA5628` as the signal colour.

`W3Globe.tsx` is one Framer code component for a whole page. Place it on its own page, width 100%.

## The globe

- A wireframe globe: lines of longitude and latitude, the far side faintly visible through it, and
  lines across the whole screen through its centre.
- The land as dots, India in orange, and the sea as a fainter grid of dots. Routes fly out of Delhi
  and between cities round the world, three orbit rings with small moons turn round it, and tags
  (Live, #collab, @creator…) float over cities.
- Eleven video tiles sit on the globe and turn with it, spread so they never touch, each playing a
  World Media film and tagged with its brand. Each tile takes the shape of its video: 9:16, 1:1,
  16:9 or anything in between.
- It turns on its own, can be dragged sideways, and leans a little towards the pointer.

## How it moves

- The landing: "A CREATIVE KIND OF WORLD." with "Ideas, creators, production and everything in
  between." beneath it, and no buttons (the update brief of 29 October 2026 sets all copy below).
- Scrolling turns the globe from city to city, and at each city a chapter arrives in its own way:
  - **The why** (Delhi): the globe dives into India until its dots fill the screen, and "THINKING
    IT UP IS ONE THING. PULLING IT OFF IS OUR THING." rises word by word, then the three pillars,
    each outlined number above its title with its line beneath. On a phone the statement and the
    pillars sit together as one block in the middle of the screen, over a darker veil.
  - **What we do** (New York): an orange strip pushes the globe off to the left and the five
    services run sideways while you scroll down, resting on each in turn: its number, its name,
    then its video (Influencer Marketing: Coca-Cola; Production: Ashiana;
    Celebrity Endorsements: OPPO; Talent Management: a slideshow of five talent photos; Creator
    IPs: its own reel), then a headline and a line beneath (the two new services carry draft
    lines until the client approves them), with a 01 / 05 counter and a progress line. All five
    videos are the same size, the full width of their column at 3:2, left aligned like the text
    and on the same line from panel to panel; the tall reels and the talent photos are trimmed to
    fit. The globe
    comes back from the right.
  - **The work** (Tokyo): "Ideas don't execute themselves." and "We help them find their way into
    the world.", then five films (three on a tablet, two on a phone) grow out of the globe's
    centre and fan out like a hand of cards, playing, each with its brand's logo. Tapping one plays
    it full size with sound. The last card, "+ See all 17 films", opens the gallery.
  - **The gallery** ("Every film, every brand."): all 17 films in a grid, each in its own shape
    with its brand's logo and title, and a row of brand logos at the top (All, Coca-Cola, Sprite,
    Maaza, Kinley, Tinder, OPPO, Ashiana) to show one brand's films. Tapping a film opens the
    player: the film with sound, the next and previous film a tap (or arrow key) away, and Escape
    or the cross to close.
  - **The brands** (London), the start of About Us: a light curtain rises over the globe with "So
    far, so good.", the two numbers side by side count up (100+ brands, 10,000 creators), and
    nineteen client logos roll by on two belts moving in opposite directions.
- The brands lead straight into the rest of the site: Meet the founder (Deepanker Mitra; photo and
  words from the portfolio deck, on a polaroid that drops into place), the enquiry form in numbered steps on one panel. Its big heading follows the
  switch: "Have a brief. Or just a feeling." for brands, "Make great content. Meet great brands."
  for creators; the panel opens with that side's line in headline size, and ends with its own
  button (Let's build something / Introduce yourself), and a phone number every enquiry must
  give, then the five open roles (each row fills with orange on hover and opens an email to
  apply), and the footer.
- The menu: Home, Services, Work, About Us (the brands, then the founder) and Careers, plus
  "Let's talk"; the footer repeats it. On a phone or tablet the bar shows the logo, "Let's talk" and
  a round menu button (two lines that turn into a cross). The menu fills the screen, opening down
  from the top: the five links in large type, each numbered, rising in one after another, then the
  email and the phone number. The page holds still while it is open, and
  Escape closes it.
- Phones scroll at a quicker pace (shorter turns and stays), so the whole page is about 16 screens
  tall on a phone.
- A small loader opens the site: the menu's globe icon turning and a thin orange line that fills
  as the fonts, the logos and the first frame of every video on the globe arrive. It lifts after at
  most seven seconds, whatever is still loading, and the globe fades in as it goes.
- The menu steps aside while you scroll down, and comes back when you scroll up, when the pointer
  reaches the top of the screen, or when you tab to it.
- On Framer's canvas, and for visitors who prefer reduced motion, the chapters simply stack under
  the globe.

## Keeping it smooth

- The globe's glass body, its glow and the lines across the screen are drawn once and only moved;
  the canvas draws just the moving lines and dots, at no more than about 2.4 million pixels.
- Styles are only touched when they change, nothing that moves uses a background blur, and the
  chapters only move and fade (they are never laid out again). Videos play only while their
  chapter, or their side of the globe, is in view. Previews are six-second silent loops (100 to
  500 KB each); a full film only loads when someone opens it. While the gallery or a film is open,
  the globe and its videos rest.
- The globe turns between pages with a soft ease over a longer stretch of scroll.

## Settings in Framer

Select the component on the page and the right-hand panel shows everything below. Each field
starts with what the site says now, so nothing changes until you edit it.

- **Landing, The why, What we do, The work, The brands, Founder, Enquiry form, Careers**: the
  headings and words of each section (the founder's photo too).
- **Films**: every film on The work and in the gallery. Press + to add one: upload the video (or
  paste a link), give it a title, a brand, a shape, and if you like a brand logo and a cover
  picture. Tick **On The work** for the cards that fan out (up to five; none ticked, the first
  five). A brand already on the site (Coca-Cola, Sprite, Maaza, Kinley, Tinder, OPPO, Ashiana)
  picks up its logo by name; a new brand without a logo shows its name. Drag to reorder.
- **Services**: the panels on What we do. Each takes a video (upload or link) or up to five photos
  for a slideshow.
- **Client logos**: the two rolling belts, half on each; **Size** evens out a logo that looks too
  big or small.
- **Open roles**: the careers list; remove them all and it says "No open roles right now".
- Films kept on World Media's own server play a light six-second preview; an uploaded film plays
  itself as the preview, so keep uploads short and small (under about 20 MB), and add a cover.

- **Globe media**: videos and photos for the eleven video tiles, in order. Empty, the tiles play
  World Media's films.
- **Videos**: Play, or Stills to show a still from each film instead.
- **Brands, Creators**: the two numbers on The brands (100+ and 10,000). They count up as the
  curtain rises; a figure still in brackets (`[00]+`) stays as it is.
- **Rest of site**: hide it for a globe-only demo (no form, careers or footer). The /globe-demo
  page uses this.
- **Web3Forms key**: the access key from web3forms.com (free, 250 enquiries a month). With it, each
  enquiry is emailed to the address the key was made for, from "World Media website", with the
  visitor's email as the reply-to address. A hidden box catches spam robots. If Web3Forms ever
  refuses, the form falls back to opening the visitor's email app.
- **Form endpoint**: only for another form service instead of Web3Forms (Formspree works: paste its
  form address, `https://formspree.io/f/…`). With neither set, the form opens an email to the
  address in **Email**, filled in with everything the visitor entered. Sending CV files needs a
  form service; until then, applicants email their CV.

## Films, logos and photos

- The films are in `films/`: each has the full film with sound (540p, H.264), a six-second silent
  loop (`-loop.mp4`, 360p) and a still (`.webp`). The list, with brands and titles, is `FILMS` in
  the component; titles come from each film's own on-screen text. To add a film, put its three
  files in `films/` and add a line to `FILMS`.
- The client logos are in `logos/`, taken from World Media's portfolio deck: the fifteen on its
  "So far, so good" page, plus Sprite and Urban Company from their campaign pages, Maaza (from
  Wikimedia) and Kinley (cut from the end card of its Teacher's Day film). Mahindra's silver logo,
  Urban Company's white one and Kinley's white one are recoloured so they show on light plates.
- The founder photo is in `people/`, and the five Talent Management photos (cropped 4:5 around each
  face) in `talent/`.
- All three folders are also on the repository's `main` branch, and GitHub Pages serves them from
  https://tandonsaksham.github.io/framer/world-media-v3/. A new file needs to be on `main` too
  before the site can load it.
- The numbers on The brands are World Media's own (100+ brands, 10,000 creators).

## The world map

The dots come from Natural Earth's 1:110m countries (public domain), via the `world-atlas`
package, turned into a one-degree grid and stored in the component as run lengths (`LAND`), with
India on its own small grid (`INDIA`).
