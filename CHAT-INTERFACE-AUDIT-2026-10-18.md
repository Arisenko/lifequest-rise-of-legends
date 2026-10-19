# Chat and interface audit — 18 October 2026

## Delivered
- Persistent bottom shortcuts for character and chat on every gameplay screen.
- Chat in an independent responsive dialog, with internal scrolling rather than expanding the page.
- Escape, explicit close button, focus return, native dialog focus containment and background scroll locking.
- Separate in-memory drafts for world, guild and individual recipient channels. Closing the dialog or changing game screens retains drafts; reloading does not.
- Keyboard channel navigation using arrows, Home and End. Full SK/EN interface.
- Typed chat props and current-state guild authorization when saving a message. Removed the silent one-second rejection that discarded user submissions without explanation.
- Smaller mobile navigation controls, visible keyboard focus, bottom space reserved for persistent shortcuts.

## Verification
- 95 game/system/save tests pass.
- TypeScript and production build pass; JS gzip 133.93 kB, CSS gzip 18.90 kB.
- 18 SK/EN server-render checks pass, including the chat and dialog components.
- In-app mobile viewport: verified dialog opening, channel changes, draft retention, Escape closing and focus returning to the launcher. No real messages sent during testing.
- Exported the current player save through the existing interface and validated the downloaded JSON envelope.

## Boundaries / follow-up
- Chat remains local-only: there is no server, delivery to other players or real incoming-message counter. This is explicitly stated in both languages.
- Native desktop-wide and physical-phone keyboard checks remain to be done; server rendering is not a substitute for visual desktop testing.
- Existing large stylesheets still contain legacy overlapping rules. This change is isolated to a dedicated stylesheet; a complete stylesheet rewrite was intentionally avoided.
- Local backups are in Documents/Codex/LifeQuest-backups. Project archives exclude dependencies, build outputs, Git internals and environment secrets. Player saves are separate because browser localStorage is not included in a project archive.
- No GitHub commit or push performed.
