import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export type StudentId = Principal;
export type ParentId = Principal;
export type TeacherId = Principal;
export interface DASS21Assessment {
    id: bigint;
    stress: DASS21Subscale;
    anxiety: DASS21Subscale;
    studentId: StudentId;
    answers: Array<bigint>;
    timestamp: Time;
    depression: DASS21Subscale;
}
export interface LanguageActivity {
    id: bigint;
    difficultyLevel: bigint;
    title: string;
    activityType: Type__2;
    prompt: string;
}
export interface DASS21Subscale {
    severity: Type;
    rawScore: bigint;
}
export interface WellnessResource {
    id: bigint;
    url: string;
    title: string;
    tags: Array<string>;
    description: string;
    category: Type__1;
}
export enum ActivityType {
    affirmation = "affirmation",
    word_association = "word_association",
    journaling = "journaling"
}
export enum Type {
    normal = "normal",
    mild = "mild",
    extremelySevere = "extremelySevere",
    severe = "severe",
    moderate = "moderate"
}
export enum Type__1 {
    book = "book",
    article = "article",
    podcast = "podcast",
    activity = "activity"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addLanguageActivity(title: string, activityType: ActivityType, prompt: string, difficultyLevel: bigint): Promise<bigint>;
    addResource(title: string, category: ResourceCategory, description: string, url: string, tags: Array<string>): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createDASS21Assessment(answers: Array<bigint>, socialIsolationAnswers: Array<bigint>): Promise<bigint>;
    createParentProfile(name: string, email: string): Promise<void>;
    createStudentProfile(name: string, email: string): Promise<void>;
    createTeacherProfile(name: string, email: string): Promise<void>;
    getAllActivities(): Promise<Array<LanguageActivity>>;
    getAllResources(): Promise<Array<WellnessResource>>;
    getCallerUserRole(): Promise<UserRole>;
    getStudentAssessments(studentId: StudentId): Promise<Array<DASS21Assessment>>;
    isCallerAdmin(): Promise<boolean>;
    linkStudentToTeacherAndParent(teacherId: TeacherId, parentId: ParentId): Promise<void>;
    submitActivityResponse(activityId: bigint, response: string): Promise<bigint>;
}
