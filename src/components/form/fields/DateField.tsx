import type { Field } from '../../../lib/types';

interface DateFieldProps {
  field: Field;
  value: string | undefined;
  onChange: (value: string) => void;
  error?: string;
  content: Record<string, any>;
}

export default function DateField({ field, value, onChange, error, content }: DateFieldProps) {
  // Dla due_date (termin porodu) blokuj wybór dat z przeszłości
  const today = new Date().toISOString().split('T')[0];
  const minDate = field.id === 'due_date' ? today : undefined;

  return (
    <div className="space-y-2">
      <label htmlFor={field.id} className="block text-base font-semibold text-neutral-700">
        {String(content[field.labelKey] || field.labelKey)}
        {field.required && <span className="text-error ml-1">*</span>}
      </label>
      {field.helpKey && (
        <p className="text-sm text-neutral-600 -mt-1">{String(content[field.helpKey] || '')}</p>
      )}
      <input
        type="date"
        id={field.id}
        name={field.id}
        value={value || ''}
        min={minDate}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all min-h-[44px] ${
          error ? 'border-error' : 'border-neutral-300'
        }`}
      />
      {error && <p className="text-sm text-error mt-1">{error}</p>}
    </div>
  );
}
