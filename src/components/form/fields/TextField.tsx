import type { Field } from '../../../lib/types';

interface TextFieldProps {
  field: Field;
  value: string | undefined;
  onChange: (value: string) => void;
  error?: string;
  content: Record<string, any>;
}

export default function TextField({ field, value, onChange, error, content }: TextFieldProps) {
  const inputType = field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : 'text';

  return (
    <div className="field text-field">
      <label htmlFor={field.id}>
        {String(content[field.labelKey] || field.labelKey)}
        {field.required && <span className="required"> *</span>}
      </label>
      {field.helpKey && (
        <p className="help-text">{String(content[field.helpKey] || '')}</p>
      )}
      <input
        type={inputType}
        id={field.id}
        name={field.id}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder ? String(content[field.placeholder] || '') : ''}
      />
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
