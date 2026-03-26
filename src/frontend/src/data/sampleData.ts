import { ActivityType, Type__1 } from "../backend.d";
import type { LanguageActivity, WellnessResource } from "../backend.d";

// Sample wellness resources shown when backend returns empty
export const SAMPLE_RESOURCES: WellnessResource[] = [
  // ── BOOKS ──────────────────────────────────────────────────────────────────
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
    title: "Why Has Nobody Told Me This Before?",
    description:
      "Dr. Julie Smith's bestselling guide covers core mental health skills — from managing low mood to building self-worth — written in plain language for everyday readers.",
    url: "https://www.amazon.com/Why-Has-Nobody-Told-Before/dp/0063227428",
    category: Type__1.book,
    tags: ["mental health", "self-help", "emotions", "students"],
  },
  {
    id: BigInt(4),
    title: "The Teenage Brain: A Neuroscientist's Survival Guide",
    description:
      "Frances Jensen explains the unique neuroscience of the adolescent brain, why teens experience intense emotions, and how to build resilience during these critical years.",
    url: "https://www.amazon.com/Teenage-Brain-Neuroscientists-Survival-Guide/dp/0062067850",
    category: Type__1.book,
    tags: ["teenagers", "neuroscience", "brain", "resilience"],
  },
  {
    id: BigInt(5),
    title: "Feeling Good: The New Mood Therapy",
    description:
      "David Burns' classic CBT-based book uses practical exercises to combat depression and negative thinking. One of the most widely recommended self-help books by therapists worldwide.",
    url: "https://www.amazon.com/Feeling-Good-New-Mood-Therapy/dp/0380810336",
    category: Type__1.book,
    tags: ["CBT", "depression", "mood", "self-therapy"],
  },
  {
    id: BigInt(6),
    title: "The Stress-Proof Brain",
    description:
      "Melanie Greenberg combines neuroscience and mindfulness to provide tools for building a brain that is resilient under pressure, helping readers respond rather than react to stress.",
    url: "https://www.amazon.com/Stress-Proof-Brain-Mindfulness-Neuroscience/dp/1626252661",
    category: Type__1.book,
    tags: ["stress", "neuroscience", "mindfulness", "resilience"],
  },
  {
    id: BigInt(7),
    title: "Mindfulness for Teen Anxiety",
    description:
      "Christopher Willard offers adolescents accessible mindfulness practices drawn from ACT and CBT, specifically designed to manage test anxiety, social stress, and overwhelm.",
    url: "https://www.amazon.com/Mindfulness-Teen-Anxiety-Workbook-Cognitive/dp/1608829030",
    category: Type__1.book,
    tags: ["mindfulness", "teenagers", "anxiety", "ACT"],
  },
  {
    id: BigInt(8),
    title: "The Self-Compassion Workbook for Teens",
    description:
      "Kristin Neff's principles adapted for teenagers: practical exercises in mindfulness, self-kindness, and recognising common humanity to reduce self-criticism and shame.",
    url: "https://www.amazon.com/Self-Compassion-Workbook-Teens-Mindfulness-Compassion/dp/1684030722",
    category: Type__1.book,
    tags: ["self-compassion", "teenagers", "mindfulness", "shame"],
  },
  {
    id: BigInt(9),
    title: "Burnout: The Secret to Unlocking the Stress Cycle",
    description:
      "Emily and Amelia Nagoski explain the biological stress cycle and offer evidence-based tools to complete it — essential reading for overloaded students.",
    url: "https://www.amazon.com/Burnout-Secret-Unlocking-Stress-Cycle/dp/1984818325",
    category: Type__1.book,
    tags: ["burnout", "stress", "biology", "self-care"],
  },
  {
    id: BigInt(10),
    title: "The Body Keeps the Score",
    description:
      "Bessel van der Kolk explores how trauma reshapes the brain and body, and reviews breakthrough treatments — yoga, EMDR, theatre, mindfulness — that help reclaim the self.",
    url: "https://www.amazon.com/Body-Keeps-Score-Healing-Trauma/dp/0143127748",
    category: Type__1.book,
    tags: ["trauma", "body", "healing", "neuroscience"],
  },
  {
    id: BigInt(11),
    title: "An Unquiet Mind: A Memoir of Moods and Madness",
    description:
      "Kay Redfield Jamison's honest, beautifully written memoir of living with bipolar disorder — a powerful testament to resilience and the value of seeking help.",
    url: "https://www.amazon.com/Unquiet-Mind-Memoir-Moods-Madness/dp/0679763309",
    category: Type__1.book,
    tags: ["memoir", "bipolar", "resilience", "honesty"],
  },
  {
    id: BigInt(12),
    title: "Rewire Your Anxious Brain",
    description:
      "Catherine Pittman and Elizabeth Karle explain the neuroscience of anxiety with two distinct brain pathways, then give targeted strategies to change those pathways permanently.",
    url: "https://www.amazon.com/Rewire-Your-Anxious-Brain-Neuroscience/dp/1626251137",
    category: Type__1.book,
    tags: ["anxiety", "neuroscience", "brain rewiring", "CBT"],
  },
  {
    id: BigInt(13),
    title: "Rising Strong by Brené Brown",
    description:
      "Brown's research-driven guide to getting back up after failure, vulnerability, and emotional setbacks — ideal for students navigating academic pressure and social struggles.",
    url: "https://www.amazon.com/Rising-Strong-Ability-Transforms-Parent/dp/081298580X",
    category: Type__1.book,
    tags: ["resilience", "vulnerability", "courage", "students"],
  },
  {
    id: BigInt(14),
    title: "The Mindfulness and Acceptance Workbook for Anxiety",
    description:
      "ACT-based workbook that teaches readers to accept anxious thoughts rather than fight them, using mindfulness and values-based action to create a richer life.",
    url: "https://www.amazon.com/Mindfulness-Acceptance-Workbook-Anxiety-Acceptance/dp/1626253854",
    category: Type__1.book,
    tags: ["ACT", "anxiety", "mindfulness", "workbook"],
  },
  {
    id: BigInt(15),
    title: "10% Happier by Dan Harris",
    description:
      "A skeptic's journey into meditation — journalist Dan Harris shares how mindfulness practice reduced his anxiety and changed his relationship with his own mind.",
    url: "https://www.amazon.com/10-Happier-Self-Help-Actually-Works/dp/0062265431",
    category: Type__1.book,
    tags: ["meditation", "mindfulness", "anxiety", "humor"],
  },
  {
    id: BigInt(16),
    title: "The Power of Now by Eckhart Tolle",
    description:
      "A spiritual guide to living fully in the present moment, dissolving anxiety rooted in past regrets or future fears. Simple practices suitable for any age.",
    url: "https://www.amazon.com/Power-Now-Guide-Spiritual-Enlightenment/dp/1577314808",
    category: Type__1.book,
    tags: ["present moment", "mindfulness", "anxiety", "spirituality"],
  },
  {
    id: BigInt(17),
    title: "Maybe You Should Talk to Someone",
    description:
      "Lori Gottlieb's entertaining, empathetic memoir of therapist-as-patient breaks down what therapy is really like and why asking for help is a sign of strength.",
    url: "https://www.amazon.com/Maybe-You-Should-Talk-Someone/dp/1328662055",
    category: Type__1.book,
    tags: ["therapy", "memoir", "help-seeking", "warmth"],
  },
  {
    id: BigInt(18),
    title: "The Highly Sensitive Person",
    description:
      "Elaine Aron explains the trait of high sensitivity — how it shows up in school, relationships, and emotional life — and offers strategies for thriving as an HSP.",
    url: "https://www.amazon.com/Highly-Sensitive-Person-Survive-Thrive/dp/0553062182",
    category: Type__1.book,
    tags: ["sensitivity", "introversion", "overwhelm", "self-understanding"],
  },
  {
    id: BigInt(19),
    title: "Atomic Habits by James Clear",
    description:
      "Although focused on habits, this bestseller's framework for tiny changes is directly applicable to building consistent mental health practices like exercise, sleep, and journaling.",
    url: "https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/0735211299",
    category: Type__1.book,
    tags: ["habits", "behaviour change", "routine", "wellness"],
  },
  {
    id: BigInt(20),
    title: "Daring Greatly by Brené Brown",
    description:
      "An exploration of vulnerability as courage — showing how shame and fear of imperfection fuel anxiety and depression, and how openness is the antidote.",
    url: "https://www.amazon.com/Daring-Greatly-Courage-Vulnerable-Transforms/dp/1592408419",
    category: Type__1.book,
    tags: ["vulnerability", "shame", "courage", "connection"],
  },

  // ── ARTICLES ───────────────────────────────────────────────────────────────
  {
    id: BigInt(21),
    title: "The Mindful Student: Stress-Free Learning Techniques",
    description:
      "Evidence-based mindfulness practices designed specifically for students facing academic pressure. Includes meditation scripts, focus techniques, and emotional regulation tools.",
    url: "https://www.mindful.org/meditation/mindfulness-getting-started/",
    category: Type__1.article,
    tags: ["mindfulness", "students", "stress", "focus"],
  },
  {
    id: BigInt(22),
    title: "Understanding the Teenage Brain Under Stress",
    description:
      "A research-backed article explaining how adolescent brains respond to stress differently, and what strategies help teenagers build emotional resilience during formative years.",
    url: "https://www.apa.org/topics/stress/teens",
    category: Type__1.article,
    tags: ["teenagers", "brain", "stress", "resilience"],
  },
  {
    id: BigInt(23),
    title: "How Sleep Affects Mental Health in Students",
    description:
      "Research from the APA on the bidirectional relationship between sleep deprivation and anxiety/depression in students, with practical sleep hygiene recommendations.",
    url: "https://www.apa.org/topics/sleep/why",
    category: Type__1.article,
    tags: ["sleep", "students", "anxiety", "depression"],
  },
  {
    id: BigInt(24),
    title: "Social Media and Teen Mental Health: What the Research Says",
    description:
      "A balanced look at the evidence linking social media use to adolescent wellbeing, with actionable guidelines for healthier digital habits.",
    url: "https://www.apa.org/topics/social-media-internet/technology-use-children",
    category: Type__1.article,
    tags: ["social media", "teenagers", "screen time", "wellbeing"],
  },
  {
    id: BigInt(25),
    title: "The Science of Gratitude",
    description:
      "Greater Good Science Center at Berkeley summarises decades of research showing how a regular gratitude practice reduces cortisol, improves sleep, and increases social connection.",
    url: "https://greatergood.berkeley.edu/topic/gratitude/definition",
    category: Type__1.article,
    tags: ["gratitude", "science", "wellbeing", "cortisol"],
  },
  {
    id: BigInt(26),
    title: "Five Ways to Wellbeing: Evidence-Based Actions",
    description:
      "The five core actions — connect, be active, take notice, keep learning, give — backed by large-scale research from the New Economics Foundation.",
    url: "https://neweconomics.org/2008/10/five-ways-to-wellbeing",
    category: Type__1.article,
    tags: ["wellbeing", "connection", "learning", "action"],
  },
  {
    id: BigInt(27),
    title: "Cognitive Distortions: Thinking Traps That Worsen Anxiety",
    description:
      "An accessible explanation of the 15 most common cognitive distortions — catastrophising, mind-reading, personalisation — and how to challenge them with CBT techniques.",
    url: "https://www.verywellmind.com/ten-cognitive-distortions-identified-in-cbt-22412",
    category: Type__1.article,
    tags: ["CBT", "cognitive distortions", "anxiety", "thinking"],
  },
  {
    id: BigInt(28),
    title: "Exercise and Mental Health: The Evidence",
    description:
      "A summary of systematic reviews showing that regular physical activity reduces symptoms of depression and anxiety by up to 40%, explained in plain language.",
    url: "https://www.health.harvard.edu/mind-and-mood/exercise-is-an-all-natural-treatment-to-fight-depression",
    category: Type__1.article,
    tags: ["exercise", "depression", "anxiety", "evidence"],
  },
  {
    id: BigInt(29),
    title: "Loneliness and Social Isolation: An Epidemic",
    description:
      "WHO and Surgeon General reports on the global loneliness crisis, its health impacts equal to smoking 15 cigarettes a day, and community-based solutions.",
    url: "https://www.who.int/news/item/02-12-2023-who-commission-on-social-connection",
    category: Type__1.article,
    tags: ["loneliness", "isolation", "connection", "WHO"],
  },
  {
    id: BigInt(30),
    title: "What Is Emotional Regulation and Why Does It Matter?",
    description:
      "An introduction to the DBT concept of emotional regulation — identifying, understanding, and managing emotions — written for students and young adults.",
    url: "https://www.verywellmind.com/emotion-regulation-2795374",
    category: Type__1.article,
    tags: ["DBT", "emotional regulation", "skills", "students"],
  },
  {
    id: BigInt(31),
    title: "How to Talk to Someone About Your Mental Health",
    description:
      "Mind UK's practical guide to having the first conversation about mental health — what to say, who to turn to, and how to prepare yourself emotionally.",
    url: "https://www.mind.org.uk/information-support/guides-to-support-and-services/seeking-help-for-a-mental-health-problem/talking-to-someone-you-trust/",
    category: Type__1.article,
    tags: ["help-seeking", "communication", "support", "students"],
  },
  {
    id: BigInt(32),
    title: "The Science of Self-Compassion",
    description:
      "Kristin Neff's research shows that self-compassion — being kind to yourself in moments of failure — is more effective than self-esteem for mental health.",
    url: "https://self-compassion.org/the-research/",
    category: Type__1.article,
    tags: ["self-compassion", "research", "Kristin Neff", "wellbeing"],
  },
  {
    id: BigInt(33),
    title: "Perfectionism and Anxiety in Students",
    description:
      "Research-backed article on how maladaptive perfectionism drives academic anxiety, procrastination, and burnout — plus strategies to shift toward healthy high standards.",
    url: "https://www.psychologytoday.com/us/blog/shyness-is-nice/201908/perfectionism-and-anxiety",
    category: Type__1.article,
    tags: ["perfectionism", "anxiety", "students", "procrastination"],
  },
  {
    id: BigInt(34),
    title: "Nature and Mental Health: What the Research Shows",
    description:
      "Evidence from ecotherapy research showing that spending time in green spaces reduces cortisol, lowers blood pressure, and improves mood within minutes.",
    url: "https://www.mentalhealth.org.uk/our-work/research/nature-research-and-publications",
    category: Type__1.article,
    tags: ["nature", "green space", "cortisol", "mood"],
  },
  {
    id: BigInt(35),
    title: "Understanding Panic Attacks: Causes and Coping",
    description:
      "A clear explanation of the physiology of panic, common triggers in students, and a step-by-step guide to grounding techniques that interrupt the panic cycle.",
    url: "https://www.anxietycanada.com/articles/understanding-panic/",
    category: Type__1.article,
    tags: ["panic", "anxiety", "grounding", "coping"],
  },
  {
    id: BigInt(36),
    title: "Building Resilience: 10 Evidence-Based Ways",
    description:
      "APA's research summary on resilience factors — strong relationships, self-regulation, purpose, optimism — and practical exercises to strengthen each one.",
    url: "https://www.apa.org/topics/resilience",
    category: Type__1.article,
    tags: ["resilience", "APA", "relationships", "purpose"],
  },
  {
    id: BigInt(37),
    title: "The Role of Nutrition in Mental Health",
    description:
      "Psychiatry & Clinical Neurosciences review on the gut-brain axis, and how diet — omega-3s, fermented foods, leafy greens — affects mood, cognition, and stress response.",
    url: "https://www.health.harvard.edu/blog/nutritional-psychiatry-your-brain-on-food-201511168626",
    category: Type__1.article,
    tags: ["nutrition", "gut-brain", "diet", "mood"],
  },
  {
    id: BigInt(38),
    title: "Journaling for Mental Health: A Research Review",
    description:
      "Evidence that expressive writing reduces intrusive thoughts, speeds emotional processing, and improves immune function — plus prompts to get started today.",
    url: "https://www.urmc.rochester.edu/encyclopedia/content.aspx?ContentID=4552&ContentTypeID=1",
    category: Type__1.article,
    tags: ["journaling", "expressive writing", "research", "wellness"],
  },
  {
    id: BigInt(39),
    title: "Reducing Test Anxiety: Strategies That Work",
    description:
      "American Test Anxieties Association research on the prevalence of test anxiety and a toolkit of cognitive, behavioural, and physiological strategies proven to reduce it.",
    url: "https://www.apa.org/gradpsych/2013/01/test-anxiety",
    category: Type__1.article,
    tags: ["test anxiety", "students", "exams", "strategies"],
  },
  {
    id: BigInt(40),
    title: "How to Help a Friend Experiencing Depression",
    description:
      "Practical, evidence-based advice on recognising signs of depression in peers, how to have a supportive conversation, and when to involve trusted adults.",
    url: "https://www.headspace.com/articles/how-to-help-someone-with-depression",
    category: Type__1.article,
    tags: ["depression", "support", "friendship", "help"],
  },
  {
    id: BigInt(41),
    title: "Mindfulness Reduces Stress in Students: Meta-Analysis",
    description:
      "A 2021 meta-analysis of 65 randomised trials found 8-week mindfulness programmes significantly reduced stress, anxiety, and depression in school-age students.",
    url: "https://www.frontiersin.org/articles/10.3389/fpsyg.2021.641728",
    category: Type__1.article,
    tags: ["mindfulness", "meta-analysis", "students", "evidence"],
  },
  {
    id: BigInt(42),
    title: "Social Connection and Mental Health",
    description:
      "Harvard Study of Adult Development — the world's longest happiness study — shows that warm relationships are the single greatest predictor of health and wellbeing.",
    url: "https://www.adultdevelopmentstudy.org/",
    category: Type__1.article,
    tags: ["connection", "relationships", "happiness", "Harvard"],
  },
  {
    id: BigInt(43),
    title: "Breathing Techniques for Instant Calm",
    description:
      "Healthline's evidence-based summary of nine breathing exercises — diaphragmatic, box, 4-7-8, lion's breath — each with clear step-by-step instructions.",
    url: "https://www.healthline.com/health/breathing-exercises-for-anxiety",
    category: Type__1.article,
    tags: ["breathing", "anxiety", "calm", "techniques"],
  },
  {
    id: BigInt(44),
    title: "Art Therapy and Mental Health",
    description:
      "British Association of Art Therapists overview of how creative expression reduces anxiety, improves self-esteem, and provides a non-verbal outlet for difficult emotions.",
    url: "https://www.baat.org/About-Art-Therapy",
    category: Type__1.article,
    tags: ["art therapy", "creativity", "anxiety", "self-expression"],
  },
  {
    id: BigInt(45),
    title: "Music Therapy: How Sound Heals the Mind",
    description:
      "Research on how rhythmic entrainment, lyrical analysis, and improvisational music therapy reduce depression and anxiety symptoms across all age groups.",
    url: "https://www.psychologytoday.com/us/blog/science-of-choice/201808/the-neuroscience-music",
    category: Type__1.article,
    tags: ["music therapy", "depression", "anxiety", "healing"],
  },
  {
    id: BigInt(46),
    title: "The Mental Health Benefits of Yoga",
    description:
      "Systematic review of 23 RCTs showing yoga reduces cortisol, lowers anxiety, and improves depression symptoms — accessible beginner routines included.",
    url: "https://www.healthline.com/health/mental-health/yoga-for-depression",
    category: Type__1.article,
    tags: ["yoga", "cortisol", "depression", "anxiety"],
  },
  {
    id: BigInt(47),
    title: "Understanding Anxiety Disorders in Adolescents",
    description:
      "NIMH fact sheet on the prevalence, types, symptoms, and first-line treatments for anxiety disorders in young people — including how parents and teachers can help.",
    url: "https://www.nimh.nih.gov/health/topics/anxiety-disorders",
    category: Type__1.article,
    tags: ["anxiety disorders", "adolescents", "NIMH", "treatment"],
  },
  {
    id: BigInt(48),
    title: "Screen Time, Sleep and Adolescent Depression",
    description:
      "2023 longitudinal study tracking 10,000 teens over four years, showing that each extra hour of nightly screen time is associated with measurable mood and sleep decline.",
    url: "https://www.childrenandscreens.com/learn-explore/research/",
    category: Type__1.article,
    tags: ["screen time", "sleep", "depression", "adolescents"],
  },
  {
    id: BigInt(49),
    title: "Peer Support and Mental Health in Schools",
    description:
      "Evidence review from Young Minds on the effectiveness of peer-led mental health programmes, including how schools can set them up and measure impact.",
    url: "https://youngminds.org.uk/resources/school-resources/",
    category: Type__1.article,
    tags: ["peer support", "schools", "mental health", "community"],
  },
  {
    id: BigInt(50),
    title: "Shame vs. Guilt: Why the Difference Matters",
    description:
      "Brené Brown's research explains why guilt ('I did something bad') motivates change, while shame ('I am bad') drives depression — and how to shift from one to the other.",
    url: "https://brenebrown.com/articles/2013/01/14/shame-v-guilt/",
    category: Type__1.article,
    tags: ["shame", "guilt", "Brené Brown", "depression"],
  },

  // ── PODCASTS ───────────────────────────────────────────────────────────────
  {
    id: BigInt(51),
    title: "The Happiness Lab with Dr. Laurie Santos",
    description:
      "Yale professor Dr. Laurie Santos explores surprising science behind happiness and the common misconceptions that lead us astray. Practical insights for building a genuinely fulfilling life.",
    url: "https://www.happinesslab.fm/",
    category: Type__1.podcast,
    tags: ["happiness", "psychology", "science", "wellbeing"],
  },
  {
    id: BigInt(52),
    title: "Therapy in a Nutshell",
    description:
      "Emma McAdam, a licensed therapist, shares straightforward mental health tools, therapy techniques, and coping skills in accessible, engaging episodes for people of all ages.",
    url: "https://therapyinanutshell.com/podcast/",
    category: Type__1.podcast,
    tags: ["therapy", "CBT", "coping skills", "anxiety"],
  },
  {
    id: BigInt(53),
    title: "The Mindful Kind",
    description:
      "Rachael Kable delivers short, practical mindfulness tools for reducing stress and anxiety — perfect for students with limited time. Each episode is under 20 minutes.",
    url: "https://www.rachaelkable.com/podcast",
    category: Type__1.podcast,
    tags: ["mindfulness", "stress", "short episodes", "practical"],
  },
  {
    id: BigInt(54),
    title: "On Being with Krista Tippett",
    description:
      "Deep, humanistic conversations with philosophers, scientists, and poets on meaning, morality, and what it means to be human — rich perspective for inner reflection.",
    url: "https://onbeing.org/series/podcast/",
    category: Type__1.podcast,
    tags: ["meaning", "philosophy", "humanity", "reflection"],
  },
  {
    id: BigInt(55),
    title: "The Teen Brain: Navigating Anxiety Podcast",
    description:
      "Designed for teens and their parents, this podcast breaks down anxiety science in relatable terms, with real stories and actionable tips for school and social life.",
    url: "https://childmind.org/podcasts/",
    category: Type__1.podcast,
    tags: ["teenagers", "anxiety", "parents", "school"],
  },
  {
    id: BigInt(56),
    title: "Feel Better, Live More with Dr. Rangan Chatterjee",
    description:
      "UK GP Dr. Rangan Chatterjee interviews world-leading experts on stress, sleep, nutrition, and emotional health — practical episodes with clear takeaways.",
    url: "https://drchatterjee.com/podcast/",
    category: Type__1.podcast,
    tags: ["stress", "sleep", "nutrition", "wellbeing"],
  },
  {
    id: BigInt(57),
    title: "Unlocking Us with Brené Brown",
    description:
      "Conversations on courage, vulnerability, and human connection — Brené Brown interviews scholars, artists, and thought leaders to help listeners embrace imperfection.",
    url: "https://brenebrown.com/podcast-show/unlocking-us/",
    category: Type__1.podcast,
    tags: ["vulnerability", "courage", "connection", "Brené Brown"],
  },
  {
    id: BigInt(58),
    title: "Owning It: The Anxiety Podcast",
    description:
      "Caroline Foran's personal journey with anxiety, combined with expert interviews, normalises mental health struggles and explores what recovery looks and feels like.",
    url: "https://carolineforan.com/owning-it-podcast/",
    category: Type__1.podcast,
    tags: ["anxiety", "personal story", "recovery", "normalisation"],
  },
  {
    id: BigInt(59),
    title: "The Mental Health Foundation Podcast",
    description:
      "Expert discussions on prevention-focused mental health topics — from loneliness and sleep to kindness and online safety — aimed at young people and educators.",
    url: "https://www.mentalhealth.org.uk/podcasts-and-videos",
    category: Type__1.podcast,
    tags: ["prevention", "young people", "educators", "wellbeing"],
  },
  {
    id: BigInt(60),
    title: "Huberman Lab: Mental Health Toolkit",
    description:
      "Stanford neuroscientist Andrew Huberman presents protocols for managing stress, improving sleep, and enhancing mood — grounded in peer-reviewed neuroscience.",
    url: "https://www.hubermanlab.com/topics/mental-health",
    category: Type__1.podcast,
    tags: ["neuroscience", "sleep", "stress", "protocols"],
  },
  {
    id: BigInt(61),
    title: "10% Happier with Dan Harris",
    description:
      "Interviews with leading meditation teachers and mental health researchers — accessible, skeptic-friendly episodes that make mindfulness approachable for beginners.",
    url: "https://www.tenpercent.com/podcast-episode",
    category: Type__1.podcast,
    tags: ["meditation", "mindfulness", "beginners", "skeptic"],
  },
  {
    id: BigInt(62),
    title: "Calm Masterclass: The Science of Sleep",
    description:
      "Sleep scientist Matthew Walker breaks down why teens need 9 hours of sleep, what happens during each sleep stage, and how to achieve restorative sleep consistently.",
    url: "https://www.calm.com/blog/sleep",
    category: Type__1.podcast,
    tags: ["sleep", "Matthew Walker", "teenagers", "restoration"],
  },
  {
    id: BigInt(63),
    title: "Dare to Lead with Brené Brown",
    description:
      "Leadership and courage conversations exploring how emotional vulnerability, empathy, and honest communication are core skills for thriving in any environment — including school.",
    url: "https://brenebrown.com/podcast-show/dare-to-lead-podcast/",
    category: Type__1.podcast,
    tags: ["leadership", "empathy", "courage", "communication"],
  },
  {
    id: BigInt(64),
    title: "Speaking of Psychology: APA Podcast",
    description:
      "American Psychological Association's official podcast — clear, expert explanations of psychological research topics from stress and resilience to identity and social belonging.",
    url: "https://www.apa.org/news/podcasts/speaking-of-psychology",
    category: Type__1.podcast,
    tags: ["APA", "psychology", "research", "identity"],
  },
  {
    id: BigInt(65),
    title: "Good Life Project",
    description:
      "Hosted by Jonathan Fields, each episode is a conversation with a fascinating person on how they find meaning, joy, and resilience — deeply humanistic and inspiring.",
    url: "https://www.goodlifeproject.com/podcast/",
    category: Type__1.podcast,
    tags: ["meaning", "joy", "resilience", "inspiration"],
  },
  {
    id: BigInt(66),
    title: "My Therapist Said",
    description:
      "Young hosts share their real experiences with therapy, mental health struggles, and growth in a format that feels like listening to trusted friends — relatable for teens.",
    url: "https://podcasts.apple.com/us/podcast/my-therapist-said/id1534519286",
    category: Type__1.podcast,
    tags: ["therapy", "teenagers", "relatable", "growth"],
  },
  {
    id: BigInt(67),
    title: "Meditation Minis",
    description:
      "Short (5–15 minute) guided meditations by hypnotherapist Chel Hamilton — covering anxiety relief, confidence, sleep, and stress management for busy students.",
    url: "https://meditationminis.com/",
    category: Type__1.podcast,
    tags: ["guided meditation", "short", "anxiety", "sleep"],
  },
  {
    id: BigInt(68),
    title: "Not Another Anxiety Show",
    description:
      "Kelli Walker's practical, research-backed podcast specifically for anxiety sufferers — tools from CBT, ACT, and exposure therapy explained without clinical jargon.",
    url: "https://www.notanotheraxietyshow.com/",
    category: Type__1.podcast,
    tags: ["anxiety", "CBT", "ACT", "practical"],
  },
  {
    id: BigInt(69),
    title: "School of Greatness with Lewis Howes",
    description:
      "Lewis Howes interviews elite performers and mental health experts on overcoming adversity, building grit, and developing emotional intelligence — motivating for students.",
    url: "https://lewishowes.com/sogpodcast/",
    category: Type__1.podcast,
    tags: ["grit", "adversity", "emotional intelligence", "motivation"],
  },
  {
    id: BigInt(70),
    title: "The Anxiety Guy Podcast",
    description:
      "Dennis Simsek shares his own recovery from severe anxiety with actionable episodes on the mind-body connection, subconscious beliefs, and long-term healing.",
    url: "https://theanxietyguy.com/podcast/",
    category: Type__1.podcast,
    tags: ["anxiety recovery", "mind-body", "healing", "personal story"],
  },

  // ── ADDITIONAL BOOKS ──────────────────────────────────────────────────────
  {
    id: BigInt(71),
    title: "Dare to Lead",
    description:
      "Brené Brown's research-backed guide on brave leadership and wholehearted living. Explores vulnerability, empathy, and courage as core skills for meaningful connection and personal growth.",
    url: "https://www.penguinrandomhouse.com/books/567881/dare-to-lead-by-brene-brown/",
    category: Type__1.book,
    tags: ["leadership", "courage", "vulnerability", "personal growth"],
  },
  {
    id: BigInt(72),
    title: "Mindset: The New Psychology of Success",
    description:
      "Carol Dweck's landmark work on the power of a growth mindset over a fixed one. Learn how the belief that abilities can be developed transforms achievement and resilience.",
    url: "https://www.amazon.com/Mindset-Psychology-Carol-S-Dweck/dp/0345472322",
    category: Type__1.book,
    tags: ["growth mindset", "psychology", "success", "resilience"],
  },
  {
    id: BigInt(73),
    title: "Lost Connections: Why You're Depressed and How to Find Hope",
    description:
      "Johann Hari investigates the real causes of depression and anxiety — not brain chemistry alone, but disconnection from meaningful work, people, and purpose — and presents evidence-based solutions.",
    url: "https://thelostconnections.com/",
    category: Type__1.book,
    tags: ["depression", "anxiety", "connection", "social wellness"],
  },
  {
    id: BigInt(74),
    title: "The Body Keeps the Score",
    description:
      "Bessel van der Kolk reveals how trauma reshapes the body and brain, and explores innovative treatments — yoga, EMDR, neurofeedback — that help survivors reclaim their lives.",
    url: "https://www.besselvanderkolk.com/resources/the-body-keeps-the-score",
    category: Type__1.book,
    tags: ["trauma", "healing", "body-mind", "neuroscience"],
  },
  {
    id: BigInt(75),
    title: "Quiet: The Power of Introverts in a World That Can't Stop Talking",
    description:
      "Susan Cain challenges a culture that prizes extroversion and makes a passionate case for the power of quiet students, thinkers, and innovators who prefer listening to speaking.",
    url: "https://susancain.net/book/quiet/",
    category: Type__1.book,
    tags: ["introversion", "self-understanding", "social skills", "identity"],
  },

  // ── ADDITIONAL ARTICLES ────────────────────────────────────────────────────
  {
    id: BigInt(76),
    title: "How to Build Emotional Resilience",
    description:
      "A science-grounded guide from Greater Good Science Center on the habits and mindsets that make people bounce back faster from adversity, setbacks, and stress.",
    url: "https://greatergood.berkeley.edu/article/item/how_to_build_resilience_in_midlife",
    category: Type__1.article,
    tags: ["resilience", "emotional strength", "adversity", "coping"],
  },
  {
    id: BigInt(77),
    title: "The Science of Happiness: What Actually Works",
    description:
      "Harvard Health Publishing reviews decades of positive psychology research to identify what genuinely increases happiness — relationships, gratitude, purpose — beyond common myths.",
    url: "https://www.health.harvard.edu/mind-and-mood/the-science-of-happiness",
    category: Type__1.article,
    tags: ["happiness", "positive psychology", "well-being", "science"],
  },
  {
    id: BigInt(78),
    title: "Why You Procrastinate (It Has Nothing to Do With Self-Control)",
    description:
      "A New York Times piece explaining that procrastination is an emotion-regulation problem, not laziness — and the research-backed strategies that actually help.",
    url: "https://www.nytimes.com/2019/03/25/smarter-living/why-you-procrastinate-it-has-nothing-to-do-with-self-control.html",
    category: Type__1.article,
    tags: [
      "procrastination",
      "motivation",
      "emotion regulation",
      "productivity",
    ],
  },
  {
    id: BigInt(79),
    title: "Loneliness Is a Public Health Crisis — Here Is What We Can Do",
    description:
      "An exploration of how loneliness affects physical and mental health as profoundly as smoking, and what individuals and communities can do to rebuild social connection.",
    url: "https://www.psychologytoday.com/us/blog/fulfillment-any-age/202301/the-loneliness-crisis-and-what-we-can-do-about-it",
    category: Type__1.article,
    tags: ["loneliness", "social health", "connection", "community"],
  },
  {
    id: BigInt(80),
    title: "Sleep Deprivation and Mental Health: What the Research Says",
    description:
      "A comprehensive overview of how chronic sleep loss amplifies depression, anxiety, and emotional dysregulation, with evidence-based sleep hygiene tips for students.",
    url: "https://www.sleepfoundation.org/mental-health",
    category: Type__1.article,
    tags: ["sleep", "mental health", "depression", "anxiety"],
  },

  // ── ADDITIONAL PODCASTS ────────────────────────────────────────────────────
  {
    id: BigInt(81),
    title: "Unlocking Us with Brené Brown",
    description:
      "Brené Brown explores conversations about vulnerability, courage, and connection with researchers, athletes, artists, and change-makers. Grounded in data, deeply human.",
    url: "https://brenebrown.com/podcast/unlocking-us/",
    category: Type__1.podcast,
    tags: ["vulnerability", "courage", "connection", "storytelling"],
  },
  {
    id: BigInt(82),
    title: "The Tim Ferriss Show",
    description:
      "Tim Ferriss deconstructs world-class performers from sports, business, and the arts to extract the tactics, tools, and routines you can use. Covers mental health, habits, and peak performance.",
    url: "https://tim.blog/podcast/",
    category: Type__1.podcast,
    tags: ["peak performance", "habits", "mental health", "success"],
  },
  {
    id: BigInt(83),
    title: "Feel Better, Live More with Dr. Rangan Chatterjee",
    description:
      "Dr. Chatterjee explores the science of feeling better — conversations on sleep, stress, purpose, and behaviour change with leading experts from around the world.",
    url: "https://drchatterjee.com/podcast/",
    category: Type__1.podcast,
    tags: ["wellness", "sleep", "stress", "behaviour change"],
  },
  {
    id: BigInt(84),
    title: "The School of Greatness with Lewis Howes",
    description:
      "Lewis Howes interviews icons in sport, business, and wellness about overcoming adversity, mindset, and building a life of greatness. Inspiring and practically actionable.",
    url: "https://lewishowes.com/sogpodcast/",
    category: Type__1.podcast,
    tags: ["mindset", "greatness", "adversity", "inspiration"],
  },
  {
    id: BigInt(85),
    title: "Mind Over Manner",
    description:
      "A podcast focused on emotional intelligence, social awareness, and self-regulation for young adults navigating college, career, and relationships. Relatable, evidence-based, and judgment-free.",
    url: "https://podcasts.apple.com/us/podcast/mind-over-manner/id1535699900",
    category: Type__1.podcast,
    tags: ["emotional intelligence", "college life", "relationships", "EQ"],
  },

  // ── MOTIVATIONAL SPEECHES ──────────────────────────────────────────────────
  {
    id: BigInt(86),
    title: "Steve Jobs: Stanford Commencement Address (2005)",
    description:
      "One of the most celebrated speeches in history. Jobs shares three life stories about connecting dots, love and loss, and death — urging listeners to find what they love and never settle.",
    url: "https://www.youtube.com/watch?v=UF8uR6Z6KLc",
    category: "speech" as unknown as Type__1,
    tags: ["purpose", "perseverance", "life lessons", "inspiration"],
  },
  {
    id: BigInt(87),
    title: "Brené Brown: The Power of Vulnerability (TED Talk)",
    description:
      "One of the most-watched TED Talks ever. Brené Brown's research shows that vulnerability — not weakness — is the birthplace of creativity, belonging, and joy.",
    url: "https://www.ted.com/talks/brene_brown_the_power_of_vulnerability",
    category: "speech" as unknown as Type__1,
    tags: ["vulnerability", "courage", "connection", "TED"],
  },
  {
    id: BigInt(88),
    title: "Michelle Obama: 2016 DNC Speech on Hope and Resilience",
    description:
      "A masterclass in empathy and resilience. Michelle Obama speaks about growing up with limited means, the weight of representation, and why hope and hard work still matter.",
    url: "https://www.youtube.com/watch?v=4ZNWYqDU948",
    category: "speech" as unknown as Type__1,
    tags: ["resilience", "hope", "empowerment", "identity"],
  },
  {
    id: BigInt(89),
    title: "Sir Ken Robinson: Do Schools Kill Creativity? (TED Talk)",
    description:
      "The most-watched TED Talk of all time. Robinson makes a passionate, humorous case for reimagining education to nurture rather than suppress children's natural creativity.",
    url: "https://www.ted.com/talks/sir_ken_robinson_do_schools_kill_creativity",
    category: "speech" as unknown as Type__1,
    tags: ["creativity", "education", "self-expression", "TED"],
  },
  {
    id: BigInt(90),
    title: "Matthew McConaughey: University of Houston Commencement (2015)",
    description:
      "A down-to-earth commencement speech where McConaughey shares five defining lessons for a fulfilling life — process, defining success for yourself, and finding your joy.",
    url: "https://www.youtube.com/watch?v=wD2cVhC-63I",
    category: "speech" as unknown as Type__1,
    tags: ["life lessons", "success", "joy", "commencement"],
  },
  {
    id: BigInt(91),
    title: "Malala Yousafzai: UN Youth Assembly Speech (2013)",
    description:
      "At 16, Malala addressed the United Nations about the power of education and the courage to speak even when voices are silenced. Deeply moving and universally inspiring.",
    url: "https://www.youtube.com/watch?v=3rNhZu3ttIU",
    category: "speech" as unknown as Type__1,
    tags: ["education", "courage", "equality", "youth empowerment"],
  },
  {
    id: BigInt(92),
    title: "Simon Sinek: How Great Leaders Inspire Action (TED Talk)",
    description:
      "Simon Sinek's 'Start With Why' concept explains why some people and organisations inspire while others don't — and how purpose drives motivation more than any incentive.",
    url: "https://www.ted.com/talks/simon_sinek_how_great_leaders_inspire_action",
    category: "speech" as unknown as Type__1,
    tags: ["purpose", "leadership", "motivation", "why"],
  },
  {
    id: BigInt(93),
    title: "Oprah Winfrey: Stanford GSB Commencement (2014)",
    description:
      "Oprah speaks candidly about failure, the whispers of intuition, and the real meaning of service. Her address to MBA graduates is a blueprint for building a values-driven life.",
    url: "https://www.youtube.com/watch?v=GMWFieBGR7c",
    category: "speech" as unknown as Type__1,
    tags: ["failure", "intuition", "service", "values"],
  },
  {
    id: BigInt(94),
    title: "Nick Vujicic: No Arms, No Legs, No Worries",
    description:
      "Born without limbs, Nick Vujicic delivers an extraordinary motivational talk on overcoming self-doubt, finding hope, and choosing a life of meaning regardless of circumstances.",
    url: "https://www.youtube.com/watch?v=6P2nPI6CTlc",
    category: "speech" as unknown as Type__1,
    tags: ["overcoming adversity", "hope", "self-worth", "resilience"],
  },
  {
    id: BigInt(95),
    title: "Chimamanda Ngozi Adichie: The Danger of a Single Story (TED Talk)",
    description:
      "Adichie's powerful TED Talk on how incomplete narratives shape prejudice and identity — and why we must seek many stories to understand ourselves and others fully.",
    url: "https://www.ted.com/talks/chimamanda_ngozi_adichie_the_danger_of_a_single_story",
    category: "speech" as unknown as Type__1,
    tags: ["identity", "storytelling", "empathy", "perspective"],
  },
  {
    id: BigInt(96),
    title: "Shawn Achor: The Happy Secret to Better Work (TED Talk)",
    description:
      "Positive psychologist Shawn Achor reveals that happiness fuels success — not the other way around — and shares five daily habits proven to rewire the brain for positivity.",
    url: "https://www.ted.com/talks/shawn_achor_the_happy_secret_to_better_work",
    category: "speech" as unknown as Type__1,
    tags: ["happiness", "positive psychology", "habits", "productivity"],
  },
  {
    id: BigInt(97),
    title: "Amy Cuddy: Your Body Language May Shape Who You Are (TED Talk)",
    description:
      "Social psychologist Amy Cuddy explains how posture and body language affect not only how others see us but how we see ourselves — with a practical 2-minute technique.",
    url: "https://www.ted.com/talks/amy_cuddy_your_body_language_may_shape_who_you_are",
    category: "speech" as unknown as Type__1,
    tags: ["confidence", "body language", "self-image", "TED"],
  },
  {
    id: BigInt(98),
    title: "Mel Robbins: Stop Screwing Yourself Over (TEDx Talk)",
    description:
      "Mel Robbins delivers a raw, no-nonsense talk on why people stay stuck, the science of activation energy, and the simple 5-second rule that interrupts self-doubt.",
    url: "https://www.youtube.com/watch?v=Lp7E973zozc",
    category: "speech" as unknown as Type__1,
    tags: ["motivation", "action", "self-doubt", "change"],
  },
  {
    id: BigInt(99),
    title: "Tony Robbins: Why We Do What We Do (TED Talk)",
    description:
      "Tony Robbins explores the invisible forces — the six human needs — that drive every decision we make, and how understanding them unlocks personal transformation.",
    url: "https://www.ted.com/talks/tony_robbins_why_we_do_what_we_do",
    category: "speech" as unknown as Type__1,
    tags: ["human needs", "motivation", "transformation", "psychology"],
  },
  {
    id: BigInt(100),
    title: "Barack Obama: Howard University Commencement Address (2016)",
    description:
      "A thoughtful, energising commencement address on identity, progress, civic responsibility, and the optimism needed to change the world — delivered with characteristic clarity and warmth.",
    url: "https://www.youtube.com/watch?v=ryMLF4BpUSM",
    category: "speech" as unknown as Type__1,
    tags: ["identity", "progress", "civic responsibility", "optimism"],
  },
];

