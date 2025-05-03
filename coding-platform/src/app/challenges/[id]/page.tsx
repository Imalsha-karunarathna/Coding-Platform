"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, UserCircle2Icon } from "lucide-react";
import { fetchChallengeById } from "@/redux/features/challenges/challengesSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import QuestionCard from "@/components/Challenges/question-card";
import QuestionModal from "@/components/Challenges/question-modal";
import ProgressBar from "@/components/Challenges/progress-bar";
import type { Question } from "@/types";

export default function ChallengePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedChallenge, loading, error, completionState } = useSelector(
    (state: RootState) => state.challenges
  );

  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchChallengeById(id));
    }
  }, [dispatch, id]);

  const getCompletedQuestions = () => {
    if (!selectedChallenge?.questions) return 0;

    return selectedChallenge.questions.filter(
      (question) => completionState[question.id]?.completed
    ).length;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toUpperCase()) {
      case "EASY":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "HARD":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const handleStartQuestion = (questionId: string) => {
    if (!selectedChallenge?.questions) return;

    const question = selectedChallenge.questions.find(
      (q) => q.id === questionId
    );
    if (question) {
      setActiveQuestion(question);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActiveQuestion(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => router.push("/challenges")}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Challenges
          </Button>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <UserCircle2Icon size={24} className="text-gray-700" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : !selectedChallenge ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Challenge not found.</p>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">
                  {selectedChallenge.title}
                </h1>
                <Badge
                  variant="outline"
                  className={getDifficultyColor(selectedChallenge.difficulty)}
                >
                  {selectedChallenge.difficulty}
                </Badge>
              </div>
              {selectedChallenge.description && (
                <p className="mt-2 text-gray-600">
                  {selectedChallenge.description}
                </p>
              )}
            </div>

            {selectedChallenge.questions &&
              selectedChallenge.questions.length > 0 && (
                <>
                  <ProgressBar
                    completed={getCompletedQuestions()}
                    total={selectedChallenge.questions.length}
                  />

                  <div className="space-y-4">
                    {selectedChallenge.questions.map(
                      (question: Question, index: number) => (
                        <QuestionCard
                          key={question.id}
                          question={question}
                          index={index}
                          onStartQuestion={handleStartQuestion}
                        />
                      )
                    )}
                  </div>
                </>
              )}
          </div>
        )}
      </main>

      {activeQuestion && (
        <QuestionModal
          question={activeQuestion}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
