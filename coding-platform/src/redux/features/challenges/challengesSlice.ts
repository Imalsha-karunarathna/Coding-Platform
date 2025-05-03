import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Challenge, CompletionState } from "@/types";

interface ChallengesState {
  challenges: Challenge[];
  selectedChallenge: Challenge | null;
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  totalPages: number;
  language: string | null;
  difficulty: string | null;
  completionState: CompletionState;
}

interface FetchChallengesParams {
  page: number;
  limit: number;
  language?: string | null;
  difficulty?: string | null;
}

const loadCompletionState = (): CompletionState => {
  if (typeof window === "undefined") return {};

  const savedState = localStorage.getItem("challengeCompletionState");
  return savedState ? JSON.parse(savedState) : {};
};

const saveCompletionState = (state: CompletionState) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("challengeCompletionState", JSON.stringify(state));
  }
};

const mapApiChallenge = (apiChallenge: any): Challenge => {
  return {
    id: apiChallenge.id.toString(),
    title: apiChallenge.challenge,
    difficulty: apiChallenge.level,
    language: apiChallenge.language?.name,
    questions:
      apiChallenge.questions?.map((q: any, index: number) => ({
        id: `q${apiChallenge.id}_${index + 1}`,
        title: q.question || `Question ${index + 1}`,
        description: q.description || "",
        options: [
          { id: "a", text: q.options?.a || "TypeScript replaces JavaScript." },
          {
            id: "b",
            text:
              q.options?.b ||
              "TypeScript extends JavaScript with static typing.",
          },
          { id: "c", text: q.options?.c || "TypeScript replaces JavaScript." },
          { id: "d", text: q.options?.d || "TypeScript replaces JavaScript." },
        ],
        correctAnswer: q.answer || "b",
      })) || [],
  };
};

export const fetchChallenges = createAsyncThunk<
  { challenges: Challenge[]; totalPages: number },
  FetchChallengesParams
>(
  "challenges/fetchChallenges",
  async ({ page, limit, language, difficulty }, { rejectWithValue }) => {
    try {
      let url = `https://2hol1zaqsj.execute-api.us-east-1.amazonaws.com/dev/challenges?page=${page}&limit=${limit}`;

      if (language) {
        url += `&language=${language}`;
      }

      if (difficulty) {
        url += `&difficulty=${difficulty}`;
      }

      console.log("Fetching challenges from:", url);
      const response = await fetch(url);

      if (!response.ok) {
        return rejectWithValue("Failed to fetch challenges");
      }

      const responseData = await response.json();
      console.log("API response:", responseData);

      const apiChallenges = responseData.data || [];

      const challenges = apiChallenges.map(mapApiChallenge);

      const totalPages = responseData.pagination?.pages || 1;

      return {
        challenges,
        totalPages,
      };
    } catch (error) {
      console.error("Error fetching challenges:", error);
      return rejectWithValue("An error occurred while fetching challenges");
    }
  }
);

export const fetchChallengeById = createAsyncThunk<Challenge, string>(
  "challenges/fetchChallengeById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://2hol1zaqsj.execute-api.us-east-1.amazonaws.com/dev/challenges?id=${id}`
      );

      if (!response.ok) {
        return rejectWithValue("Failed to fetch challenge");
      }

      const responseData = await response.json();
      console.log("Challenge by ID response:", responseData);

      const apiChallenge = Array.isArray(responseData.data)
        ? responseData.data[0]
        : responseData.data;

      if (!apiChallenge) {
        return rejectWithValue("Challenge not found");
      }

      const challenge = mapApiChallenge(apiChallenge);

      return challenge;
    } catch (error) {
      return rejectWithValue("An error occurred while fetching the challenge");
    }
  }
);

const initialState: ChallengesState = {
  challenges: [],
  selectedChallenge: null,
  loading: false,
  error: null,
  page: 1,
  limit: 6,
  totalPages: 1,
  language: null,
  difficulty: null,
  completionState: loadCompletionState(),
};

const challengesSlice = createSlice({
  name: "challenges",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
      state.page = 1;
    },
    setLanguage: (state, action: PayloadAction<string | null>) => {
      state.language = action.payload;
      state.page = 1;
    },
    setDifficulty: (state, action: PayloadAction<string | null>) => {
      state.difficulty = action.payload;
      state.page = 1;
    },
    clearFilters: (state) => {
      state.language = null;
      state.difficulty = null;
      state.page = 1;
    },
    markQuestionCompleted: (
      state,
      action: PayloadAction<{
        questionId: string;
        timeSpent: number;
        selectedAnswer?: string;
      }>
    ) => {
      const { questionId, timeSpent, selectedAnswer } = action.payload;
      state.completionState[questionId] = {
        completed: true,
        timeSpent,
        selectedAnswer,
      };

      saveCompletionState(state.completionState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChallenges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChallenges.fulfilled, (state, action) => {
        state.challenges = action.payload.challenges;
        state.totalPages = action.payload.totalPages;
        state.loading = false;
      })
      .addCase(fetchChallenges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.challenges = [];
      })
      .addCase(fetchChallengeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChallengeById.fulfilled, (state, action) => {
        state.selectedChallenge = action.payload;
        state.loading = false;
      })
      .addCase(fetchChallengeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setPage,
  setLimit,
  setLanguage,
  setDifficulty,
  clearFilters,
  markQuestionCompleted,
} = challengesSlice.actions;
export default challengesSlice.reducer;