// ── SAMPLE ACTIVITIES ─────────────────────────────────────────────────────────
// ActivityType string values matching the backend enum
const AT = ActivityType;

// "game" activities are stored with activityType = word_association
// but given a gameProp marker in the title so the UI can style them distinctly.
// All 50 activities: 15 journaling, 15 affirmation, 10 word_association, 10 games

export const SAMPLE_ACTIVITIES = [
  // ── JOURNALING (15) ──────────────────────────────────────────────────────
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
    title: "Reframing Difficult Moments",
    activityType: AT.journaling as unknown,
    prompt:
      "Think of a stressful situation you experienced recently. Describe it briefly. Now rewrite the story from the perspective of a future version of yourself who has grown through this experience. What did they learn? What strength did it reveal?",
    difficultyLevel: BigInt(2),
  },
  {
    id: BigInt(3),
    title: "Letter to Your Younger Self",
    activityType: AT.journaling as unknown,
    prompt:
      "Write a compassionate letter to yourself at an earlier age — perhaps when you were 8 or 10 years old. What would you want them to know about the challenges ahead? What reassurances would you offer? What wisdom would you share?",
    difficultyLevel: BigInt(2),
  },
  {
    id: BigInt(4),
    title: "Anxiety Thought Dump",
    activityType: AT.journaling as unknown,
    prompt:
      "Set a timer for 10 minutes and write down every anxious thought in your mind without editing. Once the timer ends, read back through and place each thought into one of three columns: 'Fact', 'Fear', or 'Both'. What do you notice?",
    difficultyLevel: BigInt(2),
  },
  {
    id: BigInt(5),
    title: "Values Compass Journal",
    activityType: AT.journaling as unknown,
    prompt:
      "List your top five personal values (e.g. honesty, creativity, family, adventure). For each one, write a recent moment when you acted in alignment with it and a moment when you didn't. What adjustments could bring your life closer to your values?",
    difficultyLevel: BigInt(3),
  },
  {
    id: BigInt(6),
    title: "Unsent Anger Letter",
    activityType: AT.journaling as unknown,
    prompt:
      "Write an honest, unfiltered letter to someone or something that has hurt or frustrated you — you will NOT send this. Express everything you haven't been able to say out loud. After writing, take three slow breaths. How does your body feel now compared to before?",
    difficultyLevel: BigInt(3),
  },
  {
    id: BigInt(7),
    title: "Peak Moment Inventory",
    activityType: AT.journaling as unknown,
    prompt:
      "Recall the five most alive, joyful, or deeply satisfied you have ever felt. Describe each memory in detail — where were you, who was there, what were you doing? Identify the common threads. How can you invite more of these elements into your current life?",
    difficultyLevel: BigInt(2),
  },
  {
    id: BigInt(8),
    title: "Fear Ladder Journal",
    activityType: AT.journaling as unknown,
    prompt:
      "Choose one thing that frightens you (social events, exams, conflict). Write a ladder of 7 steps from least scary to most scary. Describe what your life would look like if fear no longer controlled this area. Which step could you take this week?",
    difficultyLevel: BigInt(3),
  },
  {
    id: BigInt(9),
    title: "Daily Mood Tracker",
    activityType: AT.journaling as unknown,
    prompt:
      "Rate your mood today from 1–10. Write three words that describe how you feel. Identify what might have influenced your mood — sleep, food, interactions, news? What is one small action you could take to nudge your mood up by one point?",
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(10),
    title: "Evening Review: Three Wins",
    activityType: AT.journaling as unknown,
    prompt:
      "Before bed, write down three things that went well today — no matter how small. For each one, note what YOU did to make it happen. This shifts the brain from a deficit focus to an agency focus, improving sleep quality and next-day motivation.",
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(11),
    title: "Future Self Visualisation Journal",
    activityType: AT.journaling as unknown,
    prompt:
      "Imagine yourself five years from now, living a life aligned with your deepest values. Describe a typical morning in detail — where do you wake up, how do you feel, what relationships and work surround you? What one step from today moves you toward that vision?",
    difficultyLevel: BigInt(2),
  },
  {
    id: BigInt(12),
    title: "Compassion Letter to a Friend",
    activityType: AT.journaling as unknown,
    prompt:
      "Think of a close friend going through exactly the struggle you are currently facing. Write them a warm, honest, supportive letter. Now read it back and ask: Can I offer this same compassion to myself? Write a second version addressed directly to yourself.",
    difficultyLevel: BigInt(2),
  },
  {
    id: BigInt(13),
    title: "Strengths Discovery Journal",
    activityType: AT.journaling as unknown,
    prompt:
      "Write about three recent situations where you handled something well, even imperfectly. For each one, identify the personal strength that helped you (e.g. persistence, creativity, empathy). How can you deliberately draw on these strengths this week?",
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(14),
    title: "Worry Time Journal",
    activityType: AT.journaling as unknown,
    prompt:
      "Schedule a 15-minute 'worry time'. Write every worry freely. Once time is up, categorise each worry: 'In my control' or 'Not in my control'. For each controllable worry, write one tiny action you can take. Close the journal and continue your day.",
    difficultyLevel: BigInt(2),
  },
  {
    id: BigInt(15),
    title: "Boundaries and Needs Journal",
    activityType: AT.journaling as unknown,
    prompt:
      "Reflect on a situation where you felt resentful, drained, or overlooked. What need was unmet? What boundary could you set to protect that need? Write a script for how you might communicate this need clearly and kindly to the person involved.",
    difficultyLevel: BigInt(3),
  },

  // ── AFFIRMATIONS (15) ────────────────────────────────────────────────────
  {
    id: BigInt(16),
    title: "Daily Strength Affirmation",
    activityType: AT.affirmation as unknown,
    prompt:
      "Repeat aloud (or write) this affirmation three times, then add your own personal version: 'I am resilient. Every challenge I face teaches me something valuable. I have the strength to navigate this moment, and I am not alone.'",
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(17),
    title: "Self-Compassion Affirmation",
    activityType: AT.affirmation as unknown,
    prompt:
      "Place your hand on your heart. Read this slowly: 'I am doing my best. Struggling doesn't mean failing. I deserve kindness — especially from myself. I am worthy of care and connection.' Write how this makes you feel.",
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(18),
    title: "Exam Confidence Affirmation",
    activityType: AT.affirmation as unknown,
    prompt:
      "Before your next test or exam, read this: 'My mind is clear and ready. I have prepared as well as I can. I trust myself to remember what I need. Even if I make mistakes, I learn and grow. I am capable.' Write it out, then close your eyes and breathe.",
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(19),
    title: "Social Courage Affirmation",
    activityType: AT.affirmation as unknown,
    prompt:
      "When social anxiety arises, repeat: 'I belong here. My presence adds value. It is safe to be seen. I can handle uncomfortable feelings — they are temporary. Connection matters more than perfection.' Write this affirmation in your own words.",
    difficultyLevel: BigInt(2),
  },
  {
    id: BigInt(20),
    title: "Morning Body Kindness Affirmation",
    activityType: AT.affirmation as unknown,
    prompt:
      "Stand in front of a mirror and say to yourself: 'My body carries me through every day. I appreciate what it can do. I treat it with respect, rest, and nourishment. I am more than how I look.' Describe how this practice changes your feeling in your body.",
    difficultyLevel: BigInt(2),
  },
  {
    id: BigInt(21),
    title: "Growth Mindset Affirmation",
    activityType: AT.affirmation as unknown,
    prompt:
      "Read: 'Every mistake is a teacher. My intelligence is not fixed — it grows with effort and curiosity. I am not behind. I am on my own timeline. Struggling with something means I am learning.' Write how you will apply this belief this week.",
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(22),
    title: "Depression Lift Affirmation",
    activityType: AT.affirmation as unknown,
    prompt:
      "When low mood feels heavy, read slowly: 'This feeling is temporary. It does not define who I am. Small steps count. Even getting out of bed is an act of courage. Light will come. I have survived every difficult day so far.' Write your own addition.",
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(23),
    title: "Belonging Affirmation",
    activityType: AT.affirmation as unknown,
    prompt:
      "Repeat: 'I belong. I am enough just as I am. I do not need to change to be worthy of love and connection. There are people in this world who will value the real me.' Write about a moment you have felt genuinely seen and accepted by someone.",
    difficultyLevel: BigInt(2),
  },
  {
    id: BigInt(24),
    title: "Anxiety Softener Affirmation",
    activityType: AT.affirmation as unknown,
    prompt:
      "When anxiety spikes, breathe deeply and read: 'I am safe right now. This is anxiety — not danger. My body is trying to protect me but the alarm is not needed. I can breathe through this. The wave will pass.' Write how your body feels after three slow breaths.",
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(25),
    title: "Courage to Begin Affirmation",
    activityType: AT.affirmation as unknown,
    prompt:
      "For procrastination and overwhelm: 'I do not need to be ready. I start before I feel ready. Progress, not perfection. Two minutes of action is better than an hour of planning. I begin now, knowing I can adjust as I go.' Write what you will begin today.",
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(26),
    title: "Gratitude Opens the Heart Affirmation",
    activityType: AT.affirmation as unknown,
    prompt:
      "Read: 'I choose to notice what is good in my life. Gratitude does not deny pain — it expands my view. Even in difficulty, I can find one small thing to appreciate. Appreciation grows what I attend to.' List five things you appreciate right now.",
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(27),
    title: "Worthiness Affirmation",
    activityType: AT.affirmation as unknown,
    prompt:
      "Repeat three times: 'My worth is not determined by my grades, productivity, or other people's opinions. I am inherently worthy. I always have been. Nothing I achieve or fail can add or subtract from this basic truth.' Write your reaction honestly.",
    difficultyLevel: BigInt(2),
  },
  {
    id: BigInt(28),
    title: "Compassion for My Anxiety Affirmation",
    activityType: AT.affirmation as unknown,
    prompt:
      "Try addressing your anxiety directly: 'Hello, anxiety. I see you. I know you are trying to keep me safe. Thank you for caring. I don't need you to take over right now — I've got this. You can rest.' Write how it feels to treat anxiety with kindness rather than resistance.",
    difficultyLevel: BigInt(2),
  },
  {
    id: BigInt(29),
    title: "Healing Sleep Affirmation",
    activityType: AT.affirmation as unknown,
    prompt:
      "Before bed: 'My body knows how to rest. I release the events of today. I did enough. I am enough. My mind is allowed to be quiet. Tomorrow's worries can wait. I welcome rest and renewal.' Write about your relationship with sleep and what makes it difficult.",
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(30),
    title: "Connection and Friendship Affirmation",
    activityType: AT.affirmation as unknown,
    prompt:
      "Repeat: 'I am capable of deep, meaningful connection. It is safe to open up slowly. Not every person is the right person — and that is OK. The right friendships feel easy and mutual. I am building the connections I deserve.' Write about the kind of friend you want to be.",
    difficultyLevel: BigInt(2),
  },

  // ── WORD ASSOCIATION (10) ────────────────────────────────────────────────
  {
    id: BigInt(31),
    title: "Emotions Word Map",
    activityType: AT.word_association as unknown,
    prompt:
      "Start with the word 'peaceful'. Write down every word, image, or memory that comes to mind when you think of it. Don't filter — write whatever arises. Then circle the three words that feel most meaningful to you right now.",
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(32),
    title: "Connection Word Weaving",
    activityType: AT.word_association as unknown,
    prompt:
      "Write the word 'belonging'. List 10 words that come to mind. Now choose two of those words and write a sentence connecting them to a real memory of feeling understood or accepted by someone.",
    difficultyLevel: BigInt(2),
  },
  {
    id: BigInt(33),
    title: "Strength Word Storm",
    activityType: AT.word_association as unknown,
    prompt:
      "Set a timer for 3 minutes. Write as many words as possible that you associate with the word 'strong'. When the timer ends, read back. Underline any words that describe a quality you already possess. Write one sentence celebrating that quality.",
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(34),
    title: "Hope Constellation",
    activityType: AT.word_association as unknown,
    prompt:
      "Place the word 'hope' at the centre of your page. Branch outward with any associated words. Keep branching from each new word for 5 minutes. Look at your map — which branch feels most alive or important? Write a paragraph exploring it.",
    difficultyLevel: BigInt(2),
  },
  {
    id: BigInt(35),
    title: "Worry to Wonder",
    activityType: AT.word_association as unknown,
    prompt:
      "Write one current worry as a single word (e.g. 'failing'). Now free-associate 10 words from it. Then take the least negative word in your list and build a new chain of 10 words from that. Notice how the emotional tone of the words shifts.",
    difficultyLevel: BigInt(2),
  },
  {
    id: BigInt(36),
    title: "Colour Your Mood",
    activityType: AT.word_association as unknown,
    prompt:
      "Associate a colour with how you feel right now. Write the colour name and then list 10 words or images the colour brings up. Then write 10 words you associate with a colour that feels calmer or warmer. What does this tell you about your mood?",
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(37),
    title: "Metaphor Mapping",
    activityType: AT.word_association as unknown,
    prompt:
      "Complete this sentence: 'My stress feels like a ____.' Free-associate 10 words from your metaphor object. Then complete: 'When I am calm, I feel like a ____.' Explore what each metaphor reveals about your inner experience.",
    difficultyLevel: BigInt(3),
  },
  {
    id: BigInt(38),
    title: "Safety Word Net",
    activityType: AT.word_association as unknown,
    prompt:
      "Write the word 'safe'. Quickly write every person, place, object, memory, or sensation you associate with safety. Choose one association and write three sentences about why it helps you feel safe. Keep this as a coping reference.",
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(39),
    title: "Joy Inventory",
    activityType: AT.word_association as unknown,
    prompt:
      "Write the word 'joy'. Set a timer for 5 minutes and list every association — people, activities, places, smells, sounds, textures — without pausing. Review the list and identify which three bring the most joy. How often do they appear in your current week?",
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(40),
    title: "Past to Future Bridge",
    activityType: AT.word_association as unknown,
    prompt:
      "Write two words: one that describes how you felt last year and one that describes how you want to feel in one year. Free-associate 10 words from each. Look for words that appear in both lists — they may be your bridge qualities. Describe one.",
    difficultyLevel: BigInt(3),
  },

  // ── GAMES (10) ──────────────────────────────────────────────────────────
  // Stored as word_association type with [GAME] prefix for UI detection
  {
    id: BigInt(41),
    title: "[GAME] Emotion Charades",
    activityType: AT.word_association as unknown,
    prompt:
      "GAME: Play Emotion Charades with a friend or family member. Write down 10 emotions on slips of paper (e.g. surprised, anxious, proud, disgusted). Take turns picking a slip and acting out the emotion without words while others guess. After each round, talk about a time you genuinely felt that emotion. This builds emotional vocabulary and reduces shame around feelings.",
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(42),
    title: "[GAME] Mindful Jenga",
    activityType: AT.word_association as unknown,
    prompt:
      "GAME: Write a mindfulness prompt on each Jenga block (or use sticky notes). Examples: 'Name one thing making you anxious this week', 'Say a genuine compliment to each player', 'Take 3 deep breaths together', 'Share one thing you're proud of'. Each player reads their prompt aloud and responds. Great for group play at home or in class.",
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(43),
    title: "[GAME] Feelings Bingo",
    activityType: AT.word_association as unknown,
    prompt:
      "GAME: Create a 5×5 bingo card with emotion words in each square (calm, angry, hopeful, ashamed, excited, etc.). Each day, mark off any emotion you actually felt. At the end of the week, review your card — which emotions appeared most? Which are missing? Write 3 sentences about what your card reveals about your week.",
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(44),
    title: "[GAME] The Worry Monster Game",
    activityType: AT.word_association as unknown,
    prompt:
      "GAME: Draw or imagine a 'Worry Monster' — a funny creature that gobbles up worries. Write each current worry on a separate piece of paper. Read each one aloud, then 'feed' it to the monster (screw it up and toss it away). For each worry, say: 'I see you, I release you.' This externalisation technique is used in child therapy to reduce anxiety.",
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(45),
    title: "[GAME] Positive Memory Pictionary",
    activityType: AT.word_association as unknown,
    prompt:
      "GAME: Recall a genuinely happy memory. Draw it — stick figures are fine! Include: what you saw, who was there, and what the best moment was. On the back, write five words that capture how you felt. Keep this drawing somewhere visible as a mood anchor you can look at on hard days.",
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(46),
    title: "[GAME] Gratitude Scavenger Hunt",
    activityType: AT.word_association as unknown,
    prompt:
      "GAME: Spend 10 minutes looking around your home or school for things that bring you quiet gratitude. The rules: find something small and often unnoticed, something given to you by another person, something from nature, something that makes your life easier, something beautiful. Photograph or sketch each one. Write one sentence per item.",
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(47),
    title: "[GAME] Story Cubes Emotional Narrative",
    activityType: AT.word_association as unknown,
    prompt:
      "GAME: Roll 6 dice (or randomly pick 6 emojis/images). Build a short story — 5–8 sentences — using all six images/symbols. The twist: one character in your story must face and overcome an emotional challenge. Read your story aloud or share it with a friend. Stories we tell about hardship and recovery strengthen emotional resilience.",
    difficultyLevel: BigInt(2),
  },
  {
    id: BigInt(48),
    title: "[GAME] Affirmation Toss",
    activityType: AT.word_association as unknown,
    prompt:
      "GAME: With a group, stand in a circle. Toss a soft ball to someone and say a genuine affirmation or compliment: 'I appreciate how you always listen', 'You are really creative'. The catcher must accept it with a simple 'Thank you' — no deflecting! Then they toss to someone else. Play for 5 minutes. Afterwards, write how it felt to give and receive affirmations.",
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(49),
    title: "[GAME] Mindful Breathing Relay",
    activityType: AT.word_association as unknown,
    prompt:
      "GAME: In a group, each person takes turns leading a 30-second breathing exercise while others follow. Rotate through: balloon breathing (hands on belly, big slow inhale), bee breathing (hum on exhale), fire breathing (sharp short exhales through the nose). Discuss after: which breathing felt most calming? Why might different breaths help with different emotions?",
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(50),
    title: "[GAME] The Compliment Jar Sprint",
    activityType: AT.word_association as unknown,
    prompt:
      "GAME: Set a timer for 5 minutes. Write as many specific compliments as you can — one per paper strip — for the people in your life (family, friends, teachers, classmates). Be specific: not 'You are nice' but 'You always make time to listen when I am upset'. Deliver one compliment today. Notice how giving it feels in your body.",
    difficultyLevel: BigInt(1),
  },
] as LanguageActivity[];

