import type { Field } from '../../../lib/types';

interface DateFieldProps {
  field: Field;
  value: string | undefined;
  onChange: (value: string) => void;
  error?: string;
  content: Record<string, any>;
}

export default function DateField({ field, value, onChange, error, content }: DateFieldProps) {
  return (
    <div className="field date-field">
      <label htmlFor={field.id}>
        {String(content[field.labelKey] || field.labelKey)}
        {field.required && <span className="required"> *</span>}
      </label>
      {field.helpKey && (
        <p className="help-text">{String(content[field.helpKey] || '')}</p>
      )}
      <input
        type="date"
        id={field.id}
        name={field.id}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
