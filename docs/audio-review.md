# RVU Kids — American English audio acceptance

**Release status: Fish and Fork remain blocked in every child's lesson until reviewed.**

## Known recordings needing correction

The curriculum's audio row is a stable zero-based index. These are the four
current files; their existence does **not** imply that their pronunciation is
correct.

| Word | Audio index | Female | Male | Status |
|---|---:|---|---|---|
| Fish | 037 | /assets/audio/female/037.mp3 | /assets/audio/male/037.mp3 | REVIEW REQUIRED |
| Fork | 040 | /assets/audio/female/040.mp3 | /assets/audio/male/040.mp3 | REVIEW REQUIRED |

## Required human review

1. Record or regenerate the exact written word in General American English.
   Fish should have the short vowel of *sit*; Fork should use the intended
   American rhotic pronunciation. Do not substitute an unrelated word.
2. Listen to both voice versions at **1.0×** first, then check 0.70×, 0.85×
   and 1.15×. Slower playback must preserve pitch and clarity.
3. Check initial/final consonants, vowel quality, stress, artificial artifacts,
   clipping, background noise, and loudness consistency with other lessons.
4. Independently listen on a phone speaker and headphones. Verify filenames
   and match the exact word and lesson identifier.
5. Replace the recordings **at the same approved paths** after review, update
   the audio cache version when applicable, remove those words from the
   blocked set, and rerun the regression tests.
6. Mark the review complete only with a named human reviewer and date in
   the project's audio sign-off record.

The website intentionally does not use speech synthesis to bypass a blocked
clip. Any listening quiz requiring a blocked word must skip or disable that
option rather than present unapproved pronunciation.

## Audio presence vs. pronunciation quality

Automated tests can verify file presence, audio headers, the mapping of
written words to filenames and that the blocked words cannot play. They
**cannot** certify an American accent or perceptual quality. Audio review
requires actual listening and approval.

Do not count Fish or Fork as fixed until the new files are checked by ear.

## Additional gaps identified on 11 November 2026

The book curriculum and the 244-row audio manifest do not fully agree. The following fifteen **book words currently have no word-specific approved recording in either voice**: carrot, drum, envelope, engine, fox, igloo, jeep, king, nurse, owl, ox, pencil, rose, strawberry, snake. The legacy recordings instead contain cup, doll, ear, elbow, fork, island, jam, kangaroo, night, ocean, otter, pen, rain, sock and spoon. The site now uses recorded word clips across lessons only when the word matches, and labels unrecorded vocabulary as under review. It must not pronounce a different word or silently switch to an operating-system voice.

The owner also flagged the E letter recording for correction. Specifically review **letter-name E at index 028** and **short-e letter-sound at index 029**, in both female and male tracks. The existing **male elephant (030)** and **male egg (031)** are the requested reference speaker for a future unified male re-recording; this is a preference, not evidence that the other male recordings currently match that speaker.

Do not mark the audio library completely corrected until all fifteen missing word pairs have been recorded, E is repaired, any pre-existing phonetic problems are resolved, and each recording has passed a human listening check at all supported playback rates. After replacing a media file, update the service-worker cache version so clients receive the replacement.