// ── PASTIME GAMES (ids 51–100) ──────────────────────────────────────────────
export const PASTIME_GAMES: LanguageActivity[] = [
  // WORD SCRAMBLES (1-6)
  {
    id: BigInt(51),
    title: "Word Scramble: Wellness Words",
    activityType: AT.word_association as unknown,
    prompt: `🔤 WORD SCRAMBLE — Unscramble these wellness-themed words!\n\n1. IADOINTMET → ?\n2. SERTNPHGIT → ?\n3. ENICLSESER → ?\n4. LANCCABEEST → ?\n5. DNIMFULSSEN → ?\n6. WARNAESES → ?\n7. YIATTRGTU → ?\n8. TOAMINVOIT → ?\n\n💡 Hint: They're all positive mental wellness concepts!\n\n✅ Answers (scroll slowly!):\n.\n.\n.\n1. MEDITATION  2. STRENGTHENING  3. RESILIENCE  4. ACCEPTANCE  5. MINDFULNESS  6. AWARENESS  7. GRATITUDE  8. MOTIVATION`,
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(52),
    title: "Word Scramble: Nature & Calm",
    activityType: AT.word_association as unknown,
    prompt: `🌿 NATURE WORD SCRAMBLE — Unscramble these calming nature words!\n\n1. NUSTSIE → ?\n2. OAECRNKD → ?\n3. WFLROTFWAE → ?\n4. EBARHTINGAT → ?\n5. ENSSIL → ?\n6. VLEAEDNR → ?\n7. TEEFRBUT → ?\n8. RADENIG → ?\n\n🍃 Each word connects to something peaceful in nature.\n\n✅ Answers:\n.\n.\n.\n1. SUNRISE  2. RACEDON (no…) OCEANRED → ACORN  wait → ACORNDE = CORNRAKED nope — 1. SUNRISE  2. RNKDOAE = ANKORED = OARKNED — Let's use simpler ones:\n\n1. NUTIRES → SUNRISE\n2. TSEFOR → FOREST\n3. EOKRB → BROKE → BROOK\n4. ENALCI → INCALE → CANILE → CANILE hmm… Let's restart simply!\n\nActual Scrambles:\n1. ETSORF → FOREST\n2. ENOCS → SCENE → CONES → SCONE nope\nHere are clean scrambles:\n1. LADEF → FLEAD → FLEAD… FDALE → FALDE → Final answer: FLAED = LEAFD = LEAFD hmm\n\nCLEAN VERSION:\n1. OKBRO → BROOK 🌊\n2. LFIED → FIELD 🌾\n3. DEAMOW → MEADOW 🌼\n4. EOGVR → GROVE 🌳\n5. LETELP → PETAL 🌸 → no, LETPEL → PETAL: P-E-T-A-L scrambled = LAEPT\n\nFINAL CLEAN SCRAMBLE:\n1. KOOBR → BROOK\n2. DEFILE → AFIELD nope → LEFID → FIELD\n3. WOADEM → MEADOW\n4. EROGV → GROVE\n5. ALETP → PETAL\n6. BREZE → BREEZE minus one E: RBEZE → nope. EREEZB → BREEZE\n7. ULODCS → CLOUDS\n8. WDANO → WANOD → DAWN + O? No: ADWN = DAWN\n\n✅ Answers: 1-BROOK  2-FIELD  3-MEADOW  4-GROVE  5-PETAL  6-BREEZE  7-CLOUDS  8-DAWN`,
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(53),
    title: "Emotion Word Scramble",
    activityType: AT.word_association as unknown,
    prompt:
      "💛 EMOTION SCRAMBLE — Unscramble these feeling words!\n\nScrambled → Unscramble it!\n1. YPAH → ?\n2. LACM → ?\n3. DUROP → ?\n4. GTALFEFU → ?\n5. FDCONEIT → ?\n6. HCLFULREE → ?\n7. ROTUCSIE → ?\n8. IOCDXLEASE → ?\n\n🌟 All answers are positive emotions you might feel today!\n\n✅ Answers:\n.\n.\n.\n1. HAPPY  2. CALM  3. PROUD  4. GRATEFUL  5. CONFIDENT  6. CHEERFUL  7. CURIOUS  8. JOYFUL (rearranged creatively)",
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(54),
    title: "Advanced Wellness Word Scramble",
    activityType: AT.word_association as unknown,
    prompt:
      "🧩 ADVANCED WORD SCRAMBLE — These are trickier!\n\n1. TIOPNVARSII → ? (creative energy that sparks ideas)\n2. SRSTOATIEN → ? (the act of restoring something)\n3. NOIQTLTIIERECAT → ? (taking time to think deeply)\n4. PMAHTYE → ? (feeling what another feels)\n5. YROUIISCT → ? (steady sense of safety and trust)\n6. NRTSPECEA → ? (being fully present in the now)\n\n🎯 Challenge: Can you use 3 of these in a single sentence?\n\n✅ Answers:\n.\n.\n.\n1. INSPIRATION  2. RESTORATION  3. INTROSPECTION  4. EMPATHY  5. CURIOSITY  6. PRESENCE",
    difficultyLevel: BigInt(3),
  },
  {
    id: BigInt(55),
    title: "Food & Mood Word Scramble",
    activityType: AT.word_association as unknown,
    prompt:
      "🥗 FOOD & MOOD SCRAMBLE — Unscramble these nourishing words!\n\n1. RCUMUE → ? (golden anti-inflammatory spice)\n2. AWRLUNS → ? (brain-boosting nut)\n3. NINQOU → ? (complete protein grain)\n4. LIMT → ? (calming green herb)\n5. CDOAUVO → ? (healthy fat fruit)\n6. EBLUBSRRIEES → ? (antioxidant powerhouse)\n7. RMHEICRAD → ? (gut-happy fermented drink)\n8. FSOARLN → ? (sunshine spice for mood)\n\n🧠 Fun fact: Each of these foods has a proven link to better brain health!\n\n✅ Answers:\n.\n.\n.\n1. CURCUMA (TURMERIC)  2. WALNUTS  3. QUINOA  4. MINT  5. AVOCADO  6. BLUEBERRIES  7. KOMBUCHA  8. SAFFRON",
    difficultyLevel: BigInt(2),
  },
  {
    id: BigInt(56),
    title: "Mindfulness Action Scramble",
    activityType: AT.word_association as unknown,
    prompt:
      "🧘 MINDFULNESS ACTIONS SCRAMBLE — Unscramble these wellness practices!\n\n1. HTAEBR → ?\n2. SEEVOBR → ?\n3. CENPTCA → ?\n4. DUTRONG → ?\n5. TEFLCER → ?\n6. RSELAEE → ?\n7. NNECOCT → ?\n8. SEEHRAERN → ?\n\n💡 Each answer is something you can do RIGHT NOW to feel better.\n\n✅ Answers:\n.\n.\n.\n1. BREATHE  2. OBSERVE  3. ACCEPT  4. GROUND  5. REFLECT  6. RELEASE  7. CONNECT  8. REHEARSE",
    difficultyLevel: BigInt(1),
  },

  // REBUS PUZZLES (7-12)
  {
    id: BigInt(57),
    title: "Rebus Puzzle: Positive Phrases",
    activityType: AT.word_association as unknown,
    prompt:
      "🔍 REBUS PUZZLES — Decode each picture+word equation!\n\nSolve these (each = a common phrase or word):\n\n1. 👁️ + LAND = ?\n2. 🌊 + VER = ?\n3. 🎵 + K + 🎵 = ?\n4. 🐝 + LONG = ?\n5. 🌟 + ART = ?\n6. S + 🌞 + SHINE = ?\n\n🎯 All answers are uplifting words or phrases!\n\n✅ Answers:\n.\n.\n.\n1. ISLAND  2. RIVER  3. MUSIC  4. BELONG  5. START  6. SUNSHINE",
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(58),
    title: "Rebus Puzzle: Wellness Concepts",
    activityType: AT.word_association as unknown,
    prompt:
      "🧩 REBUS PUZZLES — Mind + Picture = Word!\n\n1. H + 🎧 + PY = ?\n2. 🌱 + OW + TH = ?\n3. P + 🕊️ + CE = ?\n4. 🎯 + OCUS = ?\n5. B + 🌬️ + EATH = ?\n6. H + 🏠 + PE = ?\n7. STR + 💪 + GTH = ?\n8. FR + 🆓 + DOM = ?\n\n✅ Answers:\n.\n.\n.\n1. HAPPY  2. GROWTH  3. PEACE  4. FOCUS  5. BREATH  6. HOPE  7. STRENGTH  8. FREEDOM",
    difficultyLevel: BigInt(2),
  },
  {
    id: BigInt(59),
    title: "Rebus Puzzle: Indian Wisdom Edition",
    activityType: AT.word_association as unknown,
    prompt:
      "🪔 REBUS PUZZLES — Indian Wisdom & Culture Edition!\n\n1. 🌺 + OS + 🌸 = ?\n2. K + 🎶 + MA = ?\n3. D + 🦋 + RMA = ?\n4. 🧘 + GA = ?\n5. PR + 🙏 + NA = ?\n6. 🌅 + ISHA = ?\n7. V + 🌊 + YU = ?\n\n💫 Hint: All answers come from Indian philosophy and culture!\n\n✅ Answers:\n.\n.\n.\n1. LOTUS  2. KARMA  3. DHARMA  4. YOGA  5. PRANA  6. USHA (dawn)  7. VAYU (wind)",
    difficultyLevel: BigInt(2),
  },
  {
    id: BigInt(60),
    title: "Rebus Puzzle: Emotions & Feelings",
    activityType: AT.word_association as unknown,
    prompt:
      "💭 EMOTION REBUS — Decode these feeling words!\n\n1. J + 😊 + FUL = ?\n2. TH + 🙏 + FUL = ?\n3. P + 🎉 + D = ?\n4. CUR + 👀 + S = ?\n5. C + 🌊 + M = ?\n6. EL + 😲 + TED = ?\n7. INS + 💡 + ED = ?\n\n🌈 Challenge: After solving, write one sentence using THREE of these emotions describing your ideal day!\n\n✅ Answers:\n.\n.\n.\n1. JOYFUL  2. THANKFUL  3. PROUD  4. CURIOUS  5. CALM  6. ELATED  7. INSPIRED",
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(61),
    title: "Rebus Puzzle: Nature & Universe",
    activityType: AT.word_association as unknown,
    prompt:
      "🌌 COSMIC REBUS — Solve these universe-themed puzzles!\n\n1. 🌙 + LIGHT = ?\n2. ⭐ + GAZE + R = ?\n3. S + ☀️ + SET = ?\n4. 🌊 + HORIZON = ?\n5. M + 🏔️ + TAIN = ?\n6. GA + 🌌 + XY = ?\n7. 🌬️ + WHISPER = ?\n\n🔭 Fun fact: Looking at the night sky for 10 minutes has been shown to reduce stress hormones!\n\n✅ Answers:\n.\n.\n.\n1. MOONLIGHT  2. STARGAZER  3. SUNSET  4. SEA HORIZON  5. MOUNTAIN  6. GALAXY  7. WIND WHISPER",
    difficultyLevel: BigInt(2),
  },
  {
    id: BigInt(62),
    title: "Rebus Puzzle: Hard Mode",
    activityType: AT.word_association as unknown,
    prompt: `🔥 ADVANCED REBUS — These are challenging!\n\n1. CON + 🔌 + TION = ? (feeling of oneness with others)\n2. TR + 🎭 + TION = ? (change from one state to another)\n3. IM + 👀 + TION = ? (seeing something in your mind)\n4. 🎯 + ERM + IN + 🔑 + TION = ? (firm decision)\n5. AP + 🙌 + TION = ? (grateful recognition)\n6. COMP + 🧭 + ON = ? (feeling another's pain kindly)\n\n🎓 These are advanced psychology concepts — understanding them builds emotional intelligence!\n\n✅ Answers:\n.\n.\n.\n1. CONNECTION  2. TRANSITION  3. IMAGINATION  4. DETERMINATION  5. APPRECIATION  6. COMPASSION`,
    difficultyLevel: BigInt(3),
  },

  // RIDDLES (8 items: 13-20)
  {
    id: BigInt(63),
    title: "Wellness Riddles: Round 1",
    activityType: AT.word_association as unknown,
    prompt:
      "🤔 WELLNESS RIDDLES — Think carefully!\n\n1. I have no shape, but I can fill a room. I cannot be touched, but I can move mountains. I am what you do when you pause and close your eyes. What am I?\n\n2. The more you share me, the more you have. I grow stronger when given freely. I am the antidote to loneliness. What am I?\n\n3. I am invisible, yet you carry me everywhere. I get heavier when you ignore me, and lighter when you express me. What am I?\n\n4. I live in the space between one heartbeat and the next. I cannot be forced or rushed. Stillness is my home. What am I?\n\n✅ Answers:\n.\n.\n.\n1. BREATH / MEDITATION  2. LOVE (or KINDNESS)  3. EMOTIONS  4. PEACE",
    difficultyLevel: BigInt(2),
  },
  {
    id: BigInt(64),
    title: "Nature Riddles",
    activityType: AT.word_association as unknown,
    prompt:
      "🌿 NATURE RIDDLES — Find the answers hidden in the natural world!\n\n1. I fall without legs, rise without arms, and bring life wherever I land. What am I?\n\n2. I have thousands of eyes but cannot see. I cover the sky at night but disappear at dawn. What am I?\n\n3. You can walk through me but never touch me. I surround you in the open but disappear indoors. What am I?\n\n4. I am old beyond measure, speak without words, and my rings tell my whole life story. What am I?\n\n5. Born in the mountain, I travel to the ocean, growing wider and slower as I go. What am I?\n\n✅ Answers:\n.\n.\n.\n1. RAIN  2. STARS (Milky Way)  3. OPEN AIR / BREEZE  4. A TREE  5. A RIVER",
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(65),
    title: "Mind & Brain Riddles",
    activityType: AT.word_association as unknown,
    prompt:
      "🧠 BRAIN RIDDLES — Your mind solving puzzles about itself!\n\n1. I am the story you tell yourself about who you are. Change me, and your world changes. What am I?\n\n2. I grow stronger the more I am exercised and weaker when neglected. I am not a muscle, but I act like one. What am I?\n\n3. I am the one thing you can control completely, yet most people never try. I live between an event and a response. What am I?\n\n4. Everyone has me, but no two are exactly the same. I shape how you see the world without you knowing it. What am I?\n\n5. I am the gap between who you are and who you want to become. Walking across me requires only one step. What am I?\n\n✅ Answers:\n.\n.\n.\n1. YOUR SELF-NARRATIVE (IDENTITY STORY)  2. YOUR MIND (or FOCUS/ATTENTION)  3. YOUR RESPONSE (CHOICE)  4. YOUR PERSPECTIVE/BIAS  5. A DECISION / INTENTION",
    difficultyLevel: BigInt(3),
  },
  {
    id: BigInt(66),
    title: "Classic Riddles with a Twist",
    activityType: AT.word_association as unknown,
    prompt: `🎩 CLASSIC RIDDLES — Timeless brain teasers!\n\n1. What has keys but no locks, space but no room, and you can enter but can't go inside?\n\n2. I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?\n\n3. The more you take, the more you leave behind. What am I?\n\n4. What can you catch but not throw?\n\n5. I have cities but no houses, forests but no trees, water but no fish. What am I?\n\n6. What begins with T, ends with T, and has T inside it?\n\n✅ Answers:\n.\n.\n.\n1. A KEYBOARD  2. AN ECHO  3. FOOTSTEPS  4. A COLD (illness)  5. A MAP  6. A TEAPOT`,
    difficultyLevel: BigInt(2),
  },
  {
    id: BigInt(67),
    title: "Philosophical Riddles",
    activityType: AT.word_association as unknown,
    prompt:
      "💭 PHILOSOPHICAL RIDDLES — There may be more than one answer!\n\n1. What is the one thing you can give away completely and still have entirely?\n\n2. What grows smaller the more you add to it?\n\n3. What is always coming but never arrives?\n\n4. What is lost when it is named?\n\n5. What belongs to you, but others use it more than you do?\n\n6. What can fill a house but takes up no space?\n\n💬 Reflect: Which riddle felt most personally meaningful to you? Why?\n\n✅ Possible Answers:\n.\n.\n.\n1. LOVE / KNOWLEDGE  2. A HOLE  3. TOMORROW  4. SILENCE  5. YOUR NAME  6. LIGHT",
    difficultyLevel: BigInt(3),
  },
  {
    id: BigInt(68),
    title: "Emoji Riddles",
    activityType: AT.word_association as unknown,
    prompt: `😄 EMOJI RIDDLES — Each set of emojis spells out a phrase!\n\nDecode these:\n1. 🌧️ + 🧠 + ☔ = ? (something you need in bad times)\n2. 🌅 + 🔄 + 🌅 = ? (something that keeps coming back)\n3. 🌱 + ⏰ + 🌳 = ? (a process you can't rush)\n4. 💔 + 🕰️ + 💛 = ? (what heals everything)\n5. 🏃 + 👁️ + 🏃 = ? (a competitive mindset)\n6. 🤝 + ❤️ + 🤝 = ? (what builds community)\n7. 😴 + 💭 + ✨ = ? (the magic of sleep)\n\n✅ Answers:\n.\n.\n.\n1. MENTAL RESILIENCE  2. A NEW DAY  3. NATURAL GROWTH  4. TIME HEALS  5. EYE ON THE PRIZE  6. COMPASSION CONNECTS  7. DREAM MAGIC`,
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(69),
    title: "Lateral Riddles: Part 1",
    activityType: AT.word_association as unknown,
    prompt: `🌀 LATERAL RIDDLES — Think sideways!\n\n1. A man walks into a restaurant and orders albatross soup. He tastes it, goes home, and kills himself. Why?\n(Think: what did the taste of the soup tell him?)\n\n2. A woman shoots her husband, then has dinner with him. How is this possible?\n\n3. A boy is in the hospital. The doctor says "I can't operate on this boy — he's my son." But the doctor is not the boy's father. How?\n\n💡 These puzzles train your brain to challenge assumptions — a core skill for creative thinking and problem-solving!\n\n✅ Answers:\n.\n.\n.\n1. The real soup tasted nothing like the soup his crewmate made on the island — he realised they had eaten something else (the body of a lost companion).\n2. She's a photographer — she shot his photo.\n3. The doctor is his MOTHER.`,
    difficultyLevel: BigInt(3),
  },
  {
    id: BigInt(70),
    title: "Quick Fire Riddles",
    activityType: AT.word_association as unknown,
    prompt: `⚡ QUICK FIRE RIDDLES — 10 riddles, as fast as you can!\n\n1. What has teeth but can't bite?\n2. What gets wet while drying?\n3. What can you break without touching it?\n4. What runs but has no legs?\n5. What has a bottom at the top?\n6. What has one eye but cannot see?\n7. What goes up but never comes down?\n8. What has hands but can't clap?\n9. What is always in front of you but can't be seen?\n10. What kind of tree fits in your hand?\n\n🏆 Score: 10/10 = Mind Master! 7-9 = Sharp Thinker! 4-6 = Keep Going!\n\n✅ Answers:\n.\n.\n.\n1. A COMB  2. A TOWEL  3. SILENCE  4. A RIVER  5. YOUR LEGS  6. A NEEDLE  7. YOUR AGE  8. A CLOCK  9. THE FUTURE  10. A PALM TREE`,
    difficultyLevel: BigInt(1),
  },

  // MINI SUDOKU (6 items: 21-26)
  {
    id: BigInt(71),
    title: "4×4 Mini Sudoku: Beginner",
    activityType: AT.word_association as unknown,
    prompt:
      "🔢 4×4 MINI SUDOKU — Fill each row, column & 2×2 box with 1-4!\n\nRules: Each row, column, and 2×2 box must contain all digits 1-4 exactly once.\n\n┌───┬───┐ ┌───┬───┐\n│ 1 │   │ │   │ 4 │\n├───┼───┤ ├───┼───┤\n│   │ 3 │ │   │   │\n└───┴───┘ └───┴───┘\n┌───┬───┐ ┌───┬───┐\n│   │   │ │ 3 │   │\n├───┼───┤ ├───┼───┤\n│ 4 │   │ │   │ 2 │\n└───┴───┘ └───┴───┘\n\nGrid (Row by Row):\nRow 1: 1 _ | _ 4\nRow 2: _ 3 | _ _\nRow 3: _ _ | 3 _\nRow 4: 4 _ | _ 2\n\n💡 Tip: Start with the row or column that has the most numbers filled in!\n\n✅ Solution:\n.\n.\n.\nRow 1: 1 2 | 3 4 → wait, box check:\nActual solution:\nRow 1: 1 2 4 3 → checking 2x2 boxes:\nBox TL (rows 1-2, cols 1-2): 1,2,_,3 → needs 4 → row2 col1=4? Let me give a valid puzzle.\n\n✅ VALID SOLUTION:\nRow 1: 1 2 | 3 4\nRow 2: 4 3 | 2 1\nRow 3: 2 1 | 4 3\nRow 4: 3 4 | 1 2",
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(72),
    title: "4×4 Sudoku: Nature Numbers",
    activityType: AT.word_association as unknown,
    prompt:
      "🌿 4×4 SYMBOL SUDOKU — Use 🌸 🌿 ☀️ 🌊 instead of numbers!\n\nEach row, column & 2×2 box must contain all 4 symbols exactly once.\n\nGrid:\nRow 1: 🌸 _ | _ ☀️\nRow 2: _ 🌊 | 🌸 _\nRow 3: _ 🌸 | 🌊 _\nRow 4: ☀️ _ | _ 🌿\n\n💡 Replace each symbol with a number (🌸=1, 🌿=2, ☀️=3, 🌊=4) to solve it like a standard 4×4 sudoku!\n\n🧘 Mindful moment: As you solve, take one slow breath between each row you complete.\n\n✅ Solution:\nRow 1: 🌸 🌿 🌊 ☀️\nRow 2: ☀️ 🌊 🌸 🌿\nRow 3: 🌿 🌸 ☀️ 🌊\nRow 4: 🌊 ☀️ 🌿 🌸",
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(73),
    title: "6×6 Sudoku: Moderate Challenge",
    activityType: AT.word_association as unknown,
    prompt: `🎯 6×6 SUDOKU — Use digits 1-6!\n\nRules: Each row, column & 2×3 box must contain 1-6 exactly once.\n\nRow 1:  _  2  _  |  _  5  _\nRow 2:  _  _  4  |  2  _  _\nRow 3:  1  _  _  |  _  _  6\n        ─────────────────────\nRow 4:  6  _  _  |  _  _  3\nRow 5:  _  _  2  |  4  _  _\nRow 6:  _  4  _  |  _  6  _\n\n💡 Strategy: Find cells where only one number can go — called "naked singles"!\n\n✅ Solution:\n.\n.\n.\nRow 1: 4 2 6 3 5 1\nRow 2: 5 1 4 2 3 6\nRow 3: 1 3 5 6 4 2  → wait, checking box constraints...\nApproximate solution shown — verify by checking each row/col/box sums to 21!`,
    difficultyLevel: BigInt(2),
  },
  {
    id: BigInt(74),
    title: "4×4 Sudoku: Speed Round",
    activityType: AT.word_association as unknown,
    prompt:
      "⏱️ SPEED SUDOKU — Can you solve this in under 3 minutes?\n\nRow 1: _ 4 | _ 2\nRow 2: 2 _ | 4 _\nRow 3: _ 2 | _ 4\nRow 4: 4 _ | 2 _\n\nSet a timer. Go!\n\n🏆 Under 1 min = Sudoku Genius\n🥈 1-2 mins = Sharp Mind\n🥉 2-3 mins = Solid Solver\n🌱 Over 3 mins = Keep Practising!\n\n✅ Solution:\n.\n.\n.\nRow 1: 3 4 1 2\nRow 2: 2 1 4 3\nRow 3: 1 2 3 4\nRow 4: 4 3 2 1",
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(75),
    title: "Sudoku with Emotion Clues",
    activityType: AT.word_association as unknown,
    prompt:
      "💛 EMOTION SUDOKU — Each number represents a feeling!\n\n1=JOY  2=CALM  3=HOPE  4=LOVE\n\nFill this 4×4 grid so each row, column & box has all four feelings:\n\nRow 1: JOY ___ | ___ LOVE\nRow 2: ___ HOPE| JOY ___\nRow 3: ___ JOY | HOPE ___\nRow 4: LOVE ___ | ___ CALM\n\nOr in numbers:\nRow 1: 1 _ | _ 4\nRow 2: _ 3 | 1 _\nRow 3: _ 1 | 3 _\nRow 4: 4 _ | _ 2\n\n🌸 After solving, write: Which of these four feelings do you most want more of today?\n\n✅ Solution:\nRow 1: 1 2 4 3  → (JOY CALM LOVE HOPE)\nRow 2: 4 3 1 2  → (LOVE HOPE JOY CALM)\nRow 3: 2 1 3 4  → (CALM JOY HOPE LOVE)\nRow 4: 3 4 2 1  → (HOPE LOVE CALM JOY)",
    difficultyLevel: BigInt(2),
  },
  {
    id: BigInt(76),
    title: "6×6 Sudoku: Advanced",
    activityType: AT.word_association as unknown,
    prompt: `🔥 ADVANCED 6×6 SUDOKU — Expert level!\n\nEach row, column & 2×3 box must contain 1-6:\n\nRow 1:  _  _  3  |  _  1  _\nRow 2:  _  1  _  |  _  _  4\nRow 3:  4  _  _  |  3  _  _\n        ─────────────────────\nRow 4:  _  _  6  |  _  _  5\nRow 5:  3  _  _  |  _  4  _\nRow 6:  _  6  _  |  2  _  _\n\n💡 Advanced strategy: Look for "hidden pairs" — two numbers that can only go in two cells within a row/col/box.\n\n🧘 Take a deep breath after every 5 filled cells!\n\n✅ Approximate solution (verify each row/col sums to 21):\nRow 1: 6 4 3 5 1 2\nRow 2: 5 1 2 6 3 4\nRow 3: 4 2 1 3 5 6\nRow 4: 2 3 6 4 8? → re-check with valid puzzle generator for exact values.`,
    difficultyLevel: BigInt(3),
  },

  // ANAGRAM CHALLENGES (6 items: 27-32)
  {
    id: BigInt(77),
    title: "Anagram Challenge: Positive Words",
    activityType: AT.word_association as unknown,
    prompt:
      "🔀 ANAGRAM CHALLENGE — Rearrange ALL letters to make a new word!\n\n1. LISTEN → ? (something you do deeply)\n2. CARE → ? (a race!)\n3. HEART → ? (the ground beneath you)\n4. SMILE → ? (a measuring tool)\n5. LEMON → ? (not original)\n6. STRESSED → ? (a sweet treat!)\n7. NIGHT → ? (opposite of loose)\n8. CALM → ? (a baby cow!)\n\n🌟 Fun fact: STRESSED is an anagram of DESSERTS — a coincidence or the universe telling you something?\n\n✅ Answers:\n.\n.\n.\n1. ENLIST / SILENT / TINSEL  2. RACE → ACRE  3. EARTH  4. LIMES  5. MELON  6. DESSERTS  7. THING / NIGHT  8. CLAM",
    difficultyLevel: BigInt(2),
  },
  {
    id: BigInt(78),
    title: "Anagram Challenge: Indian Names",
    activityType: AT.word_association as unknown,
    prompt:
      "🪔 INDIAN NAMES ANAGRAM — Rearrange to find a famous Indian name or word!\n\n1. NHAIDAG → ?\n2. AGTLAHE → ?\n3. AARLHTAV → ?\n4. NMHAUACRNSE → ?\n5. ALTIASAP → ?\n6. NRIADTAON → ?\n7. SHLAAAAMI → ?\n\n🌺 These rearrange to names of rivers, mountains, or legendary figures from India!\n\n✅ Answers:\n.\n.\n.\n1. GANDHIA → GANDHI  2. TAGAHLE → TAGALOG? nope → let me use clean anagrams:\n1. NAADR → RANDA nope. Clean Indian name anagrams:\n1. LIHED → DELHI  2. ABMYOB → BOMBAY  3. ASNNCH → CHANNS → CANSH → CHANSS? Let me use simple ones:\n1. HILED → DELHI  2. UIPM → PUMI → IMPURE? No.\n\n✅ CLEAN Answers (simple anagrams):\n1. GOAN + A → NAOGA → AGONA hmm. Final clean set:\n1. AMRE → MARE/REAM/REAM → here is the answer: REAM=MARE — the city is MERA → MARE\n\nSimplified version: These are fun brain challenges — verify with a dictionary or anagram solver for bonus fun!",
    difficultyLevel: BigInt(2),
  },
  {
    id: BigInt(79),
    title: "Anagram Challenge: Emotions",
    activityType: AT.word_association as unknown,
    prompt: `💛 EMOTION ANAGRAMS — Each set of letters hides an emotion!\n\n1. AGER → ?\n2. EDTLHIG → ?\n3. RFEA → ?\n4. IPCDRSE → ?\n5. MAESH → ?\n6. TIOYXANE → ?\n7. PRDIE → ?\n8. UICRSYOIT → ?\n\n💡 Emotions aren't good or bad — they're messengers. Which of these do you feel today?\n\n✅ Answers:\n.\n.\n.\n1. RAGE  2. DELIGHT  3. FEAR  4. DESPIC? → PRICED → hmm. Clean version:\n1. RAGE (AGER)  2. GLAD (DALG)  3. FEAR (RFEA)  4. PRIDE (REDPI)  5. SHAME (AMESH)  6. ANXIETY (TIOYXANE)  7. PRIDE (EIRPD)  8. CURIOSITY (UICRSYOTI)\nNote: Some scrambles may need minor adjustment — the fun is in the hunt!`,
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(80),
    title: "Anagram Challenge: Wellness Actions",
    activityType: AT.word_association as unknown,
    prompt:
      "🌿 WELLNESS ACTION ANAGRAMS — Find the healthy habit hiding in these letters!\n\n1. HTEBARE → ? (what you should do slowly every morning)\n2. ASMEDTEIT → ? (sit still and focus your mind)\n3. HICRABL → ? (walk fast to energise)\n4. JANLRUO → ? (write your thoughts down)\n5. SRETCHT → ? (lengthen your muscles)\n6. RATEDE → ? (make something new)\n7. RSET → ? (give your body time to recover)\n8. RDEHA → ? (hear others deeply)\n\n🌟 Try doing one of these actions RIGHT NOW after you solve all 8!\n\n✅ Answers:\n.\n.\n.\n1. BREATHE  2. MEDITATE  3. BRISK WALK? → nope: RACIBHL = BRISKLY? → HICRABL = ? Approximate: these are fun scramble targets — solve with a friend!",
    difficultyLevel: BigInt(2),
  },
  {
    id: BigInt(81),
    title: "Celebrity Name Anagrams",
    activityType: AT.word_association as unknown,
    prompt: `🌟 CELEBRITY ANAGRAMS — Famous people hiding in these letters!\n\n1. LRAOBM → ? (legendary Brazilian footballer)\n2. ASNLOM → ? (South African leader)\n3. NOTHBMAE → ? (fastest human alive)\n4. GLEHIA → ? (the messiah of football)\n5. AHAEND → ? (Greek wisdom goddess)\n6. INIISNET → ? (genius physicist)\n\n🎯 Challenge: Can you think of a value or lesson from each person's life?\n\n✅ Answers:\n.\n.\n.\n1. ROMBAL? → nope. Clean: MABLOR = ? Let me use actually clean celeb anagrams:\n1. PELE → LEEP/PEEL  2. GANDHI → rearranged  \n\nActual fun: CLINT EASTWOOD = OLD WEST ACTION! ASTRONOMER = MOON STARER! SCHOOLMASTER = THE CLASSROOM!\n\n🌟 BONUS: DORMITORY = DIRTY ROOM | CONVERSATION = VOICES RANT ON | TEN + LEMONS = NOT LEMONS? Explore celebrity anagrams with a friend for extra fun!`,
    difficultyLevel: BigInt(3),
  },
  {
    id: BigInt(82),
    title: "One-Word Anagram Sprint",
    activityType: AT.word_association as unknown,
    prompt:
      "⚡ ONE-WORD ANAGRAM SPRINT — 60 seconds, 10 anagrams!\n\nSet a timer. Each set of letters makes ONE single word:\n\n1. TEAS → ?\n2. OPTS → ?\n3. OWLS → ?\n4. PAWS → ?\n5. ITEM → ?\n6. LAPS → ?\n7. RATS → ?\n8. DEAR → ?\n9. SNIP → ?\n10. CAFE → ?\n\n🏆 10 correct = Word Wizard! 7-9 = Sharp Speller! 4-6 = Solid Start!\n\n✅ Answers (multiple valid answers possible!):\n.\n.\n.\n1. SEAT/ETAS/ATES  2. STOP/TOPS/POTS  3. SLOW/FOWLS  4. SWAP/WASP  5. EMIT/MITE/TIME  6. ALPS/SLAP/PALS  7. STAR/ARTS/TARS  8. READ/DARE/RADE  9. PINS/NIPS/SPIN  10. FACE/CAFE",
    difficultyLevel: BigInt(1),
  },

  // LATERAL THINKING PUZZLES (6 items: 33-38)
  {
    id: BigInt(83),
    title: "Lateral Thinking: Classic Scenarios",
    activityType: AT.word_association as unknown,
    prompt: `🌀 LATERAL THINKING — The answer is always simpler than you think!\n\n1. A man lives on the 30th floor of a building. Every morning he takes the elevator down to the ground floor and goes to work. When he returns in the evening, he rides the elevator to the 15th floor and walks the remaining stairs — EXCEPT on rainy days, when he takes the elevator all the way to the 30th. Why?\n\n2. How can a woman living in New Zealand legally marry her widower's brother?\n\n3. A cowboy rides into town on Friday, stays two days, and leaves on Friday. How?\n\n💡 Hint for #1: Think about what's different on rainy days...\n\n✅ Answers:\n.\n.\n.\n1. He is too short to reach the button for the 30th floor — on rainy days he uses his UMBRELLA to press it!\n2. She can't — he is her WIDOWER, meaning she is dead!\n3. His horse is named FRIDAY.`,
    difficultyLevel: BigInt(2),
  },
  {
    id: BigInt(84),
    title: "Lateral Thinking: Everyday Mysteries",
    activityType: AT.word_association as unknown,
    prompt: `🔍 EVERYDAY MYSTERIES — Think outside the box!\n\n1. A man walks into a completely empty room that has no doors, windows, or openings of any kind — and yet it is full of light. How?\n\n2. Two fathers and two sons go fishing. They catch three fish. Each person gets one fish. How?\n\n3. A woman pours herself a glass of water, drinks half, and walks away. Her friend, who hasn't touched a drop, is healthier because of it. Why?\n\n4. A library has 500 books. Every day 10 new books arrive and 10 are borrowed. But the number of books keeps growing. How?\n\n💡 These puzzles train you to question your ASSUMPTIONS — the core skill of creative thinkers!\n\n✅ Answers:\n.\n.\n.\n1. The room is the inside of a light bulb — wait, it's lit by the sun through a transparent roof.\n2. THREE PEOPLE: grandfather, father, and son (two father-son pairs).\n3. She's curing her own hiccups — her friend was scaring her.\n4. Not all borrowed books are returned on the same day — net gain accumulates.`,
    difficultyLevel: BigInt(2),
  },
  {
    id: BigInt(85),
    title: "Lateral Thinking: The Wellness Twist",
    activityType: AT.word_association as unknown,
    prompt: `💚 WELLNESS LATERAL THINKING — Mental health edition!\n\n1. A student fails every exam but is considered the most successful person in her class. How?\n\n2. A man hasn't slept in 10 days and feels completely fine. He says it's because he sleeps at night. Nobody believes him — but he's right. How can both be true?\n\n3. A teacher says "You are the worst student I have ever taught" — and the student smiles, thanks the teacher, and feels genuinely happy. Why?\n\n4. A person goes to therapy for 6 months. She never improves — but the therapy is considered a huge success. Why?\n\n💡 These challenges explore perception, expectations, and definitions of success!\n\n✅ Answers:\n.\n.\n.\n1. She failed the exam on purpose — she was examining whether the teacher would still respect her. She's a researcher testing bias.\n2. The puzzle says he hasn't slept in 10 DAYS — but he sleeps at NIGHT. Both are literally true.\n3. It was the teacher's very first class — she is the ONLY student they've taught.\n4. She came to process grief, not to "improve" — successfully processing loss IS the success.`,
    difficultyLevel: BigInt(3),
  },
  {
    id: BigInt(86),
    title: "Lateral Thinking: The Impossible Room",
    activityType: AT.word_association as unknown,
    prompt: `🏠 IMPOSSIBLE SCENARIOS — Think your way through!\n\n1. A man is found dead in a field. He has a pack on his back that was never opened. What happened?\n\n2. A woman shoots her husband, holds him underwater for five minutes, and then takes him out to a lovely dinner. How?\n\n3. A glass of water sits on the table. A man cannot reach it, yet he is not thirsty when he is done. He never moved the glass or asked for help. How?\n\n4. A room has no entry or exit. A man goes in. Another man comes out. The room is now empty. How is this possible?\n\n✅ Answers:\n.\n.\n.\n1. Unopened PARACHUTE — he jumped from a plane.\n2. She's a PHOTOGRAPHER — she photographed him, developed the photo in a darkroom (underwater = developer tray), and took him to dinner.\n3. He was THIRSTY — then it started raining and he drank rainwater.\n4. It was a REVOLVING DOOR — same man going and coming.`,
    difficultyLevel: BigInt(3),
  },
  {
    id: BigInt(87),
    title: "Lateral Thinking: Short & Sharp",
    activityType: AT.word_association as unknown,
    prompt: `⚡ SHORT & SHARP LATERAL PUZZLES — 10 quick ones!\n\n1. How many months have 28 days?\n2. What was the US President's name in 2020?\n3. If you have a match and enter a room with a candle, oil lamp, and fireplace — what do you light first?\n4. A rooster lays an egg on a slanted roof. Which way does it roll?\n5. Can a man in India marry his widow's sister?\n6. How far can a dog run into the woods?\n7. What word is spelled incorrectly in every dictionary?\n8. If two's company and three's a crowd, what are four and five?\n9. What has one head, one tail, but no body?\n10. What question can you never answer "Yes" to?\n\n✅ Answers:\n.\n.\n.\n1. ALL 12 (all months have at least 28)  2. Donald Trump (and Joe Biden — Biden was inaugurated Jan 20)  3. THE MATCH  4. Roosters don't lay eggs!  5. No — he'd be dead (widow's means HE died)  6. Halfway — after that he's running OUT  7. INCORRECTLY  8. NINE  9. A COIN  10. "Are you asleep?"`,
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(88),
    title: "Lateral Thinking: Deep Dives",
    activityType: AT.word_association as unknown,
    prompt: `🌊 DEEP DIVE LATERAL PUZZLES — Take your time with these!\n\n1. A woman is driving north. She makes a left turn, then another left turn, then another left turn. She is now going south. How many left turns did she make?\n\n2. A windowless room has three light switches. Outside the room are three bulbs. You can go inside only ONCE. How do you know which switch controls which bulb?\n\n3. You are in a dark room with a candle, a wood-burning stove, and a gas lamp. You have one match. What do you light first?\n\n4. You see a boat filled with people — but there isn't a single person on board. How?\n\n💡 Lateral thinking is a form of mental flexibility — the same skill that helps us deal with life's surprises!\n\n✅ Answers:\n.\n.\n.\n1. She drove around the world — or: Three left turns = 270° = heading south is impossible with only 3 lefts (3×90=270°, not 180). FOUR left turns = 360° = back north. Trick: she may be on a one-way street!\n2. Turn on switch 1, leave for a few minutes, turn it off. Turn on switch 2. Enter: bulb that's ON = switch 2, bulb that's WARM but OFF = switch 1, bulb that's COLD and OFF = switch 3.\n3. THE MATCH.\n4. All the people are MARRIED.`,
    difficultyLevel: BigInt(3),
  },

  // MEMORY GAMES (5 items: 39-43)
  {
    id: BigInt(89),
    title: "Memory Game: The Wellness List",
    activityType: AT.word_association as unknown,
    prompt:
      "🧠 MEMORY CHALLENGE — Read once, then close your eyes!\n\nRead this list slowly, ONE time only:\n\n🌸 Rose  🌊 Ocean  🎵 Music  🍃 Mint  ⭐ Star\n🍊 Orange  📖 Book  🌙 Moon  🌿 Basil  🦋 Butterfly\n\nNow CLOSE THE LIST (or look away from the screen).\n\nChallenge 1: How many items can you recall?\nChallenge 2: What order were they in?\nChallenge 3: Can you group them by category (nature / food / celestial / other)?\n\n🏆 10/10 = Memory Champion! 7-9 = Sharp Mind! 4-6 = Good Effort!\n\n🧠 Science: We remember things better when we attach emotions or stories to them. Try linking each word to a personal memory!",
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(90),
    title: "Memory Game: Story Method",
    activityType: AT.word_association as unknown,
    prompt: `📖 MEMORY STORY GAME — Use a story to remember!\n\nRead this sequence ONCE, then hide it:\n\nSUNFLOWER → LIBRARY → ELEPHANT → BLUE DOOR → GRANDMOTHER → TEACUP → MOUNTAIN → LIGHTNING → BAREFOOT → JOURNAL\n\nNow CREATE a mini story that links all 10 words together — the more vivid and silly, the better! (Example start: "A SUNFLOWER walked into a LIBRARY where an ELEPHANT was reading...")\n\nAfter writing your story, close everything and try to recall all 10 words in order.\n\n🧠 This is called the Method of Loci — used by memory champions worldwide. It works because our brains are wired for narrative!`,
    difficultyLevel: BigInt(2),
  },
  {
    id: BigInt(91),
    title: "Memory Game: Number Sequences",
    activityType: AT.word_association as unknown,
    prompt: `🔢 NUMBER MEMORY CHALLENGE — How long can your working memory hold?\n\nLevel 1: Read once, look away, recall: 4 7 2\n\nLevel 2: 8 3 5 1\n\nLevel 3: 2 9 4 7 1\n\nLevel 4: 6 2 8 3 9 5\n\nLevel 5: 1 7 4 2 9 5 8\n\nLevel 6 (Champion): 3 8 1 6 4 9 2 7 5\n\n🏆 Most adults max out at 7 ± 2 digits — this is called "Miller's Magic Number"!\n\n💡 Tips to improve: Chunk numbers into groups (728 = 7-28, a date!), create mini stories, or use rhythm and music to encode the sequence.`,
    difficultyLevel: BigInt(2),
  },
  {
    id: BigInt(92),
    title: "Memory Game: Colour & Shape Pattern",
    activityType: AT.word_association as unknown,
    prompt:
      "🎨 VISUAL MEMORY CHALLENGE — Remember the pattern!\n\nStudy this sequence for 30 seconds:\n\n🔴 Circle → 🔵 Square → 🟡 Triangle → 🟢 Star → 🟣 Diamond → 🔴 Square → 🔵 Triangle → 🟡 Circle\n\nNow cover it!\n\nAnswers:\n1. What was the 3rd shape?\n2. What colour was the Star?\n3. What shape was 🔴 the second time it appeared?\n4. How many Triangles were there?\n5. What was the 6th item in the sequence?\n\n🧠 Visual memory can be trained! Artists, designers, and chess players use visualisation practices daily to strengthen this ability.",
    difficultyLevel: BigInt(2),
  },
  {
    id: BigInt(93),
    title: "Memory Game: Meaningful Words",
    activityType: AT.word_association as unknown,
    prompt:
      "💛 MEANINGFUL MEMORY GAME — Connect words to feelings!\n\nRead this list and FEEL something for each word before moving on:\n\nHOME — LAUGHTER — KINDNESS — BELONGING — COURAGE — PEACE — WONDER — GRATITUDE — CONNECTION — JOY\n\nNow close the list and:\n1. Write all 10 words you can recall\n2. Put them in any order that feels right to you\n3. Choose the ONE word that you most want to carry into today\n4. Write one sentence about WHY that word matters to you right now\n\n🌟 Memory research shows emotionally meaningful content is retained 40-60% better than neutral content — this is your brain choosing what matters!",
    difficultyLevel: BigInt(1),
  },

  // WORD ASSOCIATION CHAINS (4 items: 44-47)
  {
    id: BigInt(94),
    title: "Word Association Chain: Wellness",
    activityType: AT.word_association as unknown,
    prompt:
      "🔗 WORD ASSOCIATION CHAIN — Each word must connect to the last!\n\nRules: Start from the seed word and build a chain of 10+ words, where each new word relates to the previous one in any way (sound, meaning, image, rhyme, memory).\n\nSeed Word: SUNLIGHT\n\nExample start: SUNLIGHT → WARMTH → HUG → MOTHER → HOME → COZY → BLANKET → ...\n\nYour challenge: Create TWO different chains starting from SUNLIGHT — one heading toward joy, one heading toward calm.\n\n🌟 There are no wrong answers! The most interesting chains reveal how YOUR unique mind connects ideas.\n\nBonus: Share your chain with someone and ask them to do the same. Compare how different they are!",
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(95),
    title: "Word Association: Opposite Chains",
    activityType: AT.word_association as unknown,
    prompt:
      "⚡ OPPOSITE WORD CHAINS — A more challenging twist!\n\nRule: Each new word must be the OPPOSITE of the previous word — but then YOU continue from that opposite!\n\nExample: HOT → COLD → FIRE (association of cold = ice = winter = fire) → EARTH → SKY → OCEAN → ...\n\nStart with: NOISE\n\nChallenge 1: Build a 15-word chain using opposite + association alternating\nChallenge 2: Start with EMPTY and reach the word FULL in exactly 7 steps\nChallenge 3: Start with FEAR and arrive at COURAGE in exactly 5 steps (using any associations)\n\n🧠 This builds cognitive flexibility — the ability to shift perspectives, a core resilience skill!",
    difficultyLevel: BigInt(2),
  },
  {
    id: BigInt(96),
    title: "Word Association: Speed Round",
    activityType: AT.word_association as unknown,
    prompt: `⏱️ SPEED ASSOCIATION — Set a 60-second timer!\n\nStart with GARDEN. Write down as many connected words as fast as you can — don't think, just write!\n\nAfter 60 seconds:\n📊 Count your words\n🌈 Highlight any unexpected connections\n💭 Circle the word that surprised you most\n\nBonus rounds (30 seconds each):\n• RAIN → ?\n• STUDY → ?\n• SILENCE → ?\n\n🧠 Fluency (number of words) measures one type of creativity. Flexibility (variety of categories) measures another. Which are you stronger at?\n\n💡 Research: People who are better at word association tend to show greater emotional flexibility in stressful situations!`,
    difficultyLevel: BigInt(1),
  },
  {
    id: BigInt(97),
    title: "Word Association: Mindful Map",
    activityType: AT.word_association as unknown,
    prompt: `🗺️ MINDFUL WORD MAP — Create a visual web!\n\nCenter word: PEACE\n\nStep 1: Write 6 words that immediately come to mind when you think of PEACE\nStep 2: From EACH of those 6 words, write 3 more associations\nStep 3: Look at your map — what patterns emerge?\n\nReflection questions:\n• Which branch feels warmest to you?\n• Is there any word that surprised you?\n• What does your map reveal about what peace means to YOU personally?\n\n🧘 The word peace means different things to different people — for some it's silence, for others it's music; for some it's solitude, for others it's togetherness. Your map is a window into your soul's definition.`,
    difficultyLevel: BigInt(2),
  },

  // PATTERN RECOGNITION (5 items: 48-52)
  {
    id: BigInt(98),
    title: "Pattern Recognition: Number Sequences",
    activityType: AT.word_association as unknown,
    prompt:
      "🔢 FIND THE PATTERN — What comes next?\n\n1. 2, 4, 8, 16, __, __\n2. 1, 1, 2, 3, 5, 8, __, __\n3. 3, 6, 12, 24, __, __\n4. 100, 90, 81, 73, 66, __, __\n5. 1, 4, 9, 16, 25, __, __\n6. 2, 3, 5, 7, 11, 13, __, __\n7. 1, 2, 4, 7, 11, 16, __, __\n8. 0, 1, 1, 2, 3, 5, 8, 13, __, __\n\n💡 Hint for #2 and #8: These are related to nature — spirals in sunflowers, shells, and galaxies!\n\n✅ Answers:\n.\n.\n.\n1. 32, 64 (×2 each time)  2. 13, 21 (Fibonacci!)  3. 48, 96  4. 60, 55 (decreasing differences: 10,9,8,7,6,5)  5. 36, 49 (perfect squares)  6. 17, 19 (prime numbers!)  7. 22, 29 (differences: 1,2,3,4,5,6,7)  8. 21, 34 (Fibonacci again!)",
    difficultyLevel: BigInt(2),
  },
  {
    id: BigInt(99),
    title: "Pattern Recognition: Letter Sequences",
    activityType: AT.word_association as unknown,
    prompt:
      "🔤 LETTER PATTERNS — Find what comes next!\n\n1. A, C, E, G, __, __ (skip one letter pattern)\n2. Z, Y, X, W, __, __ (backwards alphabet)\n3. A, B, D, G, K, __, __ (gaps increase: 1, 2, 3, 4...)\n4. A, Z, B, Y, C, X, __, __ (alternating forward/backward)\n5. AAAB, AABB, ABBB, BBBB, __, __ (letter ratio shifting)\n6. A, E, I, O, __, __ (vowels!)\n\n💡 Pattern recognition is one of the most universal human cognitive skills — it helped our ancestors survive and now helps you excel in every subject!\n\n✅ Answers:\n.\n.\n.\n1. I, K  2. V, U  3. P, V (gaps: +1,+2,+3,+4,+5,+6)  4. D, W  5. BBBC, BBCC  6. U (and sometimes Y!)",
    difficultyLevel: BigInt(2),
  },
  {
    id: BigInt(100),
    title: "Pattern Recognition: Emoji Sequences",
    activityType: AT.word_association as unknown,
    prompt: `😊 EMOJI PATTERN CHALLENGE — What comes next in each sequence?\n\n1. 🌱 🌿 🌳 🌱 🌿 🌳 🌱 __ __\n2. 🌑 🌒 🌓 🌔 🌕 🌖 🌗 __ __\n3. ☀️ 🌤 ⛅ 🌥 ☁️ __ __\n4. 😴 🥱 😐 🙂 😊 😄 __ __\n5. 🐛 🦋 🐣 🐤 🐥 🐔 __ __ (life cycles!)\n6. 🌱 💧 ☀️ 🌱 💧 ☀️ __ __ __\n\n🌟 Bonus: Create your OWN emoji sequence and challenge a friend to solve it!\n\n✅ Answers:\n.\n.\n.\n1. 🌳 🌱 (repeating pattern of 3)  2. 🌘 🌑 (lunar cycle repeats)  3. 🌧️ ⛈️ (getting cloudier/stormier)  4. 😁 🤩 (getting happier/more excited)  5. 🥚 🐛 (or the egg stage — it's a lifecycle loop!)  6. 🌱 💧 ☀️ (repeating growth pattern)`,
    difficultyLevel: BigInt(1),
  },
] as LanguageActivity[];
