import type { Challenge } from "@/types";
import ChallengeCard from "./challenge-card";

interface ChallengeListProps {
  challenges: Challenge[] | undefined | null;
  completionState: Record<string, { completed: boolean }>;
}

export default function ChallengeList({
  challenges,
  completionState,
}: ChallengeListProps) {
  if (!Array.isArray(challenges) || challenges.length === 0) {
    return <p className="text-muted-foreground">No challenges found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {challenges.map((challenge) => (
        <ChallengeCard
          key={challenge.id}
          challenge={challenge}
          completionState={completionState}
        />
      ))}
    </div>
  );
}
