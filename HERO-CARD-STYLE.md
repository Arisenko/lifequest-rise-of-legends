# Hero welcome card

The welcome card uses the existing local burgundy grain rather than a new large bitmap. Its left introduction is a lightly textured inset, the right stat panel uses a darker treatment and a small decorative compass engraving (`public/assets/art-v1/hero-stat-etching.svg`). Gold borders, spacing, XP/HP/energy bars, attribute tiles and disclosure controls share the established plum/burgundy palette.

Styles are scoped in `src/hero-banner.css`. Below 940px panels stack; the mobile chronicle remains collapsible. No animation, external graphics request or player-data migration was added. Buff details remain absolutely positioned and are not clipped by a new overflow rule.

Checked using an isolated 1280px browser fixture and the actual 369px game viewport. No horizontal overflow; opening a buff detail leaves card height unchanged. The test fixture was removed. The chronicle also avoids naming a boss before it is unlocked, matching enemy discovery rules. Both SK and EN renders are checked.
