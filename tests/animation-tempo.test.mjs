import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('visible celebration and story animations are calm, readable and respect reduced motion',()=>{
 const base=readFileSync('learn/learn.css','utf8');
 const adventure=readFileSync('learn/next-adventures.css','utf8');
 const journey=readFileSync('learn/story-journey.css','utf8');
 for(const text of ['rvu-quiz-cheer 1.05s','rvu-mascot-wave 1.2s','rvu-picture-tap 1.1s'])assert.ok(base.includes(text),text);
 for(const text of ['rvu-character-cheer 1.25s','rvu-paper-forward 1.05s'])assert.ok(adventure.includes(text),text);
 for(const text of ['rvu-story-welcome 1.05s','rvu-story-success 1.3s','rvu-story-cheer 1.3s'])assert.ok(journey.includes(text),text);
 for(const style of [base,adventure,journey])assert.match(style,/prefers-reduced-motion:reduce/);
});
