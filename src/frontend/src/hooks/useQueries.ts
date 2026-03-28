import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  DASS21Assessment,
  LanguageActivity,
  WellnessResource,
} from "../backend.d";
import { useActor } from "./useActor";

// Get all wellness resources
export function useGetAllResources() {
  const { actor, isFetching } = useActor();
  return useQuery<WellnessResource[]>({
    queryKey: ["resources"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllResources();
    },
    enabled: !!actor && !isFetching,
  });
}

// Get all language activities
export function useGetAllActivities() {
  const { actor, isFetching } = useActor();
  return useQuery<LanguageActivity[]>({
    queryKey: ["activities"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllActivities();
    },
    enabled: !!actor && !isFetching,
  });
}

// Get student assessments
export function useGetStudentAssessments(studentId: Principal | null) {
  const { actor, isFetching } = useActor();
  return useQuery<DASS21Assessment[]>({
    queryKey: ["studentAssessments", studentId?.toString()],
    queryFn: async () => {
      if (!actor || !studentId) return [];
      return actor.getStudentAssessments(studentId);
    },
    enabled: !!actor && !isFetching && !!studentId,
  });
}

// Submit activity response
export function useSubmitActivityResponse() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      activityId,
      response,
    }: { activityId: bigint; response: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitActivityResponse(activityId, response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });
}

// Create DASS21 assessment
export function useCreateAssessment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      answers,
      socialIsolationAnswers,
    }: {
      answers: bigint[];
      socialIsolationAnswers: bigint[];
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createDASS21Assessment(answers, socialIsolationAnswers);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studentAssessments"] });
    },
  });
}

// Create student profile
export function useCreateStudentProfile() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({ name, email }: { name: string; email: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createStudentProfile(name, email);
    },
  });
}

// Create teacher profile
export function useCreateTeacherProfile() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({ name, email }: { name: string; email: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createTeacherProfile(name, email);
    },
  });
}

// Create parent profile
export function useCreateParentProfile() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({ name, email }: { name: string; email: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createParentProfile(name, email);
    },
  });
}

// Link student to teacher and parent
export function useLinkGuardian() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      teacherId,
      parentId,
    }: {
      teacherId: Principal;
      parentId: Principal;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.linkStudentToTeacherAndParent(teacherId, parentId);
    },
  });
}

// Get all students linked to calling teacher
export function useGetTeacherStudents() {
  const { actor, isFetching } = useActor();
  return useQuery<
    Array<[import("@icp-sdk/core/principal").Principal, string, string]>
  >({
    queryKey: ["teacherStudents"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getTeacherStudents();
    },
    enabled: !!actor && !isFetching,
  });
}
