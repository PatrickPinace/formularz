import type { Step, Field, Answers } from '../../lib/types';
import { isVisible } from '../../lib/visibility';
import RadioField from './fields/RadioField';
import CheckboxField from './fields/CheckboxField';
import TextField from './fields/TextField';
import TextareaField from './fields/TextareaField';
import DateField from './fields/DateField';
import SummaryStep from './SummaryStep';

interface StepRendererProps {
  step: Step;
  answers: Answers;
  errors: Record<string, string>;
  content: Record<string, any>;
  onFieldChange: (fieldId: string, value: any) => void;
  onEditStep: (stepId: string) => void;
}

export default function StepRenderer({
  step,
  answers,
  errors,
  content,
  onFieldChange,
  onEditStep,
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
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
          {String(content[step.titleKey] || step.titleKey)}
        </h2>
        {step.descriptionKey && (
          <p className="text-base text-neutral-600 leading-relaxed">
            {String(content[step.descriptionKey] || '')}
          </p>
        )}
      </div>

      <div className="space-y-6">
        {step.type === 'info' && (
          <div className="p-6 bg-neutral-50 border border-neutral-200 rounded-lg">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-base text-neutral-700 leading-relaxed flex-1">
                {String(content[step.descriptionKey || step.titleKey] || '')}
              </p>
            </div>
          </div>
        )}

        {step.type === 'summary' && (
          <SummaryStep answers={answers} content={content} onEdit={onEditStep} />
        )}

        {(step.type === 'question' || step.type === 'group') &&
          step.fields?.map((field) => renderField(field))}
      </div>
    </div>
  );
}
