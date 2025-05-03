import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { Challenge } from "@/types";

interface ChallengeCardProps {
  challenge: Challenge;
  completionState: Record<string, { completed: boolean }>;
}

export default function ChallengeCard({
  challenge,
  completionState,
}: ChallengeCardProps) {
  const isCompleted = challenge.questions?.every(
    (q) => completionState[q.id]?.completed
  );
  return (
    <Card className="h-full flex flex-col border-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg uppercase font-bold">
          {challenge.title}
        </CardTitle>
        <p className="text-sm text-gray-500">({challenge.difficulty})</p>
      </CardHeader>
      <CardContent className="flex-grow"></CardContent>
      <CardFooter className="pt-2">
        <Link href={`/challenges/${challenge.id}`} passHref className="w-full">
          <Button
            variant={isCompleted ? "default" : "outline"}
            className={`w-full flex items-center justify-center gap-2 hover:bg-purple-50 cursor-pointer ${
              isCompleted ? "bg-green-600 text-white hover:bg-green-700" : ""
            }`}
          >
            {isCompleted ? "Completed" : "Get Start"} <ArrowRight size={16} />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
