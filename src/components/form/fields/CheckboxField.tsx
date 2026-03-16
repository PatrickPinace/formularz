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
    <div className="space-y-3">
      <fieldset>
        <legend className="block text-base font-semibold text-neutral-700 mb-3">
          {String(content[field.labelKey] || field.labelKey)}
          {field.required && <span className="text-error ml-1">*</span>}
        </legend>
        {field.helpKey && (
          <p className="text-sm text-neutral-600 mb-3">{String(content[field.helpKey] || '')}</p>
        )}
        <div className="space-y-2">
          {field.options?.map((option) => {
            const isChecked = value.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleChange(option.value, !isChecked)}
                className={`w-full min-h-[56px] px-4 py-3 text-left border-2 rounded-lg transition-all duration-200 ${
                  isChecked
                    ? 'border-primary bg-primary-light/10 text-neutral-900'
                    : 'border-neutral-300 bg-white hover:border-primary/50 hover:bg-neutral-50 text-neutral-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
                    isChecked ? 'border-primary bg-primary' : 'border-neutral-400 bg-white'
                  }`}>
                    {isChecked && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-base font-medium leading-tight">
                    {String(content[option.labelKey] || option.labelKey)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        {error && <p className="text-sm text-error mt-2">{error}</p>}
      </fieldset>
    </div>
  );
}
