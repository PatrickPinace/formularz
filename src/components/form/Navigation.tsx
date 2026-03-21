interface NavigationProps {
  canGoBack: boolean;
  canGoNext: boolean;
  isLastStep: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  errorCount?: number;
}

export default function Navigation({
  canGoBack,
  canGoNext,
  isLastStep,
  onBack,
  onNext,
  onSubmit,
  isSubmitting = false,
  errorCount = 0,
}: NavigationProps) {
  return (
    <div className="mt-8">
      {errorCount > 0 && (
        <div className="mb-4 p-4 bg-error/10 border border-error/30 rounded-lg">
          <p className="text-sm font-medium text-error">
            ⚠️ Uzupełnij {errorCount} {errorCount === 1 ? 'wymagane pole' : errorCount < 5 ? 'wymagane pola' : 'wymaganych pól'}
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-neutral-200">
      {canGoBack && (
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg font-medium transition-colors duration-200 order-2 sm:order-1"
        >
          ← Wstecz
        </button>
      )}
      <div className="flex-1" />
      {!isLastStep ? (
        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2 w-full sm:w-auto min-h-[44px]"
        >
          Dalej →
        </button>
      ) : (
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2 w-full sm:w-auto min-h-[44px]"
        >
          {isSubmitting ? 'Wysyłanie...' : 'Wyślij zgłoszenie'}
        </button>
      )}
      </div>
    </div>
  );
}
