import type { Step, Field, Answers } from './types';
import { isVisible } from './visibility';

export type ValidationErrors = Record<string, string>;

/**
 * Waliduje wszystkie pola w danym kroku
 */
export function validateStep(step: Step, answers: Answers): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!step.fields) return errors;

  for (const field of step.fields) {
    // Pomijamy pola niewidoczne
    if (!isVisible(field, answers)) continue;

    const value = answers[field.id];

    // Sprawdzamy wymagalność
    if (field.required) {
      if (value === undefined || value === null || value === '') {
        errors[field.id] = 'Pole wymagane';
        continue;
      }

      // Dla checkbox sprawdzamy czy wybrano coś
      if (field.type === 'checkbox' && Array.isArray(value) && value.length === 0) {
        errors[field.id] = 'Wybierz przynajmniej jedną opcję';
        continue;
      }
    }

    // Walidacja email
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(String(value))) {
        errors[field.id] = 'Nieprawidłowy adres email';
        continue;
      }
    }

    // Walidacja telefonu (podstawowa - polskie numery)
    if (field.type === 'tel' && value) {
      const phoneRegex = /^(\+48)?[\s-]?\d{3}[\s-]?\d{3}[\s-]?\d{3}$/;
      if (!phoneRegex.test(String(value).replace(/\s/g, ''))) {
        errors[field.id] = 'Nieprawidłowy numer telefonu';
        continue;
      }
    }

    // Walidacja daty porodu - nie może być z przeszłości
    if (field.id === 'due_date' && field.type === 'date' && value) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dueDate = new Date(String(value));
      dueDate.setHours(0, 0, 0, 0);

      if (dueDate < today) {
        errors[field.id] = 'Termin porodu nie może być z przeszłości';
        continue;
      }
    }
  }

  return errors;
}

/**
 * Sprawdza czy krok jest poprawnie wypełniony
 */
export function isStepValid(step: Step, answers: Answers): boolean {
  const errors = validateStep(step, answers);
  return Object.keys(errors).length === 0;
}

/**
 * Walidacja biznesowa dla całego formularza (używana przed submitem)
 */
export function validateFullForm(answers: Answers): ValidationErrors {
  const errors: ValidationErrors = {};

  // Gender jest zawsze wymagane
  if (!answers.gender) {
    errors.gender = 'Płeć jest wymagana';
  }

  // Dla kobiet wymagana jest ścieżka
  if (answers.gender === 'kobieta' && !answers.pregnancy_path) {
    errors.pregnancy_path = 'Wybór ścieżki jest wymagany';
  }

  // Dla ścieżki ciążowej wymagane są dodatkowe pola
  if (answers.pregnancy_path === 'ciąża_i_położna') {
    if (!answers.due_date) {
      errors.due_date = 'Termin porodu jest wymagany';
    } else {
      // Walidacja daty porodu - nie może być z przeszłości
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dueDate = new Date(String(answers.due_date));
      dueDate.setHours(0, 0, 0, 0);

      if (dueDate < today) {
        errors.due_date = 'Termin porodu nie może być z przeszłości';
      }
    }
    if (!answers.midwife_choice) {
      errors.midwife_choice = 'Wybór położnej jest wymagany';
    }
    if (!answers.pregnancy_care) {
      errors.pregnancy_care = 'Wybór prowadzenia ciąży jest wymagany';
    }
    if (!answers.hospitalization) {
      errors.hospitalization = 'Informacja o hospitalizacji jest wymagana';
    }
    if (!answers.multiple_pregnancy) {
      errors.multiple_pregnancy = 'Informacja o ciąży mnogiej jest wymagana';
    }
    if (!answers.postpartum_same_address) {
      errors.postpartum_same_address = 'Informacja o adresie pobytu jest wymagana';
    }

    // Jeśli adres pobytu jest inny, wymagamy go
    if (answers.postpartum_same_address === 'nie') {
      if (!answers.postpartum_address_street) {
        errors.postpartum_address_street = 'Ulica i numer są wymagane';
      }
      if (!answers.postpartum_address_postal_code) {
        errors.postpartum_address_postal_code = 'Kod pocztowy jest wymagany';
      }
      if (!answers.postpartum_address_city) {
        errors.postpartum_address_city = 'Miasto jest wymagane';
      }
    }
  }

  // Podstawowe dane osobowe
  if (!answers.full_name) {
    errors.full_name = 'Imię i nazwisko jest wymagane';
  }
  if (!answers.email) {
    errors.email = 'Email jest wymagany';
  }
  if (!answers.phone) {
    errors.phone = 'Telefon jest wymagany';
  }
  if (!answers.pesel_or_birthdate) {
    errors.pesel_or_birthdate = 'PESEL lub data urodzenia jest wymagany';
  }
  if (!answers.address_main_street) {
    errors.address_main_street = 'Ulica i numer są wymagane';
  }
  if (!answers.address_main_postal_code) {
    errors.address_main_postal_code = 'Kod pocztowy jest wymagany';
  }
  if (!answers.address_main_city) {
    errors.address_main_city = 'Miasto jest wymagane';
  }

  // Walidacja pól "inne" - jeśli wybrano "inne", wymagamy opisu
  if (Array.isArray(answers.services_male_free) && answers.services_male_free.includes('inne')) {
    if (!answers.services_male_free_other) {
      errors.services_male_free_other = 'Proszę opisać inne usługi';
    }
  }
  if (Array.isArray(answers.services_male_paid) && answers.services_male_paid.includes('inne')) {
    if (!answers.services_male_paid_other) {
      errors.services_male_paid_other = 'Proszę opisać inne usługi';
    }
  }
  if (Array.isArray(answers.services_female_free) && answers.services_female_free.includes('inne')) {
    if (!answers.services_female_free_other) {
      errors.services_female_free_other = 'Proszę opisać inne usługi';
    }
  }
  if (Array.isArray(answers.services_female_paid) && answers.services_female_paid.includes('inne')) {
    if (!answers.services_female_paid_other) {
      errors.services_female_paid_other = 'Proszę opisać inne usługi';
    }
  }
  if (answers.how_found === 'inne' && !answers.how_found_other) {
    errors.how_found_other = 'Proszę opisać skąd dowiedziałeś się o nas';
  }

  // Preferencje uczestnictwa
  if (!answers.participation_preference) {
    errors.participation_preference = 'Preferencja uczestnictwa jest wymagana';
  }
  if (!answers.how_found) {
    errors.how_found = 'Informacja o źródle kontaktu jest wymagana';
  }

  return errors;
}
