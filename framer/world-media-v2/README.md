# World Media — one-page site (v2)

The new single landing page, built from the website brief: a creative landing like
rabenrifaie.com, project navigation like another.gr/projects, and the tone of
twoplusone.co. It sits on its own Framer page so the first site stays where it is.

- `src/prelude.tsx` — shared design system (colours, type, reveals, globe)
- `src/sections/*.tsx` — the eight sections: Nav, Hero, Hello, Services, Projects, About, Contact, Footer
- `build.py` — inlines what each section uses from the prelude into `dist/`, one self-contained Framer code file each
- `dist/*.tsx` — the files that go into Framer

Run `python3 build.py` after editing anything in `src/`.
