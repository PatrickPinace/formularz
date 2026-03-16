import type { Answers, FormSubmission, FlowType } from './types';

/**
 * Mapuje odpowiedzi użytkownika do formatu rekordu NocoDB
 */
export function mapAnswersToNocoRecord(answers: Answers): FormSubmission {
  // Określamy flow_type na podstawie ścieżki
  let flowType: FlowType | undefined;
  if (answers.pregnancy_path === 'ciąża_i_położna') {
    flowType = 'pregnancy_midwife';
  } else if (answers.pregnancy_path === 'inne_usługi' || answers.gender === 'mężczyzna') {
    flowType = 'general_services';
  }

  return {
    submission_uuid: String(answers.submission_uuid || ''),
    status: (answers.status as any) || 'submitted',
    flow_type: flowType,
    gender: String(answers.gender || ''),
    pregnancy_path: answers.pregnancy_path ? String(answers.pregnancy_path) : undefined,
    ikp_status: answers.ikp_status ? String(answers.ikp_status) : undefined,
    full_name: answers.full_name ? String(answers.full_name) : undefined,
    email: answers.email ? String(answers.email) : undefined,
    phone: answers.phone ? String(answers.phone) : undefined,
    pesel_or_birthdate: answers.pesel_or_birthdate ? String(answers.pesel_or_birthdate) : undefined,
    address_main: answers.address_main ? String(answers.address_main) : undefined,
    raw_answers_json: JSON.stringify(answers),
    current_step: answers.current_step ? String(answers.current_step) : undefined,
    created_at_client: answers.created_at_client ? String(answers.created_at_client) : undefined,
    submitted_at_client: answers.submitted_at_client ? String(answers.submitted_at_client) : undefined,
  };
}

/**
 * Parsuje rekord z NocoDB do formatu Answers
 */
export function mapNocoRecordToAnswers(record: any): Answers {
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
    gender: record.gender,
    pregnancy_path: record.pregnancy_path,
    ikp_status: record.ikp_status,
    full_name: record.full_name,
    email: record.email,
    phone: record.phone,
    pesel_or_birthdate: record.pesel_or_birthdate,
    address_main: record.address_main,
    current_step: record.current_step,
  };
}
