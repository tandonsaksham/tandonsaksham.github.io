# World Media — one-page site (v2)

The new single landing page, built from the website brief: a creative landing like
rabenrifaie.com, project navigation like another.gr/projects, and the tone of
twoplusone.co. It sits on its own Framer page so the first site stays where it is.

- `src/prelude.tsx` — shared design system (colours, type, reveals, globe)
- `src/sections/*.tsx` — the eight sections: Nav, Hero, Hello, Services, Projects, About, Contact, Footer
- `build.py` — inlines what each section uses from the prelude into `dist/`, one self-contained Framer code file each
- `dist/*.tsx` — the files that go into Framer
- `placeholders/` — the sample globe video and photos shown until the real ones are added
  (sources and licences in `placeholders/CREDITS.md`)

The landing opens with a loading screen: a wireframe globe with three satellites, a colour
bar and a counter. It is part of the page's HTML, so it covers the page from the first paint,
then waits for the fonts, the page and the video before fading into the hero, where the
sample Earth sits exactly where the wireframe was. Each section's "Sample video" or
"Sample photos" switch hides the samples; a real picture or video always wins.

Run `python3 build.py` after editing anything in `src/`.
