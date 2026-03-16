interface ProgressBarProps {
  currentStepIndex: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStepIndex, totalSteps }: ProgressBarProps) {
  const percentage = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  return (
    <div className="progress-bar">
      <div className="progress-bar-info">
        <span>Krok {currentStepIndex + 1} z {totalSteps}</span>
        <span>{percentage}%</span>
      </div>
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
