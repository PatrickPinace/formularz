import type { Field, Answers } from './types';

/**
 * Sprawdza czy dane pole powinno być widoczne na podstawie odpowiedzi użytkownika
 */
export function isVisible(field: Field, answers: Answers): boolean {
  if (!field.visibleIf?.length) return true;

  return field.visibleIf.every(rule => {
    const value = answers[rule.field];

    if (rule.equals !== undefined) {
      return value === rule.equals;
    }

    if (rule.notEquals !== undefined) {
      return value !== rule.notEquals;
    }

    if (rule.includes !== undefined) {
      return Array.isArray(value) && value.includes(rule.includes);
    }

    return true;
  });
}
