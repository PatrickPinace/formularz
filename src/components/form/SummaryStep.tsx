import type { Answers } from '../../lib/types';
import { steps } from '../../lib/flow';

interface SummaryStepProps {
  answers: Answers;
  content: Record<string, any>;
  onEdit: (stepId: string) => void;
}

interface SummarySection {
  title: string;
  stepId: string;
  items: { label: string; value: string | string[] | undefined; fieldId: string }[];
}

export default function SummaryStep({ answers, content, onEdit }: SummaryStepProps) {
  // Pomocnicza funkcja do formatowania wartości
  const formatValue = (fieldId: string, value: any): string => {
    if (value === undefined || value === null || value === '') {
      return '—';
    }

    if (Array.isArray(value)) {
      if (value.length === 0) return '—';
      // Dla checkboxów - znajdź labele
      return value
        .map((v) => {
          // Szukamy pola w steps
          for (const step of steps) {
            if (step.fields) {
              for (const field of step.fields) {
                if (field.id === fieldId && field.options) {
                  const option = field.options.find((opt) => opt.value === v);
                  if (option) {
                    return String(content[option.labelKey] || v);
                  }
                }
              }
            }
          }
          return v;
        })
        .join(', ');
    }

    // Dla radio - znajdź label
    for (const step of steps) {
      if (step.fields) {
        for (const field of step.fields) {
          if (field.id === fieldId && field.options) {
            const option = field.options.find((opt) => opt.value === value);
            if (option) {
              return String(content[option.labelKey] || value);
            }
          }
        }
      }
    }

    return String(value);
  };

  // Pomocnicza funkcja do znalezienia labela pola
  const getFieldLabel = (fieldId: string): string => {
    for (const step of steps) {
      if (step.fields) {
        for (const field of step.fields) {
          if (field.id === fieldId) {
            return String(content[field.labelKey] || fieldId);
          }
        }
      }
    }
    return fieldId;
  };

  // Budowanie sekcji dynamicznie
  const sections: SummarySection[] = [];

  // Sekcja: Dane osobowe
  const personalData: SummarySection = {
    title: 'Dane osobowe',
    stepId: 'identity_common',
    items: [
      { label: getFieldLabel('full_name'), value: answers.full_name, fieldId: 'full_name' },
      { label: getFieldLabel('email'), value: answers.email, fieldId: 'email' },
      { label: getFieldLabel('phone'), value: answers.phone, fieldId: 'phone' },
      {
        label: getFieldLabel('pesel_or_birthdate'),
        value: answers.pesel_or_birthdate,
        fieldId: 'pesel_or_birthdate',
      },
      {
        label: getFieldLabel('address_main'),
        value: answers.address_main,
        fieldId: 'address_main',
      },
      {
        label: getFieldLabel('ikp_status'),
        value: formatValue('ikp_status', answers.ikp_status),
        fieldId: 'ikp_status',
      },
    ],
  };
  sections.push(personalData);

  // Sekcja: Informacje o ciąży (tylko jeśli pregnancy_path = 'ciąża_i_położna')
  if (answers.pregnancy_path === 'ciąża_i_położna') {
    const pregnancyData: SummarySection = {
      title: 'Informacje o ciąży',
      stepId: 'pregnancy_details',
      items: [
        {
          label: getFieldLabel('midwife_choice'),
          value: formatValue('midwife_choice', answers.midwife_choice),
          fieldId: 'midwife_choice',
        },
        { label: getFieldLabel('due_date'), value: answers.due_date, fieldId: 'due_date' },
        {
          label: getFieldLabel('pregnancy_care'),
          value: formatValue('pregnancy_care', answers.pregnancy_care),
          fieldId: 'pregnancy_care',
        },
        {
          label: getFieldLabel('hospitalization'),
          value: formatValue('hospitalization', answers.hospitalization),
          fieldId: 'hospitalization',
        },
        {
          label: getFieldLabel('multiple_pregnancy'),
          value: formatValue('multiple_pregnancy', answers.multiple_pregnancy),
          fieldId: 'multiple_pregnancy',
        },
        {
          label: getFieldLabel('postpartum_same_address'),
          value: formatValue('postpartum_same_address', answers.postpartum_same_address),
          fieldId: 'postpartum_same_address',
        },
      ],
    };

    if (answers.postpartum_same_address === 'nie') {
      pregnancyData.items.push({
        label: getFieldLabel('postpartum_address'),
        value: answers.postpartum_address,
        fieldId: 'postpartum_address',
      });
    }

    if (answers.authorized_person) {
      pregnancyData.items.push({
        label: getFieldLabel('authorized_person'),
        value: answers.authorized_person,
        fieldId: 'authorized_person',
      });
    }

    if (answers.birth_school) {
      pregnancyData.items.push({
        label: getFieldLabel('birth_school'),
        value: formatValue('birth_school', answers.birth_school),
        fieldId: 'birth_school',
      });
    }

    sections.push(pregnancyData);
  }

  // Sekcja: Usługi
  const servicesData: SummarySection = {
    title: 'Wybrane usługi',
    stepId:
      answers.gender === 'mężczyzna'
        ? 'services_male'
        : answers.pregnancy_path === 'ciąża_i_położna'
          ? 'pregnancy_details'
          : 'services_female',
    items: [],
  };

  if (answers.gender === 'kobieta' && answers.pregnancy_path !== 'ciąża_i_położna') {
    if (answers.services_female_free) {
      servicesData.items.push({
        label: getFieldLabel('services_female_free'),
        value: formatValue('services_female_free', answers.services_female_free),
        fieldId: 'services_female_free',
      });
    }
    if (answers.services_female_free_other) {
      servicesData.items.push({
        label: getFieldLabel('services_female_free_other'),
        value: answers.services_female_free_other,
        fieldId: 'services_female_free_other',
      });
    }
    if (answers.services_female_paid) {
      servicesData.items.push({
        label: getFieldLabel('services_female_paid'),
        value: formatValue('services_female_paid', answers.services_female_paid),
        fieldId: 'services_female_paid',
      });
    }
    if (answers.services_female_paid_other) {
      servicesData.items.push({
        label: getFieldLabel('services_female_paid_other'),
        value: answers.services_female_paid_other,
        fieldId: 'services_female_paid_other',
      });
    }
  }

  if (answers.gender === 'mężczyzna') {
    if (answers.services_male_free) {
      servicesData.items.push({
        label: getFieldLabel('services_male_free'),
        value: formatValue('services_male_free', answers.services_male_free),
        fieldId: 'services_male_free',
      });
    }
    if (answers.services_male_free_other) {
      servicesData.items.push({
        label: getFieldLabel('services_male_free_other'),
        value: answers.services_male_free_other,
        fieldId: 'services_male_free_other',
      });
    }
    if (answers.services_male_paid) {
      servicesData.items.push({
        label: getFieldLabel('services_male_paid'),
        value: formatValue('services_male_paid', answers.services_male_paid),
        fieldId: 'services_male_paid',
      });
    }
    if (answers.services_male_paid_other) {
      servicesData.items.push({
        label: getFieldLabel('services_male_paid_other'),
        value: answers.services_male_paid_other,
        fieldId: 'services_male_paid_other',
      });
    }
  }

  if (servicesData.items.length > 0) {
    sections.push(servicesData);
  }

  // Sekcja: Preferencje kontaktu
  const contactData: SummarySection = {
    title: 'Preferencje kontaktu',
    stepId: 'contact_preferences',
    items: [
      {
        label: getFieldLabel('participation_preference'),
        value: formatValue('participation_preference', answers.participation_preference),
        fieldId: 'participation_preference',
      },
      {
        label: getFieldLabel('messengers'),
        value: formatValue('messengers', answers.messengers),
        fieldId: 'messengers',
      },
      {
        label: getFieldLabel('how_found'),
        value: formatValue('how_found', answers.how_found),
        fieldId: 'how_found',
      },
    ],
  };

  if (answers.how_found === 'inne' && answers.how_found_other) {
    contactData.items.push({
      label: getFieldLabel('how_found_other'),
      value: answers.how_found_other,
      fieldId: 'how_found_other',
    });
  }

  if (answers.additional_notes) {
    contactData.items.push({
      label: getFieldLabel('additional_notes'),
      value: answers.additional_notes,
      fieldId: 'additional_notes',
    });
  }

  sections.push(contactData);

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div
          key={section.stepId}
          className="bg-white border-2 border-neutral-200 rounded-lg overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 bg-neutral-50 border-b border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900">{section.title}</h3>
            <button
              type="button"
              onClick={() => onEdit(section.stepId)}
              className="px-4 py-2 text-sm font-medium text-primary hover:text-primary-dark hover:underline transition-colors"
            >
              Edytuj
            </button>
          </div>
          <div className="divide-y divide-neutral-100">
            {section.items.map((item, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-1 sm:grid-cols-3 gap-2 px-6 py-3 ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'
                }`}
              >
                <dt className="text-sm font-medium text-neutral-600">{item.label}</dt>
                <dd className="text-sm text-neutral-900 sm:col-span-2 break-words">
                  {formatValue(item.fieldId, item.value)}
                </dd>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
