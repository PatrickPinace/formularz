import type { Field } from '../../../lib/types';

interface CheckboxFieldProps {
  field: Field;
  value: string[] | undefined;
  onChange: (value: string[]) => void;
  error?: string;
  content: Record<string, any>;
}

export default function CheckboxField({ field, value = [], onChange, error, content }: CheckboxFieldProps) {
  const handleChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange([...value, optionValue]);
    } else {
      onChange(value.filter((v) => v !== optionValue));
    }
  };

  return (
    <div className="field checkbox-field">
      <fieldset>
        <legend>
          {String(content[field.labelKey] || field.labelKey)}
          {field.required && <span className="required"> *</span>}
        </legend>
        {field.helpKey && (
          <p className="help-text">{String(content[field.helpKey] || '')}</p>
        )}
        <div className="checkbox-options">
          {field.options?.map((option) => (
            <label key={option.value} className="checkbox-label">
              <input
                type="checkbox"
                name={field.id}
                value={option.value}
                checked={value.includes(option.value)}
                onChange={(e) => handleChange(option.value, e.target.checked)}
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
