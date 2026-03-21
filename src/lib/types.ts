export type FieldType =
  | 'radio'
  | 'checkbox'
  | 'text'
  | 'textarea'
  | 'email'
  | 'tel'
  | 'date';

export type Option = {
  value: string;
  labelKey: string;
};

export type VisibleIf = {
  field: string;
  equals?: string;
  includes?: string;
  notEquals?: string;
};

export type Field = {
  id: string;
  type: FieldType;
  labelKey: string;
  helpKey?: string;
  required?: boolean;
  options?: Option[];
  visibleIf?: VisibleIf[];
  placeholder?: string;
};

export type Rule = {
  when: Record<string, unknown>;
  goTo: string;
};

export type Step = {
  id: string;
  titleKey: string;
  descriptionKey?: string;
  type: 'info' | 'question' | 'group' | 'summary';
  fields?: Field[];
  next?: string | Rule[];
};

export type ContentMap = Record<string, string | Array<{ value: string; label: string }>>;

export type Answers = Record<string, unknown>;

export type SubmissionStatus = 'draft' | 'submitted' | 'reviewed' | 'archived';

export type FlowType = 'pregnancy_midwife' | 'general_services';

export type FormSubmission = {
  submission_uuid: string;
  flow_type?: FlowType;

  // Podstawowe dane
  gender?: string;
  pregnancy_path?: string;
  ikp_status?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  pesel_or_birthdate?: string;
  address_main?: string;

  // Pregnancy details
  midwife_choice?: string;
  due_date?: string;
  pregnancy_care?: string;
  hospitalization?: string;
  multiple_pregnancy?: string;
  postpartum_same_address?: string;
  postpartum_address?: string;
  authorized_person?: string;
  birth_school?: string;

  // Services male (MultiSelect)
  services_male_free?: string[];
  services_male_free_other?: string;
  services_male_paid?: string[];
  services_male_paid_other?: string;

  // Services female (MultiSelect)
  services_female_free?: string[];
  services_female_free_other?: string;
  services_female_paid?: string[];
  services_female_paid_other?: string;

  // Contact preferences
  participation_preference?: string;
  messengers?: string[]; // MultiSelect
  how_found?: string;
  how_found_other?: string;
  additional_notes?: string;

  // Meta
  raw_answers_json?: string;
  created_at_client?: string;
  submitted_at_client?: string;
};
