import type { GameSave } from '../types/game';
export const SAVE_KEY = 'lifequest-save-v1';
export const SCREEN_KEY = 'lifequest-screen-v1';
export function loadSave(): GameSave | null { try { const raw = localStorage.getItem(SAVE_KEY); return raw ? JSON.parse(raw) as GameSave : null; } catch { return null; } }
export function saveGame(save: GameSave) { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); }
export function clearSave() { localStorage.removeItem(SAVE_KEY); localStorage.removeItem(SCREEN_KEY); }
