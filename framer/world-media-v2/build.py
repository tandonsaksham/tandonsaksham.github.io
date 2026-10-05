# Inline the shared prelude into each section so every Framer file is self-contained,
# keeping only the prelude declarations (and imports) that the section actually uses.
import pathlib, re, sys
root = pathlib.Path(__file__).parent
prelude = (root / "src/prelude.tsx").read_text()
IMPORT_SPECS = [
    ("react-dom", ["createPortal"]),
    ("framer", ["addPropertyControls", "ControlType", "useIsStaticRenderer"]),
    ("framer-motion", ["motion", "useInView", "useReducedMotion", "useScroll", "useTransform", "useSpring", "useMotionValue", "useMotionValueEvent", "animate", "useAnimationFrame", "useVelocity", "AnimatePresence"]),
]

# Split the prelude into its header comment and top-level declaration blocks.
lines = prelude.splitlines()
starts = [i for i, l in enumerate(lines) if re.match(r"(type|const|function) \w", l) or l.startswith("/**")]
header = "\n".join(lines[: starts[0]]).strip()
blocks, i = [], 0
while i < len(starts):
    s = starts[i]
    j = i
    if lines[s].startswith("/**"):  # a doc comment belongs to the declaration after it
        j = i + 1
    e = starts[j + 1] if j + 1 < len(starts) else len(lines)
    text = "\n".join(lines[s:e]).rstrip()
    m = re.search(r"^(?:type|const|function) (\w+)", text, re.M)
    blocks.append((m.group(1), text))
    i = j + 1

words = lambda t: set(re.findall(r"[A-Za-z_]\w*", t))
only = set(sys.argv[1:])
for f in sorted((root / "src/sections").glob("*.tsx")):
    if only and f.stem not in only:
        continue
    src = f.read_text()
    m = re.match(r"\s*//@@ INSTRUCTIONS\n(.*?)//@@ BODY\n(.*)", src, re.S)
    if not m:
        print("skip (no markers):", f.name); continue
    head, body = m.group(1), m.group(2).strip()
    need, keep = words(body), set()
    changed = True
    while changed:
        changed = False
        for name, text in blocks:
            if name in need and name not in keep:
                keep.add(name); need |= words(text); changed = True
    kept = "\n\n".join(text for name, text in blocks if name in keep)
    used = words(kept + "\n" + body)
    imports = ['import * as React from "react"']
    for mod, names in IMPORT_SPECS:
        # "animate" is also a JSX prop name, so only import it when it is called.
        use = [n for n in names if n in used and (n != "animate" or re.search(r"\banimate\(", kept + body))]
        if use:
            imports.append("import { " + ", ".join(use) + ' } from "' + mod + '"')
    shared = header + "\n\n" + kept + "\n\n" if keep else ""
    out = head.rstrip() + "\n\n" + "\n".join(imports) + "\n\n" + shared + body + "\n"
    (root / "dist" / f.name).write_text(out)
    print("built", f.name, len(out), "bytes,", len(keep), "of", len(blocks), "shared blocks")
