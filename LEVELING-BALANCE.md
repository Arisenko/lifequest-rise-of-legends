# Leveling balance

All XP awards use the shared progression curve in `src/data/progression.ts`:

`XP to next level = 3000 × level + 200 × level²`.

Examples: level 1 → 2 costs 3,200 XP; 10 → 11 costs 50,000; 25 → 26 costs 200,000; 50 → 51 costs 650,000; 99 → 100 costs 2,257,200. Maximum remains 100, with no further XP accumulation.

Training XP still grows linearly with level, while level requirements grow quadratically. A full set of ten daily activities no longer grants a level by itself at any level. Weekly and monthly challenges remain valuable without the former multiple-level jumps. Combat uses exactly the same XP threshold. Reward amounts, gold, attributes, resets and item rewards are unchanged in this balance pass.

Both the persistent header and character progress panel use the same threshold, with a full progress bar at maximum level. Existing player levels, items and earned XP are retained without a reset or retrospective downgrade; the displayed fraction decreases because the next threshold is higher.

This is an initial long-term progression baseline, not a promised time-to-cap. Real pacing depends on actual activity completion and combat frequency; repeatable combat has no global daily XP cap. Further tuning should use observed play rather than assuming everyone completes all activities.
