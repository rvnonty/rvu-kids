# RVU Kids — Book-to-Site Curriculum Audit
**Reference:** User-supplied `RVU_BOOk.pdf`, 96 pages, creation date 2026-11-03. Alphabet lesson art appears on PDF pages 4, 6, ... 54. This report is a comparison of the pictured words, not automated OCR.

## Summary
- 26 alphabet lessons exist in the repository.
- 101 illustrated word entries are referenced by the website.
- **12 letters contain 15 word slots that do not match the printed book.**
- All 101 referenced SVG files exist, but **98 use operating-system emoji glyphs**, not the original illustrations. The three drawn vector exceptions are quilt, quail, and xylophone.
- The site has 15 everyday units corresponding to printed units 27–41 (PDF pages 56–85). Printed units 42–46 (PDF pages 86–95) are review/challenge pages and are not implemented as separate digital lessons.

## Vocabulary differences
| Letter / PDF art page | Word(s) on site, not in book | Word(s) in book, absent on site |
| --- | --- | --- |
| C / 8 | cup | carrot |
| D / 10 | doll | drum |
| E / 12 | ear, elbow | envelope, engine |
| F / 14 | fork | fox |
| I / 20 | island | igloo |
| J / 22 | jam | jeep |
| K / 24 | kangaroo | king |
| N / 30 | night | nurse |
| O / 32 | ocean, otter | owl, ox |
| P / 34 | pen | pencil |
| R / 38 | rain | rose |
| S / 40 | sock, spoon | strawberry, snake |

The remaining fourteen alphabet lessons match the pictured word sets. Word ordering in the UI may differ from position on the printed page; order alone is not considered a mismatch.

## Required remediation before claiming book-identical learning
1. Update `learn/content.js` and generated audio row inventory together.
2. Obtain **both female and male approved US-English voice clips** for each newly introduced word. Retain stable audio mapping or perform a deliberate ID migration.
3. Replace placeholder SVG emoji with authorized, consistent illustrations matched to the book; do not publish the entire PDF.
4. Review all affected games, picture scenes, prompts, reading examples, offline pack assets and labels.
5. Run automated path integrity tests, play audio at all supported speeds, and sign off with human listening. Fish still requires real phonetic correction. Fork should not remain in the F book-matched set.
6. Consider adding interactive review/challenge exercises representing the five existing printed review units without distributing their full printed pages.

**Release gate:** Do not mark the website as a faithful digital companion to the printed book while the 15 mismatches or 98 emoji stand-ins remain unresolved.
