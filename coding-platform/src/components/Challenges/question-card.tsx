"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { markQuestionCompleted } from "@/redux/features/challenges/challengesSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import type { Question } from "@/types";

interface QuestionCardProps {
  question: Question;
  index: number;
  onStartQuestion: (questionId: string) => void;
}

export default function QuestionCard({
  question,
  index,
  onStartQuestion,
}: QuestionCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { completionState } = useSelector(
    (state: RootState) => state.challenges
  );

  const questionStatus = completionState[question.id] || {
    completed: false,
    timeSpent: 0,
  };
  const [isActive, setIsActive] = useState(false);
  const [timeSpent, setTimeSpent] = useState(questionStatus.timeSpent || 0);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      setStartTime(Date.now() - timeSpent * 1000);
      interval = setInterval(() => {
        if (startTime) {
          const newTimeSpent = Math.floor((Date.now() - startTime) / 1000);
          setTimeSpent(newTimeSpent);
        }
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, startTime]);

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const handleStart = () => {
    setIsActive(true);
    onStartQuestion(question.id);
  };

  const handleComplete = () => {
    setIsActive(false);
    dispatch(
      markQuestionCompleted({
        questionId: question.id,
        timeSpent,
      })
    );
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-medium">
              {index + 1}. {question.title}
            </h3>
            {question.description && (
              <p className="text-sm text-gray-500 mt-1">
                {question.description}
              </p>
            )}
          </div>

          {questionStatus.completed && (
            <div className="flex items-center text-green-600 ml-4">
              <CheckCircle className="h-5 w-5 mr-1" />
              <span className="text-sm">Completed</span>
            </div>
          )}
        </div>

        {(isActive || questionStatus.completed) && (
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>{formatTime(timeSpent)}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-end pt-0">
        {!questionStatus.completed ? (
          isActive ? (
            <Button
              onClick={handleComplete}
              variant="default"
              className="bg-green-600 hover:bg-green-700"
            >
              Complete
            </Button>
          ) : (
            <Button onClick={handleStart} variant="outline">
              Start
            </Button>
          )
        ) : (
          <Button variant="outline" disabled className="opacity-50">
            Completed
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
