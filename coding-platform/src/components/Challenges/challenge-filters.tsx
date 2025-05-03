"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  setLanguage,
  setDifficulty,
  setPage,
  clearFilters,
} from "@/redux/features/challenges/challengesSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PROGRAMMING_LANGUAGES = [
  { id: 101, name: "TYPESCRIPT" },
  { id: 102, name: "PYTHON" },
  { id: 103, name: "C" },
  { id: 104, name: "JAVA" },
  { id: 105, name: "SQL" },
];

const DIFFICULTY_LEVELS = ["EASY", "MEDIUM", "HARD"];

export default function ChallengeFilters() {
  const dispatch = useDispatch<AppDispatch>();
  const { language, difficulty } = useSelector(
    (state: RootState) => state.challenges
  );

  const handleLanguageChange = (value: string) => {
    dispatch(setLanguage(value === "all" ? null : value));
    dispatch(setPage(1));
  };

  const handleDifficultyChange = (value: string) => {
    dispatch(setDifficulty(value === "all" ? null : value.toUpperCase()));
    dispatch(setPage(1));
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="w-full sm:w-1/3">
        <Select value={language || "all"} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Programming Language" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">Programming Language</SelectItem>
            {PROGRAMMING_LANGUAGES.map((lang) => (
              <SelectItem key={lang.id} value={lang.id.toString()}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:w-1/3">
        <Select
          value={difficulty || "all"}
          onValueChange={handleDifficultyChange}
        >
          <SelectTrigger className="w-full ">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">Difficulty</SelectItem>
            {DIFFICULTY_LEVELS.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
