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
  clip. Each tile takes the shape of its video: 9:16, 1:1, 16:9 or anything in between.
- It turns on its own, can be dragged sideways, and leans a little towards the pointer.

## How it moves

- Scrolling turns the globe from city to city, and at each city a chapter arrives in its own way:
  - **The why** (Delhi): the globe dives into India until its dots fill the screen, and "People
    skip ads. They don't skip people." rises word by word, then the three beliefs.
  - **What we do** (New York): an orange strip pushes the globe off to the left and the five
    services run sideways while you scroll down, each with a big number, a looping video and the
    client's copy (a headline and one line each), with a 01 / 05 counter and a progress line. The
    globe comes back in from the right.
  - **The work** (Tokyo): "Reels people actually stopped for." and "Ideas don't execute
    themselves.", then five phone-shaped reels grow out of the globe's centre and fan out like a
    hand of cards, playing; each opens the original on Instagram.
  - **The brands** (London): a light curtain rises over the globe with "So far, so good.", the
    numbers count up (100+ brands, 10,000 creators), and eighteen client logos roll by on two belts
    moving in opposite directions.
- After the last chapter the globe turns home to Delhi and asks "Your brand, next on the globe?".
- Then the rest of the site: Meet the founder (Deepanker Mitra, with Shabd Monga as founding
  member; photos and words from the portfolio deck, on polaroids that drop into place as you reach
  them), the enquiry form in numbered steps on one panel, with its own opening
  line and button for brands ("Have a brief. Or just a feeling." / Let's build something) and for
  creators ("Make great content. Meet great brands." / Introduce yourself),
  the five open roles (each row fills with orange on hover and opens an email to apply), and the
  footer.
- The menu steps aside while you scroll down, and comes back when you scroll up, when the pointer
  reaches the top of the screen, or when you tab to it.
- On Framer's canvas, and for visitors who prefer reduced motion, the chapters simply stack under
  the globe.

## Keeping it smooth

- The globe's glass body, its glow and the lines across the screen are drawn once and only moved;
  the canvas draws just the moving lines and dots, at no more than about 2.4 million pixels.
- Styles are only touched when they change, nothing that moves uses a background blur, and the
  chapters only move and fade (they are never laid out again). Videos play only while their
  chapter, or their side of the globe, is in view.
- The globe turns between pages with a soft ease over a longer stretch of scroll.

## Settings in Framer

- **Globe media**: videos and photos for the eleven video tiles, in order.
- **Brands, Creators**: the two numbers on The brands (100+ and 10,000). They count up as the
  curtain rises; a figure still in brackets (`[00]+`) stays as it is.
- **Rest of site**: hide it for a globe-only demo (no form, careers or footer). The /globe-demo
  page uses this.
- **Form endpoint**: optional address of a form service. Empty, the form opens an email to the
  address in **Email**, filled in with everything the visitor entered. Sending CV files needs a
  form service; until then, applicants email their CV.

## Placeholders

- Tiles and the reels on "The work" play free sample clips from Mixkit (free licence, no
  attribution needed), streamed from Mixkit's own servers, until the real videos are added.
- The numbers on The brands are World Media's own (100+ brands, 10,000 creators).
- The client logos are in `logos/`, taken from World Media's portfolio deck: the fifteen on its
  "So far, so good" page, plus Sprite and Urban Company from their campaign pages, and Maaza
  (from Wikimedia). Mahindra's silver logo and Urban Company's white one are drawn in dark grey so
  they show on the light belt. They load from this repository through jsDelivr, pinned to one
  commit.
- The reels on "The work" link to the five World Media originals on Instagram, with `[0.0]M`
  views until the view counts arrive.

## The world map

The dots come from Natural Earth's 1:110m countries (public domain), via the `world-atlas`
package, turned into a one-degree grid and stored in the component as run lengths (`LAND`), with
India on its own small grid (`INDIA`).
