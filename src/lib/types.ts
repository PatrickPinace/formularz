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
  status: SubmissionStatus;
  flow_type?: FlowType;
  gender?: string;
  pregnancy_path?: string;
  ikp_status?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  pesel_or_birthdate?: string;
  address_main?: string;
  raw_answers_json?: string;
  current_step?: string;
  created_at_client?: string;
  submitted_at_client?: string;
};
