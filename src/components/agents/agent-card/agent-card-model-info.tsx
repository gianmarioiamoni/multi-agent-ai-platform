/**
 * Agent Card Model Info Component
 * Displays agent model information
 * Following SRP: Only handles model info rendering
 */

interface AgentCardModelInfoProps {
  modelName: string;
}

export const AgentCardModelInfo = ({ modelName }: AgentCardModelInfoProps) => {
  return (
    <div className="flex items-center text-sm">
      <svg
        className="w-4 h-4 mr-2 text-muted-foreground"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
      <span className="text-muted-foreground">{modelName}</span>
    </div>
  );
};

