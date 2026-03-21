import { useState, useEffect, useMemo } from 'react';
import type { Step, Answers, Rule } from '../../lib/types';
import { validateStep } from '../../lib/validation';
import { saveDraft, loadDraft, clearDraft } from '../../lib/draftStorage';
import StepRenderer from './StepRenderer';
import ProgressBar from './ProgressBar';
import Navigation from './Navigation';

interface FormWizardProps {
  steps: Step[];
  content: Record<string, any>;
  initialAnswers?: Answers;
  submissionUuid?: string;
}

export default function FormWizard({
  steps,
  content,
  initialAnswers = {},
  submissionUuid,
}: FormWizardProps) {
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [currentStepId, setCurrentStepId] = useState<string>(
    (initialAnswers.current_step as string) || steps[0]?.id || 'intro'
  );
  const [history, setHistory] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uuid, setUuid] = useState<string | undefined>(submissionUuid);

  // Znajdź aktualny krok
  const currentStep = useMemo(
    () => steps.find((s) => s.id === currentStepId),
    [steps, currentStepId]
  );

  const currentStepIndex = useMemo(
    () => steps.findIndex((s) => s.id === currentStepId),
    [steps, currentStepId]
  );

  // Inicjalizacja formularza przy pierwszym renderze
  useEffect(() => {
    if (uuid) return; // Już zainicjalizowany

    // Sprawdź czy istnieje zapisany draft
    const draft = loadDraft();

    if (draft) {
      // Prompt użytkownika czy chce przywrócić draft
      const shouldRestore = window.confirm(
        'Znaleziono zapisany szkic formularza. Czy chcesz go przywrócić?'
      );

      if (shouldRestore) {
        // Przywróć draft
        setAnswers(draft.answers);
        setCurrentStepId(draft.currentStepId);
        setUuid(draft.uuid);
        return;
      } else {
        // Usuń stary draft
        clearDraft();
      }
    }

    // Nowy formularz - wygeneruj UUID
    const newUuid = crypto.randomUUID();
    setUuid(newUuid);
    setAnswers({
      submission_uuid: newUuid,
      created_at_client: new Date().toISOString(),
    });
  }, []);

  // Autosave do localStorage przy każdej zmianie
  useEffect(() => {
    if (!uuid) return;

    // Debounce 1 sekunda
    const timer = setTimeout(() => {
      saveDraft(answers, currentStepId, uuid);
    }, 1000);

    return () => clearTimeout(timer);
  }, [answers, currentStepId, uuid]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
    // Wyczyść błąd dla tego pola
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const resolveNext = (): string | null => {
    if (!currentStep?.next) return null;

    if (typeof currentStep.next === 'string') {
      return currentStep.next;
    }

    // Sprawdź reguły
    for (const rule of currentStep.next as Rule[]) {
      const matches = Object.entries(rule.when).every(([key, value]) => {
        return answers[key] === value;
      });
      if (matches) {
        return rule.goTo;
      }
    }

    return null;
  };

  const handleNext = () => {
    if (!currentStep) return;

    // Waliduj aktualny krok
    const stepErrors = validateStep(currentStep, answers);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);

      // Scroll do pierwszego błędu
      const firstErrorFieldId = Object.keys(stepErrors)[0];
      const firstErrorElement = document.getElementById(firstErrorFieldId);
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorElement.focus();
      }

      return;
    }

    setErrors({});

    // Znajdź następny krok
    const nextStepId = resolveNext();
    if (nextStepId) {
      setHistory((prev) => [...prev, currentStepId]);
      setCurrentStepId(nextStepId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (history.length > 0) {
      const prevStepId = history[history.length - 1];
      setHistory((prev) => prev.slice(0, -1));
      setCurrentStepId(prevStepId);
      setErrors({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    console.log('handleSubmit called, uuid:', uuid);

    if (!uuid) {
      alert('Brak UUID - formularz nie został zainicjalizowany. Odśwież stronę.');
      return;
    }

    setIsSubmitting(true);
    console.log('Sending form data to /api/form-submit...');

    try {
      const res = await fetch('/api/form-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission_uuid: uuid,
          answers: {
            ...answers,
            submitted_at_client: new Date().toISOString(),
            status: 'submitted',
          },
        }),
      });

      console.log('Response status:', res.status);

      if (res.ok) {
        const data = await res.json();
        console.log('Success:', data);

        // Wyczyść draft po pomyślnym wysłaniu
        clearDraft();

        alert('Formularz wysłany pomyślnie! Dziękujemy.');
        // Można przekierować użytkownika lub pokazać stronę podziękowania
        window.location.href = '/dziekujemy';
      } else {
        const error = await res.json();
        console.error('Error response:', error);
        alert('Błąd podczas wysyłania formularza: ' + (error.error || 'Nieznany błąd'));
      }
    } catch (err) {
      console.error('Failed to submit form:', err);
      alert('Błąd podczas wysyłania formularza. Spróbuj ponownie.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditStep = (stepId: string) => {
    // Znajdź ścieżkę do tego kroku w historii
    const stepIndex = steps.findIndex((s) => s.id === stepId);
    if (stepIndex === -1) return;

    // Resetuj historię i przejdź do wybranego kroku
    setHistory([]);
    setCurrentStepId(stepId);
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!currentStep) {
    return <div>Błąd: Nie znaleziono kroku formularza</div>;
  }

  const isLastStep = currentStep.type === 'summary';

  return (
    <div className="space-y-6">
      <ProgressBar currentStepIndex={currentStepIndex} totalSteps={steps.length} />

      <StepRenderer
        step={currentStep}
        answers={answers}
        errors={errors}
        content={content}
        onFieldChange={handleFieldChange}
        onEditStep={handleEditStep}
      />

      <Navigation
        canGoBack={history.length > 0}
        canGoNext={true}
        isLastStep={isLastStep}
        onBack={handleBack}
        onNext={handleNext}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        errorCount={Object.keys(errors).length}
      />

      {uuid && (
        <div className="mt-4 text-center text-xs text-neutral-400">
          <small>ID sesji: {uuid}</small>
        </div>
      )}
    </div>
  );
}
