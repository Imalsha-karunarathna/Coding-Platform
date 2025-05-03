"use client";

import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { markQuestionCompleted } from "@/redux/features/challenges/challengesSlice";
import type { AppDispatch } from "@/redux/store";
import type { Question } from "@/types";
import { toast } from "sonner";

interface QuestionModalProps {
  question: Question;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuestionModal({
  question,
  isOpen,
  onClose,
}: QuestionModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    if (isOpen) {
      setStartTime(Date.now());
      setSelectedOption(null);
      setTimeSpent(0);

      timerRef.current = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isOpen]);

  const handleSubmit = () => {
    if (!selectedOption) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    dispatch(
      markQuestionCompleted({
        questionId: question.id,
        timeSpent,
        selectedAnswer: selectedOption,
      })
    );
    toast.success("Question Completed!", {
      description: `Time spent: ${formatTime(timeSpent)}`,
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <div className="flex justify-between items-right">
            <div className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
              {formatTime(timeSpent)}
            </div>
          </div>
          <DialogTitle className="text-left mt-2">{question.title}</DialogTitle>
        </DialogHeader>

        <RadioGroup
          value={selectedOption || ""}
          onValueChange={setSelectedOption}
          className="mt-4 space-y-3"
        >
          {question.options?.map((option) => (
            <div
              key={option.id}
              className="flex items-center space-x-2  p-3 hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedOption(option.id)}
            >
              <RadioGroupItem value={option.id} id={`option-${option.id}`} />
              <Label
                htmlFor={`option-${option.id}`}
                className="flex-1 cursor-pointer "
              >
                {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <DialogFooter className="mt-6">
          <Button
            onClick={handleSubmit}
            disabled={!selectedOption}
            className="w-fit bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
