import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const TARGET_ROLES = [
  "Software Engineer",
  "Full Stack",
  "Frontend",
  "Backend",
  "DevOps",
  "Data Analyst",
  "Data Scientist",
] as const;

export type TargetRole = (typeof TARGET_ROLES)[number];

export interface StudentDetails {
  fullName: string;
  collegeName: string;
  targetRole: TargetRole | "";
}

export interface ResumeExperience {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ResumeEducation {
  degree: string;
  institution: string;
  graduationYear: string;
}

export interface ResumeAnalysis {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  experience: ResumeExperience[];
  education: ResumeEducation[];
  certifications: string[];
}

export type UploadStatus = "idle" | "uploading" | "ready";

export interface UploadState {
  file: File | null;
  status: UploadStatus;
  progress: number;
}

const DETAILS_STORAGE_KEY = "skillsync:student-details";
const ANALYSIS_STORAGE_KEY = "skillsync:resume-analysis";

const DEFAULT_DETAILS: StudentDetails = {
  fullName: "",
  collegeName: "",
  targetRole: "",
};

const DEFAULT_UPLOAD: UploadState = {
  file: null,
  status: "idle",
  progress: 0,
};

const DEFAULT_ANALYSIS: ResumeAnalysis | null = null;

function loadStoredDetails(): StudentDetails {
  if (typeof window === "undefined") return DEFAULT_DETAILS;
  try {
    const raw = sessionStorage.getItem(DETAILS_STORAGE_KEY);
    if (!raw) return DEFAULT_DETAILS;
    const parsed = JSON.parse(raw) as Partial<StudentDetails>;
    return { ...DEFAULT_DETAILS, ...parsed };
  } catch {
    return DEFAULT_DETAILS;
  }
}

function loadStoredAnalysis(): ResumeAnalysis | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(ANALYSIS_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ResumeAnalysis;
  } catch {
    return null;
  }
}

interface StudentContextValue {
  details: StudentDetails;
  setDetails: (next: Partial<StudentDetails>) => void;
  upload: UploadState;
  setUpload: (
    next: Partial<UploadState> | ((prev: UploadState) => Partial<UploadState>),
  ) => void;
  analysis: ResumeAnalysis | null;
  setAnalysis: (next: ResumeAnalysis | null) => void;
  clearUpload: () => void;
  reset: () => void;
}

const StudentContext = createContext<StudentContextValue | undefined>(undefined);

export function StudentProvider({ children }: { children: ReactNode }) {
  const [details, setDetailsState] = useState<StudentDetails>(loadStoredDetails);
  const [upload, setUploadState] = useState<UploadState>(DEFAULT_UPLOAD);
  const [analysis, setAnalysisState] = useState<ResumeAnalysis | null>(
    loadStoredAnalysis,
  );

  useEffect(() => {
    sessionStorage.setItem(DETAILS_STORAGE_KEY, JSON.stringify(details));
  }, [details]);

  useEffect(() => {
    if (analysis) {
      sessionStorage.setItem(ANALYSIS_STORAGE_KEY, JSON.stringify(analysis));
    } else {
      sessionStorage.removeItem(ANALYSIS_STORAGE_KEY);
    }
  }, [analysis]);

  const setDetails = useCallback(
    (next: Partial<StudentDetails>) =>
      setDetailsState((prev) => ({ ...prev, ...next })),
    [],
  );

  const setUpload = useCallback(
    (
      next:
        | Partial<UploadState>
        | ((prev: UploadState) => Partial<UploadState>),
    ) =>
      setUploadState((prev) => ({
        ...prev,
        ...(typeof next === "function" ? next(prev) : next),
      })),
    [],
  );

  const setAnalysis = useCallback(
    (next: ResumeAnalysis | null) => setAnalysisState(next),
    [],
  );

  const clearUpload = useCallback(() => setUploadState(DEFAULT_UPLOAD), []);

  const reset = useCallback(() => {
    setDetailsState(DEFAULT_DETAILS);
    setUploadState(DEFAULT_UPLOAD);
    sessionStorage.removeItem(DETAILS_STORAGE_KEY);
  }, []);

  const value = useMemo<StudentContextValue>(
    () => ({
      details,
      setDetails,
      upload,
      setUpload,
      analysis,
      setAnalysis,
      clearUpload,
      reset,
    }),
    [details, setDetails, upload, setUpload, analysis, setAnalysis, clearUpload, reset],
  );

  return (
    <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
  );
}

export function useStudent() {
  const ctx = useContext(StudentContext);
  if (!ctx) {
    throw new Error("useStudent must be used within a StudentProvider");
  }
  return ctx;
}
