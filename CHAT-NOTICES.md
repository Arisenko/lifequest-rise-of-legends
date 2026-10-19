# Compact notice monitor

New or updated important notices automatically expand the monitor, highlight the notice and place it first in the compact preview. This also works while the game area is scrolled down. The notice section inside the full chat expands too; the full dialog is never forced open and keyboard focus stays with the player. Critical preview messages use an accessible alert. A manually folded, unchanged notice does not reopen repeatedly; an updated message/severity or a notice returning after removal triggers attention again. The persistent local-mode label is not treated as a new alert. Notice fingerprints include both translations, so switching language alone does not trigger attention.

Verified with an isolated browser fixture: fold panel, scroll to the bottom, inject an important test notice, observe automatic expansion with retained button focus; fold again and update the same notice, observe expansion again; open full chat and verify notices are expanded there. No test notice was added to the real game or saved player.

The monitor now occupies its own bottom layout row, outside the scrollable game area. It is not a fixed overlay: expanding or folding it reallocates space automatically, so messages cannot cover game controls. The chat dialog remains an intentional modal overlay.

Desktop refinement: notice controls form one full-width header, with messages aligned below instead of a cramped side column. The full chat is a centered 680px dialog with horizontal channel buttons and aligned time/sender/message columns. Verified at 1280px in an isolated fixture with a long sample message: no horizontal log overflow, no game/notice overlap, 54px folded bar. The fixture and sample messages were removed after testing; the player save was not used.

The persistent chat control contains a compact notice preview. It displays at most two important notices, prioritizing critical messages. The header toggles the preview and remembers that preference; Chat opens the existing full communication dialog. The dialog contains the complete bounded important-notice list and world/guild/private player channels.

Current notices are genuinely local: disconnected-server status, save failures/conflicts and earned battle receipts. Player chat messages never enter the important feed, even when the sender calls themselves ADMIN.

`SystemNotice` defines bilingual text, severity, importance, stable ID and system/server/admin source. `ChatDock.notices` is the future integration point for notices fetched by an authenticated server connection. Source labels are presentation metadata, not authorization; future server/admin messages must be verified by the backend. No fake online status, admin messages or player messages are seeded.

The notice list is deduplicated and bounded to 20 entries. This interface introduces no polling, server port or changes to saved heroes. SK/EN labels are supplied together.
