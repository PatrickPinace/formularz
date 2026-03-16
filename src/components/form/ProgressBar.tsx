interface ProgressBarProps {
  currentStepIndex: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStepIndex, totalSteps }: ProgressBarProps) {
  const percentage = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-3 text-sm text-neutral-600">
        <span className="font-medium">Krok {currentStepIndex + 1} z {totalSteps}</span>
        <span className="font-semibold text-primary">{percentage}%</span>
      </div>
      <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
