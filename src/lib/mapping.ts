import type { Answers, FormSubmission, FlowType } from './types';

/**
 * Mapuje odpowiedzi użytkownika do formatu rekordu NocoDB
 */
export function mapAnswersToNocoRecord(answers: Answers): FormSubmission {
  // Helper do konwersji wartości na string
  const toStr = (val: any) => val !== undefined && val !== null ? String(val) : undefined;

  // Helper do zachowania array (dla MultiSelect) lub konwersji na string
  const toArray = (val: any) => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      // Jeśli to JSON string, sparsuj do array
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : undefined;
      } catch {
        return undefined;
      }
    }
    return undefined;
  };

  // Helper do łączenia adresu z osobnych pól
  const combineAddress = (street?: any, postalCode?: any, city?: any): string | undefined => {
    const parts = [
      street ? String(street) : null,
      postalCode ? String(postalCode) : null,
      city ? String(city) : null,
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(', ') : undefined;
  };

  // Określamy flow_type na podstawie ścieżki
  let flowType: FlowType | undefined;
  if (answers.pregnancy_path === 'ciąża_i_położna') {
    flowType = 'pregnancy_midwife';
  } else if (answers.pregnancy_path === 'inne_usługi' || answers.gender === 'mężczyzna') {
    flowType = 'general_services';
  }

  return {
    submission_uuid: String(answers.submission_uuid || ''),
    flow_type: flowType,

    // Podstawowe dane
    gender: toStr(answers.gender),
    pregnancy_path: toStr(answers.pregnancy_path),
    ikp_status: toStr(answers.ikp_status),
    full_name: toStr(answers.full_name),
    email: toStr(answers.email),
    phone: toStr(answers.phone),
    pesel_or_birthdate: toStr(answers.pesel_or_birthdate),
    address_main: combineAddress(
      answers.address_main_street,
      answers.address_main_postal_code,
      answers.address_main_city
    ),

    // Pregnancy details
    midwife_choice: toStr(answers.midwife_choice),
    due_date: toStr(answers.due_date),
    pregnancy_care: toStr(answers.pregnancy_care),
    hospitalization: toStr(answers.hospitalization),
    multiple_pregnancy: toStr(answers.multiple_pregnancy),
    postpartum_same_address: toStr(answers.postpartum_same_address),
    postpartum_address: combineAddress(
      answers.postpartum_address_street,
      answers.postpartum_address_postal_code,
      answers.postpartum_address_city
    ),
    authorized_person: toStr(answers.authorized_person),
    birth_school: toStr(answers.birth_school),

    // Services male (MultiSelect arrays)
    services_male_free: toArray(answers.services_male_free),
    services_male_free_other: toStr(answers.services_male_free_other),
    services_male_paid: toArray(answers.services_male_paid),
    services_male_paid_other: toStr(answers.services_male_paid_other),

    // Services female (MultiSelect arrays)
    services_female_free: toArray(answers.services_female_free),
    services_female_free_other: toStr(answers.services_female_free_other),
    services_female_paid: toArray(answers.services_female_paid),
    services_female_paid_other: toStr(answers.services_female_paid_other),

    // Contact preferences
    participation_preference: toStr(answers.participation_preference),
    messengers: toArray(answers.messengers),
    how_found: toStr(answers.how_found),
    how_found_other: toStr(answers.how_found_other),
    additional_notes: toStr(answers.additional_notes),

    // Meta
    raw_answers_json: JSON.stringify(answers),
    created_at_client: toStr(answers.created_at_client),
    submitted_at_client: toStr(answers.submitted_at_client),
  };
}

/**
 * Parsuje rekord z NocoDB do formatu Answers
 */
export function mapNocoRecordToAnswers(record: any): Answers {
  // Helper do parsowania MultiSelect (już są jako array z NocoDB)
  const parseArray = (val: any) => {
    if (!val) return undefined;
    if (Array.isArray(val)) return val;
    // Fallback dla starych danych (JSON string)
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : undefined;
      } catch {
        return undefined;
      }
    }
    return undefined;
  };

  if (record.raw_answers_json) {
    try {
      return JSON.parse(record.raw_answers_json);
    } catch (e) {
      console.error('Failed to parse raw_answers_json:', e);
    }
  }

  // Fallback - budujemy answers z pól bezpośrednich
  return {
    submission_uuid: record.submission_uuid,
    status: record.status,

    // Podstawowe dane
    gender: record.gender,
    pregnancy_path: record.pregnancy_path,
    ikp_status: record.ikp_status,
    full_name: record.full_name,
    email: record.email,
    phone: record.phone,
    pesel_or_birthdate: record.pesel_or_birthdate,
    address_main: record.address_main,

    // Pregnancy details
    midwife_choice: record.midwife_choice,
    due_date: record.due_date,
    pregnancy_care: record.pregnancy_care,
    hospitalization: record.hospitalization,
    multiple_pregnancy: record.multiple_pregnancy,
    postpartum_same_address: record.postpartum_same_address,
    postpartum_address: record.postpartum_address,
    authorized_person: record.authorized_person,
    birth_school: record.birth_school,

    // Services male
    services_male_free: parseArray(record.services_male_free),
    services_male_free_other: record.services_male_free_other,
    services_male_paid: parseArray(record.services_male_paid),
    services_male_paid_other: record.services_male_paid_other,

    // Services female
    services_female_free: parseArray(record.services_female_free),
    services_female_free_other: record.services_female_free_other,
    services_female_paid: parseArray(record.services_female_paid),
    services_female_paid_other: record.services_female_paid_other,

    // Contact preferences
    participation_preference: record.participation_preference,
    messengers: parseArray(record.messengers),
    how_found: record.how_found,
    how_found_other: record.how_found_other,
    additional_notes: record.additional_notes,

    // Meta
    current_step: record.current_step,
  };
}
