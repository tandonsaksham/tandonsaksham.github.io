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
- Fifteen video tiles sit on the globe and turn with it, spread so they never touch. Each tile
  takes the shape of its video: 9:16, 1:1, 16:9 or anything in between.
- It turns on its own, can be dragged sideways, and leans a little towards the pointer.

## How it moves

- Scrolling turns the globe from city to city. At each one, a video tile rides the turn to the
  front, lifts off and opens into a page while the globe sinks back; then it closes and the globe
  turns on to the next city.
- The four pages: The why (Delhi), What we do (New York), The work (Tokyo), The brands (London).
- After the last page the globe turns home to Delhi and asks "Your brand, next on the globe?".
- Then the rest of the site: the enquiry form (brands and creators, as in the client's contact
  brief), careers (the five open roles), and the footer.
- The menu steps aside while you scroll down, and comes back when you scroll up, when the pointer
  reaches the top of the screen, or when you tab to it.
- On Framer's canvas, and for visitors who prefer reduced motion, the pages simply stack under the
  globe.

## Keeping it smooth

- The globe's glass body, its glow and the lines across the screen are drawn once and only moved;
  the canvas draws just the moving lines and dots, at no more than about 2.4 million pixels.
- Styles are only touched when they change, nothing that moves uses a background blur, and a
  page's picture is scaled, not redrawn, while the page opens.
- The globe turns between pages with a soft ease over a longer stretch of scroll.

## Settings in Framer

- **Globe media**: videos and photos for the fifteen tiles, in order. The first four open into the
  pages.
- **Rest of site**: hide it for a globe-only demo (no form, careers or footer). The /globe-demo
  page uses this.
- **Form endpoint**: optional address of a form service. Empty, the form opens an email to the
  address in **Email**, filled in with everything the visitor entered. Sending CV files needs a
  form service; until then, applicants email their CV.

## Placeholders

- Tiles show the sample photos from `../world-media-v2/placeholders` until videos or photos are
  added.
- Numbers are in brackets (`[00]M+`) until World Media confirms them; brand plates are names, not
  logos, until the logo files arrive.
- The reels on "The work" link to the five World Media originals on Instagram, with photo
  stand-ins and `[0.0]M views` until the videos and view counts arrive.

## The world map

The dots come from Natural Earth's 1:110m countries (public domain), via the `world-atlas`
package, turned into a one-degree grid and stored in the component as run lengths (`LAND`), with
India on its own small grid (`INDIA`).
