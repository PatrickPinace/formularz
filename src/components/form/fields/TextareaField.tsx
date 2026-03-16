import type { Field } from '../../../lib/types';

interface TextareaFieldProps {
  field: Field;
  value: string | undefined;
  onChange: (value: string) => void;
  error?: string;
  content: Record<string, any>;
}

export default function TextareaField({ field, value, onChange, error, content }: TextareaFieldProps) {
  return (
    <div className="field textarea-field">
      <label htmlFor={field.id}>
        {String(content[field.labelKey] || field.labelKey)}
        {field.required && <span className="required"> *</span>}
      </label>
      {field.helpKey && (
        <p className="help-text">{String(content[field.helpKey] || '')}</p>
      )}
      <textarea
        id={field.id}
        name={field.id}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder ? String(content[field.placeholder] || '') : ''}
        rows={4}
      />
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
