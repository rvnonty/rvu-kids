# RVU Kids — Public Parent Guide and Children's Learning World

## Homepage wireframe

```text
┌────────────────────────────────────────────┐
│ RVU Kids                       اللغة       │
│                                            │
│ اكتشف الإنجليزية من عالم الكتاب           │
│                                            │
│ ┌────────────────┐ ┌────────────────────┐ │
│ │ للأهل          │ │ للأطفال            │ │
│ │ دليل الاستخدام │ │ عالم الحروف A–Z    │ │
│ │ الكتاب والطلب  │ │ القصص والألعاب     │ │
│ └────────────────┘ └────────────────────┘ │
│                                            │
│           Original book cover              │
└────────────────────────────────────────────┘
```

The storefront has two clear routes: the **public parent guide** at
`/parents/#parent-guide` and the **open child lesson world** at `/learn/`.
Parent product information and ordering remain separate from the lesson UI.

## Public parent guide

- 26 alphabet lessons and 15 everyday situations, both free to open without accounts
- Explanation of ages, lesson use, pronunciation repetition and suitable short sessions
- Browser-only voice speed (0.7×, 0.85×, 1×, 1.15×) and reduced motion
- Optional offline save and removal of the beginner A/B pack
- Selected five-page book preview and printed-book purchase information
- Arabic and English presentation
- **No student profile, progress chart, completed stations, saved star album,
  scores, child identifier or account signup**

## Child adventure

- Explore any alphabet stop in any order
- Open any Everyday English situational lesson
- Listen to book-based vocabulary and correct recorded phrases
- Use image-first choices, optional hints and short supportive animations
- Move to the next lesson using a plain navigation link
- Wrong answers invite another try; correct answers produce short *temporary*
  feedback only, with nothing stored about the child
- Old sticker-album URL redirects to `/learn/`

## Four illustrated story scenarios

| Lesson | Situation 1 | Situation 2 | Situation 3 |
| --- | --- | --- | --- |
| Polite Words | Borrow a ball | Receive a gift | Apologize |
| Can I Have | Ask for a ball | Ask for a book | Ask for water |
| Can You Help | Ask for help | Ask for clarification | Ask to repeat |
| At School | Arrive at school | Introduce teacher | Show book |

Audio stays user-triggered. The original cover characters provide small
welcome, pointing and correct-answer motions. Reduced-motion settings are
supported, and tapping/clicking is a full alternative to dragging.

## Regression and capacity checks

- CI: `npm test` includes all asset, HTML, lesson, voice mapping, and
  interaction tests.
- `tests/public-stateless.test.mjs` simulates 1,000 independent visitors and
  checks that visits cannot write student history.
- This is a **state-isolation test**, not proof of hosting capacity for
  1,000 simultaneous connections. Test that on the production CDN.
- Content fidelity and human phonetic review are separate release gates;
  see `docs/book-curriculum-audit.md` and `docs/audio-review.md`.
