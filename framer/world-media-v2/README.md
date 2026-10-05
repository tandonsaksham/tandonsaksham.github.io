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

The landing opens with a small, minimal loading screen in the centre: the World Media globe
spinning above a thin bar and a percentage. It is part of the page's HTML, so it covers the
page from the first paint, then waits for the fonts, the page and the video before fading
into the hero. Each section's "Sample video" or
"Sample photos" switch hides the samples; a real picture or video always wins.

Colours follow the client's deck: white first, black second, and one orange-red accent
(#EA5628). Each menu pill and each project screen has a Colour setting (White, Black or
Orange-red) in Framer's right-hand panel.

Framer saves a section's settings when the section is placed on the page. Changing a default
in the code later does not change sections already on the page: change the setting in the
right-hand panel, or place the section again.

Run `python3 build.py` after editing anything in `src/`.
