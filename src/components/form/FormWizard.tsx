import { useState, useEffect, useMemo } from 'react';
import type { Step, Answers, Rule } from '../../lib/types';
import { validateStep } from '../../lib/validation';
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

  // Inicjalizacja UUID przy pierwszym renderze
  useEffect(() => {
    if (!uuid) {
      initializeForm();
    }
  }, []);

  // Autosave co 5 sekund
  useEffect(() => {
    if (!uuid) return;

    const timer = setTimeout(() => {
      saveDraft();
    }, 5000);

    return () => clearTimeout(timer);
  }, [answers, currentStepId, uuid]);

  const initializeForm = async () => {
    try {
      const res = await fetch('/api/form-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (res.ok) {
        const data = await res.json();
        setUuid(data.submission_uuid);
        setAnswers((prev) => ({
          ...prev,
          submission_uuid: data.submission_uuid,
          created_at_client: new Date().toISOString(),
        }));
      }
    } catch (err) {
      console.error('Failed to initialize form:', err);
    }
  };

  const saveDraft = async () => {
    if (!uuid) return;

    try {
      await fetch('/api/form-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission_uuid: uuid,
          answers: { ...answers, current_step: currentStepId },
          current_step: currentStepId,
        }),
      });
    } catch (err) {
      console.error('Failed to save draft:', err);
    }
  };

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
    if (!uuid) return;

    setIsSubmitting(true);

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

      if (res.ok) {
        const data = await res.json();
        alert('Formularz wysłany pomyślnie! Dziękujemy.');
        // Można przekierować użytkownika lub pokazać stronę podziękowania
        window.location.href = '/dziekujemy';
      } else {
        const error = await res.json();
        alert('Błąd podczas wysyłania formularza: ' + (error.message || 'Nieznany błąd'));
      }
    } catch (err) {
      console.error('Failed to submit form:', err);
      alert('Błąd podczas wysyłania formularza. Spróbuj ponownie.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentStep) {
    return <div>Błąd: Nie znaleziono kroku formularza</div>;
  }

  const isLastStep = currentStep.type === 'summary';

  return (
    <div className="form-wizard">
      <ProgressBar currentStepIndex={currentStepIndex} totalSteps={steps.length} />

      <StepRenderer
        step={currentStep}
        answers={answers}
        errors={errors}
        content={content}
        onFieldChange={handleFieldChange}
      />

      <Navigation
        canGoBack={history.length > 0}
        canGoNext={true}
        isLastStep={isLastStep}
        onBack={handleBack}
        onNext={handleNext}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      {uuid && (
        <div className="form-info">
          <small>ID sesji: {uuid}</small>
        </div>
      )}
    </div>
  );
}
