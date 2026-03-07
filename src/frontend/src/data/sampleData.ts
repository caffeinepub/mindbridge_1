import { ActivityType, Type__1 } from "../backend.d";
import type { LanguageActivity, WellnessResource } from "../backend.d";

// Sample wellness resources shown when backend returns empty
export const SAMPLE_RESOURCES: WellnessResource[] = [
  {
    id: BigInt(1),
    title: "The Anxiety and Phobia Workbook",
    description:
      "A comprehensive, evidence-based guide with practical techniques for overcoming anxiety, panic, and worry. Includes breathing exercises, cognitive restructuring, and exposure strategies.",
    url: "https://www.newharbinger.com/9781684034833/the-anxiety-and-phobia-workbook/",
    category: Type__1.book,
    tags: ["anxiety", "CBT", "self-help", "workbook"],
  },
  {
    id: BigInt(2),
    title: "Lost Connections: Uncovering the Real Causes of Depression",
    description:
      "Johann Hari's landmark exploration of the social and psychological roots of depression and anxiety, offering a hopeful path forward focused on reconnection and meaning.",
    url: "https://www.amazon.com/Lost-Connections-Uncovering-Real-Causes/dp/163286830X",
    category: Type__1.book,
    tags: ["depression", "social isolation", "belonging", "research"],
  },
  {
    id: BigInt(3),
    title: "The Mindful Student: Stress-Free Learning Techniques",
    description:
      "Evidence-based mindfulness practices designed specifically for students facing academic pressure. Includes meditation scripts, focus techniques, and emotional regulation tools.",
    url: "https://www.mindful.org/meditation/mindfulness-getting-started/",
    category: Type__1.article,
    tags: ["mindfulness", "students", "stress", "focus"],
  },
  {
    id: BigInt(4),
    title: "Understanding the Teenage Brain Under Stress",
    description:
      "A research-backed article explaining how adolescent brains respond to stress differently, and what strategies help teenagers build emotional resilience during formative years.",
    url: "https://www.apa.org/topics/stress/teens",
    category: Type__1.article,
    tags: ["teenagers", "brain", "stress", "resilience"],
  },
  {
    id: BigInt(5),
    title: "The Happiness Lab with Dr. Laurie Santos",
    description:
      "Yale professor Dr. Laurie Santos explores surprising science behind happiness and the common misconceptions that lead us astray. Practical insights for building a genuinely fulfilling life.",
    url: "https://www.happinesslab.fm/",
    category: Type__1.podcast,
    tags: ["happiness", "psychology", "science", "wellbeing"],
  },
  {
    id: BigInt(6),
    title: "Therapy in a Nutshell",
    description:
      "Emma McAdam, a licensed therapist, shares straightforward mental health tools, therapy techniques, and coping skills in accessible, engaging episodes for people of all ages.",
    url: "https://therapyinanutshell.com/podcast/",
    category: Type__1.podcast,
    tags: ["therapy", "CBT", "coping skills", "anxiety"],
  },
  {
    id: BigInt(7),
    title: "4-7-8 Breathing: The Calming Breath Exercise",
    description:
      "Learn the evidence-based 4-7-8 breathing technique developed by Dr. Andrew Weil. This simple activity activates the parasympathetic nervous system, reducing stress in minutes.",
    url: "https://www.drweil.com/health-wellness/body-mind-spirit/stress-anxiety/breathing-three-exercises/",
    category: Type__1.activity,
    tags: ["breathing", "relaxation", "quick relief", "nervous system"],
  },
  {
    id: BigInt(8),
    title: "Progressive Muscle Relaxation for Students",
    description:
      "A guided activity that systematically tenses and relaxes muscle groups, releasing physical tension stored from academic stress. Takes only 15 minutes and can be done anywhere.",
    url: "https://www.anxietycanada.com/articles/how-to-do-progressive-muscle-relaxation/",
    category: Type__1.activity,
    tags: ["relaxation", "body scan", "tension relief", "stress"],
  },
];

// ActivityType string values matching the backend enum
const AT = ActivityType;

// Sample language activities shown when backend returns empty
// Cast activityType using 'unknown' since Type__2 is not re-exported from backend.d.ts
export const SAMPLE_ACTIVITIES = [
  {
    id: BigInt(1),
    title: "Morning Gratitude Journal",
    activityType: AT.journaling as unknown,
    prompt:
      "Write about three things you are grateful for today. They can be as small as a warm cup of tea or as significant as a kind friend. For each one, describe why it matters to you and how it makes you feel. Don't rush — let your thoughts flow naturally.",
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(2),
    title: "Emotions Word Map",
    activityType: AT.word_association as unknown,
    prompt:
      "Start with the word 'peaceful'. Write down every word, image, or memory that comes to mind when you think of it. Don't filter — write whatever arises. Then circle the three words that feel most meaningful to you right now.",
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(3),
    title: "Daily Strength Affirmation",
    activityType: AT.affirmation as unknown,
    prompt:
      "Repeat aloud (or write) this affirmation three times, then add your own personal version: 'I am resilient. Every challenge I face teaches me something valuable. I have the strength to navigate this moment, and I am not alone.'",
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(4),
    title: "Reframing Difficult Moments",
    activityType: AT.journaling as unknown,
    prompt:
      "Think of a stressful situation you experienced recently. Describe it briefly. Now rewrite the story from the perspective of a future version of yourself who has grown through this experience. What did they learn? What strength did it reveal?",
    difficultyLevel: BigInt(2),
  },
  {
    id: BigInt(5),
    title: "Connection Word Weaving",
    activityType: AT.word_association as unknown,
    prompt:
      "Write the word 'belonging'. List 10 words that come to mind. Now choose two of those words and write a sentence connecting them to a real memory of feeling understood or accepted by someone.",
    difficultyLevel: BigInt(2),
  },
  {
    id: BigInt(6),
    title: "Self-Compassion Affirmation",
    activityType: AT.affirmation as unknown,
    prompt:
      "Place your hand on your heart. Read this slowly: 'I am doing my best. Struggling doesn't mean failing. I deserve kindness — especially from myself. I am worthy of care and connection.' Write how this makes you feel.",
    difficultyLevel: BigInt(1),
  },
] as LanguageActivity[];
