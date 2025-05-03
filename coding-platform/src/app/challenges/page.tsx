"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchChallenges } from "@/redux/features/challenges/challengesSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import ChallengeFilters from "@/components/Challenges/challenge-filters";
import ChallengeList from "@/components/Challenges/challenge-list";
import Pagination from "@/components/Challenges/pagination";
import { UserCircle2Icon } from "lucide-react";
import CompletedChallengesModal from "@/components/Challenges/completed-challenges-drawer";

export default function ChallengesPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const {
    challenges,
    loading,
    error,
    page,
    limit,
    totalPages,
    language,
    difficulty,
    completionState,
  } = useSelector((state: RootState) => state.challenges);

  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !isAuthenticated &&
      !localStorage.getItem("token")
    ) {
      router.push("/login");
      return;
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    dispatch(fetchChallenges({ page, limit, language, difficulty }));
  }, [dispatch, page, limit, language, difficulty]);

  console.log("Current challenges state:", {
    challenges,
    loading,
    error,
    totalPages,
  });
  const getCompletedChallengesCount = () => {
    if (!Array.isArray(challenges)) return 0;
    return challenges.filter((challenge) =>
      challenge.questions?.every((q) => completionState[q.id]?.completed)
    ).length;
  };

  const getCompletedChallenges = () => {
    return challenges.filter((challenge) =>
      challenge.questions?.every((q) => completionState[q.id]?.completed)
    );
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="absolute top-4 right-4 flex items-center space-x-4">
            <div className="relative group">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded-md z-10 whitespace-nowrap">
                Completed Challenges count
                <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black" />
              </div>
              <div
                className="w-10 h-6 flex items-center justify-center font-bold text-sm border border-black text-black bg-white"
                style={{
                  clipPath:
                    "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                }}
                onClick={() => setIsModalOpen(true)}
              >
                {getCompletedChallengesCount()}
              </div>
            </div>
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
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <ChallengeFilters />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : !challenges || challenges.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No challenges found matching your filters.
            </p>
          </div>
        ) : (
          <>
            <ChallengeList
              challenges={challenges}
              completionState={completionState}
            />
            <Pagination currentPage={page} totalPages={totalPages} />
          </>
        )}
      </main>
      {isModalOpen && (
        <CompletedChallengesModal
          challenges={getCompletedChallenges()}
          onClose={() => setIsModalOpen(false)}
          completionState={completionState}
        />
      )}
    </div>
  );
}
