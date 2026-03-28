import List "mo:core/List";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Time "mo:core/Time";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type StudentId = Principal;
  type TeacherId = Principal;
  type ParentId = Principal;

  module Severity {
    public type Type = {
      #normal;
      #mild;
      #moderate;
      #severe;
      #extremelySevere;
    };
  };

  module ResourceCategory {
    public type Type = {
      #article;
      #book;
      #podcast;
      #activity;
    };
  };

  module ActivityType {
    public type Type = {
      #journaling;
      #word_association;
      #affirmation;
    };
  };

  type DASS21Subscale = {
    rawScore : Nat;
    severity : Severity.Type;
  };

  module DASS21Assessment {
    public type Type = {
      id : Nat;
      studentId : StudentId;
      timestamp : Time.Time;
      answers : [Nat];
      depression : DASS21Subscale;
      anxiety : DASS21Subscale;
      stress : DASS21Subscale;
    };
  };

  module SocialIsolation {
    public type Type = {
      answers : [Nat];
      proximityScore : Nat;
    };
  };

  module WellnessResource {
    public type Type = {
      id : Nat;
      title : Text;
      category : ResourceCategory.Type;
      description : Text;
      url : Text;
      tags : [Text];
    };
  };

  module LanguageActivity {
    public type Type = {
      id : Nat;
      title : Text;
      activityType : ActivityType.Type;
      prompt : Text;
      difficultyLevel : Nat;
    };
  };

  module ActivityResponse {
    public type Type = {
      id : Nat;
      activityId : Nat;
      studentId : StudentId;
      timestamp : Time.Time;
      response : Text;
    };
  };

  module UserRole {
    public type Type = {
      #student;
      #teacher;
      #parent;
    };
  };

  module UserProfile {
    public type Type = {
      name : Text;
      email : Text;
      role : UserRole.Type;
    };
  };

  public type Severity = Severity.Type;
  public type ResourceCategory = ResourceCategory.Type;
  public type ActivityType = ActivityType.Type;

  var nextAssessmentId = 1;
  var nextResourceId = 1;
  var nextActivityId = 1;

  let accessControlState = AccessControl.initState();
  let studentProfiles = Map.empty<StudentId, UserProfile.Type>();
  let teacherProfiles = Map.empty<TeacherId, UserProfile.Type>();
  let parentProfiles = Map.empty<ParentId, UserProfile.Type>();
  let assessments = Map.empty<Nat, DASS21Assessment.Type>();
  let resources = Map.empty<Nat, WellnessResource.Type>();
  let activities = Map.empty<Nat, LanguageActivity.Type>();
  let activityResponses = Map.empty<Nat, ActivityResponse.Type>();
  let studentLinks = Map.empty<StudentId, (TeacherId, ParentId)>();

  public type UserRole = UserRole.Type;
  public type DASS21Assessment = DASS21Assessment.Type;
  public type SocialIsolation = SocialIsolation.Type;
  public type WellnessResource = WellnessResource.Type;
  public type LanguageActivity = LanguageActivity.Type;
  public type ActivityResponse = ActivityResponse.Type;
  public type UserProfile = UserProfile.Type;

  include MixinAuthorization(accessControlState);

  public shared ({ caller }) func createStudentProfile(
    name : Text,
    email : Text
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };
    let profile = {
      name;
      email;
      role = #student;
    };
    studentProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createTeacherProfile(
    name : Text,
    email : Text
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };
    let profile = {
      name;
      email;
      role = #teacher;
    };
    teacherProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createParentProfile(
    name : Text,
    email : Text
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };
    let profile = {
      name;
      email;
      role = #parent;
    };
    parentProfiles.add(caller, profile);
  };

  public shared ({ caller }) func linkStudentToTeacherAndParent(
    teacherId : TeacherId,
    parentId : ParentId
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can link accounts");
    };
    // Verify caller is a student
    switch (studentProfiles.get(caller)) {
      case null {
        Runtime.trap("Unauthorized: Only students can link teachers and parents");
      };
      case (?_) {
        studentLinks.add(caller, (teacherId, parentId));
      };
    };
  };

  // Get all students linked to the calling teacher.
  // Returns array of (studentPrincipal, name, email).
  public query ({ caller }) func getTeacherStudents() : async [(Principal, Text, Text)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    let result = List.empty<(Principal, Text, Text)>();
    for ((studentId, (teacherId, _)) in studentLinks.entries()) {
      if (teacherId == caller) {
        switch (studentProfiles.get(studentId)) {
          case (?profile) {
            result.add((studentId, profile.name, profile.email));
          };
          case null {
            result.add((studentId, "", ""));
          };
        };
      };
    };
    result.toArray();
  };

  public shared ({ caller }) func createDASS21Assessment(
    answers : [Nat],
    socialIsolationAnswers : [Nat]
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create assessments");
    };
    // Verify caller is a student
    switch (studentProfiles.get(caller)) {
      case null {
        Runtime.trap("Unauthorized: Only students can create assessments");
      };
      case (?_) {};
    };

    if (answers.size() != 21) {
      Runtime.trap("DASS-21 requires 21 answers");
    };

    let depression = calculateSubscale(answers, [2, 4, 9, 12, 15, 16, 20]);
    let anxiety = calculateSubscale(answers, [1, 3, 6, 8, 14, 18, 19]);
    let stress = calculateSubscale(answers, [0, 5, 7, 10, 11, 13, 17]);

    if (socialIsolationAnswers.size() != 6) {
      Runtime.trap("Social Isolation requires 6 answers");
    };

    let assessmentId = nextAssessmentId;
    nextAssessmentId += 1;

    let _ = {
      answers;
      socialIsolationAnswers;
      assessmentId;
    };

    let assessment : DASS21Assessment = {
      id = assessmentId;
      studentId = caller;
      timestamp = Time.now();
      answers;
      depression;
      anxiety;
      stress;
    };

    assessments.add(assessmentId, assessment);

    assessmentId;
  };

  func calculateSubscale(answers : [Nat], itemIndices : [Nat]) : DASS21Subscale {
    var sum = 0;
    for (i in itemIndices.values()) {
      if (i >= answers.size()) {
        Runtime.trap("Invalid answer index");
      };
      sum += answers[i];
    };
    let severity = calculateSeverity(sum);
    {
      rawScore = sum;
      severity;
    };
  };

  func calculateSeverity(score : Nat) : Severity {
    switch (score) {
      case (0) { #normal };
      case (1) { #normal };
      case (2) { #normal };
      case (3) { #normal };
      case (4) { #normal };
      case (5) { #normal };
      case (6) { #normal };
      case (7) { #normal };
      case (8) { #mild };
      case (9) { #mild };
      case (10) { #mild };
      case (11) { #mild };
      case (12) { #mild };
      case (13) { #mild };
      case (14) { #moderate };
      case (15) { #moderate };
      case (16) { #moderate };
      case (17) { #moderate };
      case (18) { #moderate };
      case (19) { #moderate };
      case (20) { #moderate };
      case (21) { #severe };
      case (22) { #severe };
      case (23) { #severe };
      case (24) { #severe };
      case (25) { #severe };
      case (26) { #severe };
      case (27) { #severe };
      case (_) { #extremelySevere };
    };
  };

  public query ({ caller }) func getStudentAssessments(studentId : StudentId) : async [DASS21Assessment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view assessments");
    };

    // Students can view their own assessments
    if (caller == studentId) {
      switch (studentProfiles.get(caller)) {
        case null {
          Runtime.trap("Unauthorized: Caller is not a student");
        };
        case (?_) {};
      };
    } else {
      // Teachers and Parents can view assessments of their linked students
      var authorized = false;

      // Check if caller is a teacher linked to this student
      switch (teacherProfiles.get(caller)) {
        case (?_) {
          switch (studentLinks.get(studentId)) {
            case (?(teacherId, _)) {
              if (teacherId == caller) {
                authorized := true;
              };
            };
            case null {};
          };
        };
        case null {};
      };

      // Check if caller is a parent linked to this student
      if (not authorized) {
        switch (parentProfiles.get(caller)) {
          case (?_) {
            switch (studentLinks.get(studentId)) {
              case (?(_, parentId)) {
                if (parentId == caller) {
                  authorized := true;
                };
              };
              case null {};
            };
          };
          case null {};
        };
      };

      // Admin can view all assessments
      if (not authorized and not AccessControl.isAdmin(accessControlState, caller)) {
        Runtime.trap("Unauthorized: Can only view assessments for linked students");
      };
    };

    let assessmentList = List.empty<DASS21Assessment>();
    for ((_, assessment) in assessments.entries()) {
      if (assessment.studentId == studentId) {
        assessmentList.add(assessment);
      };
    };
    assessmentList.toArray();
  };

  module WellnessResourceModule {
    public func compareByTitle(resource1 : WellnessResource, resource2 : WellnessResource) : Order.Order {
      Text.compare(resource1.title, resource2.title);
    };
  };

  public shared ({ caller }) func addResource(
    title : Text,
    category : ResourceCategory,
    description : Text,
    url : Text,
    tags : [Text]
  ) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add resources");
    };

    let resourceId = nextResourceId;
    nextResourceId += 1;

    let newResource : WellnessResource = {
      id = resourceId;
      title;
      category;
      description;
      url;
      tags;
    };
    resources.add(resourceId, newResource);

    resourceId;
  };

  public query ({ caller }) func getAllResources() : async [WellnessResource] {
    // Anyone can read resources (including guests)
    resources.values().toArray().sort(WellnessResourceModule.compareByTitle);
  };

  public shared ({ caller }) func addLanguageActivity(
    title : Text,
    activityType : ActivityType,
    prompt : Text,
    difficultyLevel : Nat
  ) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add activities");
    };

    let id = nextActivityId;
    nextActivityId += 1;

    let activity : LanguageActivity = {
      id;
      title;
      activityType;
      prompt;
      difficultyLevel;
    };

    activities.add(id, activity);
    id;
  };

  public query ({ caller }) func getAllActivities() : async [LanguageActivity] {
    // Anyone can list activities (including guests)
    activities.values().toArray();
  };

  public shared ({ caller }) func submitActivityResponse(activityId : Nat, response : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit activity responses");
    };
    // Verify caller is a student
    switch (studentProfiles.get(caller)) {
      case null {
        Runtime.trap("Unauthorized: Only students can submit activity responses");
      };
      case (?_) {};
    };

    let responseId = activityResponses.size() + 1;

    let activityResponse : ActivityResponse = {
      id = responseId;
      activityId;
      studentId = caller;
      timestamp = Time.now();
      response;
    };

    activityResponses.add(responseId, activityResponse);
    responseId;
  };
};
