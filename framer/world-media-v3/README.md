# World Media — globe showcase (v3)

A first look at the client's new direction: the globe is the site's main interaction, and every
page comes out of it. Type and page style take their cue from opraah.in (big, confident type,
short playful copy) without copying it.

`W3Globe.tsx` is one Framer code component for a whole page. Place it on its own page, width 100%.

## How it moves

- The landing is the World Media globe, built from about 80 tiles in seven rings: reels, photos and small line icons of what
  World Media does (reels, podcasts, launches, live, creators). It turns on its own and can be
  dragged sideways.
- Scrolling spins the globe a fifth of a turn per page. Each page peels off the globe's left edge,
  rides the rotation to the front while the globe sinks back, then rolls on into the right edge as
  the next page comes round.
- The five pages: The why (About), The receipts (numbers and brands), What we do (Services),
  The work (Projects) and Let's talk (Contact, Join us and open roles).
- The menu and the dots on the right send the globe round to a page. The ring around the menu's
  globe fills as you go.
- On Framer's canvas, and for visitors who prefer reduced motion, the pages simply stack under the
  globe.

## Identity

- Colours: white first, black second, orange-red `#EA5628` as the signal colour.
- Type: Funnel Display for headlines, Funnel Sans for text, Geist Mono for small labels
  (all Google Fonts).

## Placeholders

- Globe tiles show the sample photos from `../world-media-v2/placeholders` until videos or photos
  are added in the component's "Globe media" field (in order; mp4, webm, mov, jpg, png, webp).
- Numbers are in brackets (`[00]M+`) until World Media confirms them; brand plates are names, not
  logos, until the logo files arrive.
- The reels on "The work" are photo stand-ins with `[0.0]M views` until the campaign videos and
  view counts arrive.
