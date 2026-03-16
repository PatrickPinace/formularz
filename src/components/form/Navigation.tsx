interface NavigationProps {
  canGoBack: boolean;
  canGoNext: boolean;
  isLastStep: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export default function Navigation({
  canGoBack,
  canGoNext,
  isLastStep,
  onBack,
  onNext,
  onSubmit,
  isSubmitting = false,
}: NavigationProps) {
  return (
    <div className="navigation">
      {canGoBack && (
        <button type="button" onClick={onBack} className="btn btn-secondary">
          ← Wstecz
        </button>
      )}
      <div className="spacer" />
      {!isLastStep ? (
        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          className="btn btn-primary"
        >
          Dalej →
        </button>
      ) : (
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="btn btn-submit"
        >
          {isSubmitting ? 'Wysyłanie...' : 'Wyślij formularz'}
        </button>
      )}
    </div>
  );
}
