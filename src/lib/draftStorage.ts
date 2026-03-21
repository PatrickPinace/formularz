import type { Answers } from './types';

const DRAFT_KEY = 'formDraft:v2';
const DRAFT_TTL_DAYS = 7;

export interface DraftData {
  answers: Answers;
  currentStepId: string;
  uuid: string;
  version: number;
  updatedAt: string;
}

/**
 * Zapisz draft do localStorage
 */
export function saveDraft(answers: Answers, currentStepId: string, uuid: string): void {
  try {
    const draft: DraftData = {
      answers,
      currentStepId,
      uuid,
      version: 2, // Wersja struktury formularza
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch (error) {
    console.warn('Failed to save draft to localStorage:', error);
  }
}

/**
 * Wczytaj draft z localStorage
 * Zwraca null jeśli draft nie istnieje lub wygasł
 */
export function loadDraft(): DraftData | null {
  try {
    const stored = localStorage.getItem(DRAFT_KEY);
    if (!stored) return null;

    const draft: DraftData = JSON.parse(stored);

    // Sprawdź wersję
    if (draft.version !== 2) {
      console.warn('Draft version mismatch, ignoring old draft');
      clearDraft();
      return null;
    }

    // Sprawdź TTL (7 dni)
    const updatedAt = new Date(draft.updatedAt);
    const now = new Date();
    const daysDiff = (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);

    if (daysDiff > DRAFT_TTL_DAYS) {
      console.warn('Draft expired, clearing');
      clearDraft();
      return null;
    }

    return draft;
  } catch (error) {
    console.warn('Failed to load draft from localStorage:', error);
    clearDraft();
    return null;
  }
}

/**
 * Usuń draft z localStorage
 */
export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (error) {
    console.warn('Failed to clear draft:', error);
  }
}

/**
 * Sprawdź czy istnieje ważny draft
 */
export function hasDraft(): boolean {
  return loadDraft() !== null;
}
