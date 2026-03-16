import type { Step, Field, Answers } from '../../lib/types';
import { isVisible } from '../../lib/visibility';
import RadioField from './fields/RadioField';
import CheckboxField from './fields/CheckboxField';
import TextField from './fields/TextField';
import TextareaField from './fields/TextareaField';
import DateField from './fields/DateField';

interface StepRendererProps {
  step: Step;
  answers: Answers;
  errors: Record<string, string>;
  content: Record<string, any>;
  onFieldChange: (fieldId: string, value: any) => void;
}

export default function StepRenderer({
  step,
  answers,
  errors,
  content,
  onFieldChange,
}: StepRendererProps) {
  const renderField = (field: Field) => {
    // Sprawdź widoczność pola
    if (!isVisible(field, answers)) {
      return null;
    }

    const commonProps = {
      field,
      error: errors[field.id],
      content,
    };

    switch (field.type) {
      case 'radio':
        return (
          <RadioField
            key={field.id}
            {...commonProps}
            value={answers[field.id] as string}
            onChange={(value) => onFieldChange(field.id, value)}
          />
        );

      case 'checkbox':
        return (
          <CheckboxField
            key={field.id}
            {...commonProps}
            value={answers[field.id] as string[]}
            onChange={(value) => onFieldChange(field.id, value)}
          />
        );

      case 'textarea':
        return (
          <TextareaField
            key={field.id}
            {...commonProps}
            value={answers[field.id] as string}
            onChange={(value) => onFieldChange(field.id, value)}
          />
        );

      case 'date':
        return (
          <DateField
            key={field.id}
            {...commonProps}
            value={answers[field.id] as string}
            onChange={(value) => onFieldChange(field.id, value)}
          />
        );

      case 'text':
      case 'email':
      case 'tel':
        return (
          <TextField
            key={field.id}
            {...commonProps}
            value={answers[field.id] as string}
            onChange={(value) => onFieldChange(field.id, value)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="step-content">
      <div className="step-header">
        <h2>{String(content[step.titleKey] || step.titleKey)}</h2>
        {step.descriptionKey && (
          <p className="step-description">
            {String(content[step.descriptionKey] || '')}
          </p>
        )}
      </div>

      <div className="step-fields">
        {step.type === 'info' && (
          <div className="info-step">
            <p>{String(content[step.descriptionKey || step.titleKey] || '')}</p>
          </div>
        )}

        {step.type === 'summary' && (
          <div className="summary-step">
            <h3>Podsumowanie twoich danych</h3>
            <pre>{JSON.stringify(answers, null, 2)}</pre>
          </div>
        )}

        {(step.type === 'question' || step.type === 'group') &&
          step.fields?.map((field) => renderField(field))}
      </div>
    </div>
  );
}
