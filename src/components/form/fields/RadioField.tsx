import type { Field } from '../../../lib/types';

interface RadioFieldProps {
  field: Field;
  value: string | undefined;
  onChange: (value: string) => void;
  error?: string;
  content: Record<string, any>;
}

export default function RadioField({ field, value, onChange, error, content }: RadioFieldProps) {
  return (
    <div className="field radio-field">
      <fieldset>
        <legend>
          {String(content[field.labelKey] || field.labelKey)}
          {field.required && <span className="required"> *</span>}
        </legend>
        {field.helpKey && (
          <p className="help-text">{String(content[field.helpKey] || '')}</p>
        )}
        <div className="radio-options">
          {field.options?.map((option) => (
            <label key={option.value} className="radio-label">
              <input
                type="radio"
                name={field.id}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange(e.target.value)}
              />
              <span>{String(content[option.labelKey] || option.labelKey)}</span>
            </label>
          ))}
        </div>
        {error && <p className="error-text">{error}</p>}
      </fieldset>
    </div>
  );
}
