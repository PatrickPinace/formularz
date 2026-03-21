import type { Step } from './types';

export const steps: Step[] = [
  // Krok 1: Informacje wstępne i RODO
  {
    id: 'intro',
    type: 'info',
    titleKey: 'step.intro.title',
    descriptionKey: 'step.intro.description',
    next: 'gender',
  },

  // Krok 2: Wybór płci
  {
    id: 'gender',
    type: 'question',
    titleKey: 'step.gender.title',
    fields: [
      {
        id: 'gender',
        type: 'radio',
        labelKey: 'field.gender.label',
        required: true,
        options: [
          { value: 'kobieta', labelKey: 'field.gender.option.kobieta' },
          { value: 'mężczyzna', labelKey: 'field.gender.option.mężczyzna' },
        ],
      },
    ],
    next: [
      { when: { gender: 'kobieta' }, goTo: 'pregnancy_entry' },
      { when: { gender: 'mężczyzna' }, goTo: 'identity_common' },
    ],
  },

  // Krok 3: Pytanie o ciążę (tylko dla kobiet)
  {
    id: 'pregnancy_entry',
    type: 'question',
    titleKey: 'step.pregnancy_entry.title',
    descriptionKey: 'step.pregnancy_entry.description',
    fields: [
      {
        id: 'pregnancy_path',
        type: 'radio',
        labelKey: 'field.pregnancy_path.label',
        required: true,
        options: [
          { value: 'ciąża_i_położna', labelKey: 'field.pregnancy_path.option.yes' },
          { value: 'inne_usługi', labelKey: 'field.pregnancy_path.option.no' },
        ],
      },
    ],
    next: 'identity_common',
  },

  // Krok 4: Dane osobowe wspólne
  {
    id: 'identity_common',
    type: 'group',
    titleKey: 'step.identity_common.title',
    descriptionKey: 'step.identity_common.description',
    fields: [
      {
        id: 'ikp_status',
        type: 'radio',
        labelKey: 'field.ikp_status.label',
        helpKey: 'field.ikp_status.help',
        required: true,
        options: [
          { value: 'mam_ikp', labelKey: 'field.ikp_status.option.mam_ikp' },
          { value: 'nie_mam_ikp', labelKey: 'field.ikp_status.option.nie_mam_ikp' },
          { value: 'nie_wiem', labelKey: 'field.ikp_status.option.nie_wiem' },
        ],
      },
      {
        id: 'full_name',
        type: 'text',
        labelKey: 'field.full_name.label',
        required: true,
        placeholder: 'field.full_name.placeholder',
      },
      {
        id: 'email',
        type: 'email',
        labelKey: 'field.email.label',
        required: true,
        placeholder: 'field.email.placeholder',
      },
      {
        id: 'phone',
        type: 'tel',
        labelKey: 'field.phone.label',
        required: true,
        placeholder: 'field.phone.placeholder',
      },
      {
        id: 'pesel_or_birthdate',
        type: 'text',
        labelKey: 'field.pesel_or_birthdate.label',
        helpKey: 'field.pesel_or_birthdate.help',
        required: true,
        placeholder: 'field.pesel_or_birthdate.placeholder',
      },
      {
        id: 'address_main_street',
        type: 'text',
        labelKey: 'field.address_main_street.label',
        helpKey: 'field.address_main_street.help',
        required: true,
        placeholder: 'field.address_main_street.placeholder',
      },
      {
        id: 'address_main_postal_code',
        type: 'text',
        labelKey: 'field.address_main_postal_code.label',
        helpKey: 'field.address_main_postal_code.help',
        required: true,
        placeholder: 'field.address_main_postal_code.placeholder',
      },
      {
        id: 'address_main_city',
        type: 'text',
        labelKey: 'field.address_main_city.label',
        helpKey: 'field.address_main_city.help',
        required: true,
        placeholder: 'field.address_main_city.placeholder',
      },
    ],
    next: [
      { when: { gender: 'mężczyzna' }, goTo: 'services_male' },
      { when: { gender: 'kobieta', pregnancy_path: 'ciąża_i_położna' }, goTo: 'pregnancy_details' },
      { when: { gender: 'kobieta', pregnancy_path: 'inne_usługi' }, goTo: 'services_female' },
    ],
  },

  // Krok 5a: Usługi dla mężczyzn
  {
    id: 'services_male',
    type: 'group',
    titleKey: 'step.services_male.title',
    descriptionKey: 'step.services_male.description',
    fields: [
      {
        id: 'services_male_free',
        type: 'checkbox',
        labelKey: 'field.services_male_free.label',
        helpKey: 'field.services_male_free.help',
        options: [
          { value: 'porada_lekarza', labelKey: 'field.services_male_free.option.porada_lekarza' },
          { value: 'porada_poloznej', labelKey: 'field.services_male_free.option.porada_poloznej' },
          { value: 'porada_psychologa', labelKey: 'field.services_male_free.option.porada_psychologa' },
          { value: 'badania_lab', labelKey: 'field.services_male_free.option.badania_lab' },
          { value: 'inne', labelKey: 'field.services_male_free.option.inne' },
        ],
      },
      {
        id: 'services_male_free_other',
        type: 'textarea',
        labelKey: 'field.services_male_free_other.label',
        visibleIf: [{ field: 'services_male_free', includes: 'inne' }],
        placeholder: 'field.services_male_free_other.placeholder',
      },
      {
        id: 'services_male_paid',
        type: 'checkbox',
        labelKey: 'field.services_male_paid.label',
        helpKey: 'field.services_male_paid.help',
        options: [
          { value: 'usg', labelKey: 'field.services_male_paid.option.usg' },
          { value: 'szczepienia', labelKey: 'field.services_male_paid.option.szczepienia' },
          { value: 'masaz', labelKey: 'field.services_male_paid.option.masaz' },
          { value: 'inne', labelKey: 'field.services_male_paid.option.inne' },
        ],
      },
      {
        id: 'services_male_paid_other',
        type: 'textarea',
        labelKey: 'field.services_male_paid_other.label',
        visibleIf: [{ field: 'services_male_paid', includes: 'inne' }],
        placeholder: 'field.services_male_paid_other.placeholder',
      },
    ],
    next: 'contact_preferences',
  },

  // Krok 5b: Usługi dla kobiet (inne niż ciąża)
  {
    id: 'services_female',
    type: 'group',
    titleKey: 'step.services_female.title',
    descriptionKey: 'step.services_female.description',
    fields: [
      {
        id: 'services_female_free',
        type: 'checkbox',
        labelKey: 'field.services_female_free.label',
        helpKey: 'field.services_female_free.help',
        options: [
          { value: 'porada_lekarza', labelKey: 'field.services_female_free.option.porada_lekarza' },
          { value: 'porada_poloznej', labelKey: 'field.services_female_free.option.porada_poloznej' },
          { value: 'porada_psychologa', labelKey: 'field.services_female_free.option.porada_psychologa' },
          { value: 'badania_lab', labelKey: 'field.services_female_free.option.badania_lab' },
          { value: 'antykoncepcja', labelKey: 'field.services_female_free.option.antykoncepcja' },
          { value: 'cytologia', labelKey: 'field.services_female_free.option.cytologia' },
          { value: 'inne', labelKey: 'field.services_female_free.option.inne' },
        ],
      },
      {
        id: 'services_female_free_other',
        type: 'textarea',
        labelKey: 'field.services_female_free_other.label',
        visibleIf: [{ field: 'services_female_free', includes: 'inne' }],
        placeholder: 'field.services_female_free_other.placeholder',
      },
      {
        id: 'services_female_paid',
        type: 'checkbox',
        labelKey: 'field.services_female_paid.label',
        helpKey: 'field.services_female_paid.help',
        options: [
          { value: 'usg', labelKey: 'field.services_female_paid.option.usg' },
          { value: 'szczepienia', labelKey: 'field.services_female_paid.option.szczepienia' },
          { value: 'masaz', labelKey: 'field.services_female_paid.option.masaz' },
          { value: 'fizjoterapia', labelKey: 'field.services_female_paid.option.fizjoterapia' },
          { value: 'inne', labelKey: 'field.services_female_paid.option.inne' },
        ],
      },
      {
        id: 'services_female_paid_other',
        type: 'textarea',
        labelKey: 'field.services_female_paid_other.label',
        visibleIf: [{ field: 'services_female_paid', includes: 'inne' }],
        placeholder: 'field.services_female_paid_other.placeholder',
      },
    ],
    next: 'contact_preferences',
  },

  // Krok 6: Szczegóły ciąży i wybór położnej
  {
    id: 'pregnancy_details',
    type: 'group',
    titleKey: 'step.pregnancy_details.title',
    descriptionKey: 'step.pregnancy_details.description',
    fields: [
      {
        id: 'midwife_choice',
        type: 'radio',
        labelKey: 'field.midwife_choice.label',
        helpKey: 'field.midwife_choice.help',
        required: true,
        options: [
          { value: 'Położna Anna Nowak', labelKey: 'field.midwife_choice.option.polozna_a' },
          { value: 'Położna Maria Wiśniewska', labelKey: 'field.midwife_choice.option.polozna_b' },
          { value: 'Położna Ewa Kowalczyk', labelKey: 'field.midwife_choice.option.polozna_c' },
          { value: 'Nie wiem jeszcze / pomoc w wyborze', labelKey: 'field.midwife_choice.option.nie_wiem' },
        ],
      },
      {
        id: 'due_date',
        type: 'date',
        labelKey: 'field.due_date.label',
        helpKey: 'field.due_date.help',
        required: true,
      },
      {
        id: 'pregnancy_care',
        type: 'radio',
        labelKey: 'field.pregnancy_care.label',
        required: true,
        options: [
          { value: 'nfz', labelKey: 'field.pregnancy_care.option.nfz' },
          { value: 'prywatnie', labelKey: 'field.pregnancy_care.option.prywatnie' },
          { value: 'mieszane', labelKey: 'field.pregnancy_care.option.mieszane' },
        ],
      },
      {
        id: 'hospitalization',
        type: 'radio',
        labelKey: 'field.hospitalization.label',
        required: true,
        options: [
          { value: 'tak', labelKey: 'field.hospitalization.option.tak' },
          { value: 'nie', labelKey: 'field.hospitalization.option.nie' },
        ],
      },
      {
        id: 'multiple_pregnancy',
        type: 'radio',
        labelKey: 'field.multiple_pregnancy.label',
        required: true,
        options: [
          { value: 'tak', labelKey: 'field.multiple_pregnancy.option.tak' },
          { value: 'nie', labelKey: 'field.multiple_pregnancy.option.nie' },
        ],
      },
      {
        id: 'postpartum_same_address',
        type: 'radio',
        labelKey: 'field.postpartum_same_address.label',
        helpKey: 'field.postpartum_same_address.help',
        required: true,
        options: [
          { value: 'tak', labelKey: 'field.postpartum_same_address.option.tak' },
          { value: 'nie', labelKey: 'field.postpartum_same_address.option.nie' },
        ],
      },
      {
        id: 'postpartum_address_street',
        type: 'text',
        labelKey: 'field.postpartum_address_street.label',
        helpKey: 'field.postpartum_address_street.help',
        required: true,
        visibleIf: [{ field: 'postpartum_same_address', equals: 'nie' }],
        placeholder: 'field.postpartum_address_street.placeholder',
      },
      {
        id: 'postpartum_address_postal_code',
        type: 'text',
        labelKey: 'field.postpartum_address_postal_code.label',
        helpKey: 'field.postpartum_address_postal_code.help',
        required: true,
        visibleIf: [{ field: 'postpartum_same_address', equals: 'nie' }],
        placeholder: 'field.postpartum_address_postal_code.placeholder',
      },
      {
        id: 'postpartum_address_city',
        type: 'text',
        labelKey: 'field.postpartum_address_city.label',
        helpKey: 'field.postpartum_address_city.help',
        required: true,
        visibleIf: [{ field: 'postpartum_same_address', equals: 'nie' }],
        placeholder: 'field.postpartum_address_city.placeholder',
      },
      {
        id: 'authorized_person',
        type: 'text',
        labelKey: 'field.authorized_person.label',
        helpKey: 'field.authorized_person.help',
        placeholder: 'field.authorized_person.placeholder',
      },
      {
        id: 'birth_school',
        type: 'radio',
        labelKey: 'field.birth_school.label',
        options: [
          { value: 'tak', labelKey: 'field.birth_school.option.tak' },
          { value: 'nie', labelKey: 'field.birth_school.option.nie' },
          { value: 'nie_wiem', labelKey: 'field.birth_school.option.nie_wiem' },
        ],
      },
    ],
    next: 'contact_preferences',
  },

  // Krok 7: Preferencje kontaktu
  {
    id: 'contact_preferences',
    type: 'group',
    titleKey: 'step.contact_preferences.title',
    descriptionKey: 'step.contact_preferences.description',
    fields: [
      {
        id: 'participation_preference',
        type: 'radio',
        labelKey: 'field.participation_preference.label',
        helpKey: 'field.participation_preference.help',
        required: true,
        options: [
          { value: 'stacjonarne', labelKey: 'field.participation_preference.option.stacjonarne' },
          { value: 'online', labelKey: 'field.participation_preference.option.online' },
          { value: 'hybrydowo', labelKey: 'field.participation_preference.option.hybrydowo' },
        ],
      },
      {
        id: 'messengers',
        type: 'checkbox',
        labelKey: 'field.messengers.label',
        helpKey: 'field.messengers.help',
        options: [
          { value: 'whatsapp', labelKey: 'field.messengers.option.whatsapp' },
          { value: 'messenger', labelKey: 'field.messengers.option.messenger' },
          { value: 'telegram', labelKey: 'field.messengers.option.telegram' },
          { value: 'signal', labelKey: 'field.messengers.option.signal' },
          { value: 'sms', labelKey: 'field.messengers.option.sms' },
          { value: 'email', labelKey: 'field.messengers.option.email' },
        ],
      },
      {
        id: 'how_found',
        type: 'radio',
        labelKey: 'field.how_found.label',
        required: true,
        options: [
          { value: 'internet', labelKey: 'field.how_found.option.internet' },
          { value: 'social_media', labelKey: 'field.how_found.option.social_media' },
          { value: 'znajomi', labelKey: 'field.how_found.option.znajomi' },
          { value: 'lekarz', labelKey: 'field.how_found.option.lekarz' },
          { value: 'plakat', labelKey: 'field.how_found.option.plakat' },
          { value: 'inne', labelKey: 'field.how_found.option.inne' },
        ],
      },
      {
        id: 'how_found_other',
        type: 'text',
        labelKey: 'field.how_found_other.label',
        visibleIf: [{ field: 'how_found', equals: 'inne' }],
        placeholder: 'field.how_found_other.placeholder',
      },
      {
        id: 'additional_notes',
        type: 'textarea',
        labelKey: 'field.additional_notes.label',
        helpKey: 'field.additional_notes.help',
        placeholder: 'field.additional_notes.placeholder',
      },
    ],
    next: 'summary',
  },

  // Krok 8: Podsumowanie
  {
    id: 'summary',
    type: 'summary',
    titleKey: 'step.summary.title',
    descriptionKey: 'step.summary.description',
  },
];

// Helper do znalezienia kroku po ID
export function getStepById(stepId: string): Step | undefined {
  return steps.find(s => s.id === stepId);
}

// Helper do znalezienia indeksu kroku
export function getStepIndex(stepId: string): number {
  return steps.findIndex(s => s.id === stepId);
}
