# RVU Kids — Parent Mode, Child Journey and Everyday Stories

## Homepage wireframe (implemented)

On desktop and mobile, the first screen gives two equally clear routes:

```text
┌────────────────────────────────────────────────┐
│ RVU KIDS                            Language   │
│                                                │
│ A story that grows with your child             │
│ Choose your journey                            │
│                                                │
│ ┌─────────────────┐ ┌─────────────────┐       │
│ │ FOR PARENTS     │ │ FOR CHILDREN    │       │
│ │ Progress        │ │ Alphabet World  │       │
│ │ How to learn    │ │ Picture lessons │       │
│ │ Preview & order │ │ Everyday stories│       │
│ └─────────────────┘ └─────────────────┘       │
│                                    Book cover  │
└────────────────────────────────────────────────┘
```

The complete ordering form remains on the storefront. No purchase button or
price is shown in the children's main lesson flow. Parent entry is clearly
labeled; it is a UX boundary, not an authentication or access-control wall.

## Parent mode (implemented at /parents/#parent-dashboard)

- Local visited alphabet lessons, completed alphabet lessons, completed
  Everyday English lessons and total earned star stickers
- "Next lesson" link to the first incomplete letter, then first incomplete
  everyday situation
- Last opened lesson, using locally saved lastVisited record
- Guidance for ages 3–4 and 5–6 with a gentle 5–10-minute practice routine
- Global pronunciation speed: 0.7×, 0.85×, 1×, 1.15×
- Reduce-motion preference and optional sticker-album preference
- Explicit confirmation before local progress reset
- Separate printed-book preview, price and order route
- Bilingual Arabic and English content
- No student accounts, names, analytics export or cross-device synchronization

## Story scenes (implemented)

All answers and sound clips are taken from the approved connected curriculum.
New scene-setting prompts are illustrative UI text, not new recordings.
Each target unit presents three visual situations with the original RVU
characters, one scene object, a play-the-phrase control, and three visual
options. Children can hear each option. A wrong answer invites another try;
a correct answer gives short feedback and unlocks the next situation.

| Everyday English lesson | Scene 1 | Scene 2 | Scene 3 |
| --- | --- | --- | --- |
| Polite Words | Borrow a ball: "Please." | Receive a gift: "Thank you." | Apologize: "I'm sorry." |
| Can I Have | Request a ball | Request a book | Request some water |
| Can You Help | Ask for help | Say "I don't understand." | Ask to repeat |
| At School | Arrive at school | Introduce the teacher | Show a book |

## Animation behavior (implemented)

- Initial guide: one short greeting motion
- Explaining/pointing: one small tilt toward the active scene
- Success: one short cheer and kind-specific symbolic celebration
- Listening: notes/stars; spelling: letters; other successes: colored stars
- Completion: optional star from the existing local completion progress
- Visual motion does not autoplay audio
- CSS transforms/opacity used for motion with reduced-motion override

## Development and verification checklist

- [x] Separate parent and child calls to action above the homepage fold
- [x] Parent progress readout from existing on-device learning data
- [x] Local voice, motion and sticker preferences
- [x] Parent book information and order links
- [x] Remove child-facing purchase CTAs from learning hub
- [x] Add four 3-step Everyday English scenes from approved phrases
- [x] Reuse original book characters and existing approved sound files
- [x] Separate celebration effects by game type
- [x] Add automated source-level regression checks
- [ ] Run complete Node test suite in deployment CI
- [ ] Test real playback and interactions on Android Chrome and iOS Safari
- [ ] Verify actual publish of all assets and cache invalidation

## Visual integrity

Original cover characters remain the brand artwork; third-party inspiration
images are not copied into the site. The entire book PDF is not published.
Only the five existing preview images are shown. Those previews must be
updated separately from the verified latest book source, if/when authorized,
without publishing extra pages.
