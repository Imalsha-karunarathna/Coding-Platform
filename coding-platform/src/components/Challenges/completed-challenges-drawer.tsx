import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Challenge, CompletionState } from "@/types";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";

interface CompletedChallengesModalProps {
  challenges: Challenge[];
  completionState: CompletionState;
  onClose: () => void;
}

const CompletedChallengesModal: React.FC<CompletedChallengesModalProps> = ({
  challenges,
  completionState,
  onClose,
}) => {
  const getTotalTime = (challenge: Challenge) => {
    return (
      challenge.questions?.reduce((sum, q) => {
        return sum + (completionState[q.id]?.timeSpent || 0);
      }, 0) || 0
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="fixed flex justify-center items-center p-4 top-60 right-0 bg-white rounded-md shadow-lg">
        <DialogTitle></DialogTitle>
        <div className="w-full max-w-lg bg-white p-6 rounded-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Completed Challenges</h2>
          </div>

          {challenges.length === 0 ? (
            <p>No completed challenges found.</p>
          ) : (
            <ul className="space-y-4">
              {challenges.map((challenge) => {
                const timeSpent = getTotalTime(challenge);
                return (
                  <li
                    key={challenge.id}
                    className="flex justify-between items-center p-4 border-2 rounded-md"
                  >
                    <div>
                      <h3 className="font-semibold">{challenge.title}</h3>
                      <p className="text-sm text-gray-500">
                        Difficulty: {challenge.difficulty}
                      </p>
                    </div>
                    <div className="text-sm text-gray-700 bg-blue-500 p-1 rounded">
                      <span> {Math.round(timeSpent)} s</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompletedChallengesModal;
