# RVU Kids — American English audio review
Updated: 11 November 2026

## Current published inventory
- 26 alphabet letter-name rows, 26 letter-sound rows, 101 exact book word rows, 26 alphabet example sentences, 64 Everyday English sentences, and one additional review sentence = **244 mapped recording rows**.
- Each row has exactly two MP3 assets: **female af_sarah** and **male am_liam** (Kokoro English neural synthesizer) = **488 files**.
- All fifteen originally missing book words (carrot, drum, engine, envelope, fox, igloo, jeep, king, nurse, owl, ox, pencil, rose, snake, strawberry) were regenerated with new, matching file mappings.
- E letter **name** is row `028` and E short **sound** is row `029`, each with both voice versions. They were regenerated with explicit phonetic instructions. **Correctness by ear has not been certified.**
- Fish is row `037`; the legacy Fork clip at row `040` was replaced with Fox to match the latest printed F lesson. The old Fish/Fork blocklist was removed after regeneration. That does **not** indicate phonetic perfection.

## Technical verification
The regeneration action validated MP3 decoding, file size, waveform plausibility, and exact curriculum text-to-index mapping. Regression tests verify these mappings and the two selected voice identities. A service worker caches played sound files at `rvu-kids-media-v3`; repeat playback can work offline, subject to browser-managed cache eviction.

## Remaining release-quality checks
1. Listen independently to all 488 recordings on phone speakers and headphones at playback speeds 0.70×, 0.85×, 1× and 1.15×.
2. For the E letter: verify the name /iː/ and the short vowel /ɛ/, with no artificial trailing sound. Also review Fish's /f/ onset.
3. Compare the regenerated male voice with the previous Egg and Elephant recordings favored by the owner. The generator used one male voice ID throughout, but perceptual similarity to the older examples is **not established**.
4. Check initial and final consonants, stress, vowel identity, clipping, unnatural noise and loudness consistency. Any rejected clip should be regenerated and listened to before release approval.
5. Bump service-worker cache version after replacing MP3s and repeat all audio, layout, functional and offline tests. Record who listened and the approval date.

**Status: mechanically consistent and published; human pronunciation signoff remains incomplete.** Neither ASR nor MP3 format checks can certify 100% accurate spoken English.
