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

  // ── ACTIVITIES ─────────────────────────────────────────────────────────────
  {
    id: BigInt(71),
    title: "4-7-8 Breathing: The Calming Breath Exercise",
    description:
      "Learn the evidence-based 4-7-8 breathing technique developed by Dr. Andrew Weil. This simple activity activates the parasympathetic nervous system, reducing stress in minutes.",
    url: "https://www.drweil.com/health-wellness/body-mind-spirit/stress-anxiety/breathing-three-exercises/",
    category: Type__1.activity,
    tags: ["breathing", "relaxation", "quick relief", "nervous system"],
  },
  {
    id: BigInt(72),
    title: "Progressive Muscle Relaxation for Students",
    description:
      "A guided activity that systematically tenses and relaxes muscle groups, releasing physical tension stored from academic stress. Takes only 15 minutes and can be done anywhere.",
    url: "https://www.anxietycanada.com/articles/how-to-do-progressive-muscle-relaxation/",
    category: Type__1.activity,
    tags: ["relaxation", "body scan", "tension relief", "stress"],
  },
  {
    id: BigInt(73),
    title: "5-4-3-2-1 Grounding Technique",
    description:
      "Interrupt anxiety or panic by naming 5 things you see, 4 you hear, 3 you can touch, 2 you smell, and 1 you taste. Instantly anchors you to the present moment.",
    url: "https://www.healthline.com/health/grounding-techniques",
    category: Type__1.activity,
    tags: ["grounding", "anxiety", "panic", "present moment"],
  },
  {
    id: BigInt(74),
    title: "Body Scan Meditation",
    description:
      "A 20-minute guided body scan from the UCLA Mindful Awareness Research Center — systematically releasing tension and cultivating body-mind connection.",
    url: "https://www.uclahealth.org/programs/marc/free-guided-meditations/guided-meditations",
    category: Type__1.activity,
    tags: ["body scan", "meditation", "tension", "mindfulness"],
  },
  {
    id: BigInt(75),
    title: "Loving-Kindness Meditation (Metta)",
    description:
      "Buddhist-derived practice shown to reduce self-criticism and loneliness. Start by sending warmth to yourself, then gradually extend it to friends, strangers, and even difficult people.",
    url: "https://ggia.berkeley.edu/practice/loving_kindness_meditation",
    category: Type__1.activity,
    tags: ["loving-kindness", "compassion", "loneliness", "meditation"],
  },
  {
    id: BigInt(76),
    title: "Mindful Walking in Nature",
    description:
      "A structured mindful walking exercise combining the proven benefits of green-space exposure with present-moment awareness. Follow the step-by-step audio guide.",
    url: "https://www.mindful.org/daily-mindful-walking-practice/",
    category: Type__1.activity,
    tags: ["walking", "nature", "mindfulness", "mood"],
  },
  {
    id: BigInt(77),
    title: "Expressive Drawing: Emotions on Paper",
    description:
      "Art therapy exercise where you draw your current emotional state without judging the result. Research shows this reduces negative affect and increases emotional insight within minutes.",
    url: "https://www.arttherapy.org/upload/2017Ethics/ExpressiveArts.pdf",
    category: Type__1.activity,
    tags: ["art therapy", "drawing", "emotions", "insight"],
  },
  {
    id: BigInt(78),
    title: "Box Breathing (Navy SEAL Technique)",
    description:
      "Inhale 4 counts, hold 4, exhale 4, hold 4 — repeated 4 times. Used by high-performance athletes and military personnel to calm the stress response in seconds.",
    url: "https://www.healthline.com/health/box-breathing",
    category: Type__1.activity,
    tags: ["breathing", "stress", "performance", "quick relief"],
  },
  {
    id: BigInt(79),
    title: "Free-Form Dance Break",
    description:
      "A 5-minute guided dance activity to your favourite song. Dance/movement therapy evidence shows it reduces cortisol, improves mood, and promotes body confidence.",
    url: "https://www.psychologytoday.com/us/therapy-types/dance-movement-therapy",
    category: Type__1.activity,
    tags: ["dance", "movement", "cortisol", "joy"],
  },
  {
    id: BigInt(80),
    title: "Gratitude Letter Writing",
    description:
      "Write a one-page letter of gratitude to someone who has positively impacted your life. Research shows that writing (even unsent) produces lasting mood improvements.",
    url: "https://ggia.berkeley.edu/practice/gratitude_letter",
    category: Type__1.activity,
    tags: ["gratitude", "writing", "connection", "mood"],
  },
  {
    id: BigInt(81),
    title: "Guided Imagery: Safe Place Visualisation",
    description:
      "Close your eyes and vividly imagine a place where you feel completely safe and calm. This CBT technique reduces acute anxiety and builds an internal emotional anchor.",
    url: "https://www.anxietycanada.com/articles/how-to-use-guided-imagery/",
    category: Type__1.activity,
    tags: ["guided imagery", "visualisation", "anxiety", "CBT"],
  },
  {
    id: BigInt(82),
    title: "The STOPP Technique for Emotional Regulation",
    description:
      "Stop, Take a breath, Observe, Pull back, Practise. A 5-step CBT-based pause strategy to interrupt automatic reactions and respond thoughtfully in stressful situations.",
    url: "https://www.getselfhelp.co.uk/stopp/",
    category: Type__1.activity,
    tags: ["CBT", "emotional regulation", "reactions", "pause"],
  },
  {
    id: BigInt(83),
    title: "Mindful Colouring for Stress Relief",
    description:
      "Download free mandala colouring sheets and enter a state of flow. Research links mindful colouring to reduced anxiety, improved focus, and creative self-expression.",
    url: "https://www.verywellmind.com/benefits-of-adult-coloring-for-stress-relief-4769498",
    category: Type__1.activity,
    tags: ["colouring", "flow", "anxiety", "creativity"],
  },
  {
    id: BigInt(84),
    title: "Cold Water Face Splash (TIPP Skill)",
    description:
      "Part of DBT's TIPP skills: splashing cold water on your face triggers the dive reflex, slowing heart rate by up to 10% within 30 seconds. Fast relief for intense emotions.",
    url: "https://dialecticalbehaviortherapy.com/distress-tolerance/tipp/",
    category: Type__1.activity,
    tags: ["DBT", "TIPP", "crisis", "body-based"],
  },
  {
    id: BigInt(85),
    title: "Tai Chi for Stress Reduction: Beginner Routine",
    description:
      "A 10-minute beginner tai chi flow combining slow, flowing movements with deep breathing. Evidence shows it reduces cortisol and improves balance and wellbeing.",
    url: "https://www.health.harvard.edu/mind-and-mood/tai-chi-for-stress-management",
    category: Type__1.activity,
    tags: ["tai chi", "movement", "cortisol", "balance"],
  },
  {
    id: BigInt(86),
    title: "Journaling Prompts: Emotional Processing",
    description:
      "30 evidence-based journaling prompts drawn from James Pennebaker's expressive writing research — designed to help students process difficult emotions and gain perspective.",
    url: "https://positivepsychology.com/journaling-prompts/",
    category: Type__1.activity,
    tags: ["journaling", "prompts", "emotional processing", "Pennebaker"],
  },
  {
    id: BigInt(87),
    title: "Stretching Routine for Anxiety Relief",
    description:
      "A 15-minute gentle stretch sequence targeting the hip flexors, chest, and shoulders — areas where stress is stored. Each stretch is paired with a calming breathwork instruction.",
    url: "https://www.healthline.com/health/stretches-for-anxiety",
    category: Type__1.activity,
    tags: ["stretching", "anxiety", "body", "relaxation"],
  },
  {
    id: BigInt(88),
    title: "Random Acts of Kindness Challenge",
    description:
      "Complete one small act of kindness each day for a week. Research from Sonja Lyubomirsky shows prosocial behaviour is one of the fastest routes to improved mood and meaning.",
    url: "https://ggia.berkeley.edu/practice/performing_acts_of_kindness",
    category: Type__1.activity,
    tags: ["kindness", "prosocial", "mood", "meaning"],
  },
  {
    id: BigInt(89),
    title: "Gratitude Jar Activity",
    description:
      "Write one gratitude on a slip of paper each day and add it to a jar. On bad days, read them back. A tangible, ritualistic practice that builds long-term positive bias.",
    url: "https://www.verywellmind.com/the-gratitude-jar-4588050",
    category: Type__1.activity,
    tags: ["gratitude", "ritual", "positive bias", "practical"],
  },
  {
    id: BigInt(90),
    title: "Yoga Nidra: Yogic Sleep for Deep Relaxation",
    description:
      "A 20-minute guided Yoga Nidra session inducing a hypnagogic state between waking and sleep — shown to reduce anxiety, PTSD symptoms, and chronic stress.",
    url: "https://www.yogajournal.com/practice/beginners/beginners-guide-yoga-nidra/",
    category: Type__1.activity,
    tags: ["yoga nidra", "deep relaxation", "sleep", "anxiety"],
  },
  {
    id: BigInt(91),
    title: "Morning Routine Builder for Mental Health",
    description:
      "Evidence-based guide to building a 10-minute morning routine combining light exposure, movement, and intention-setting to regulate circadian rhythm and mood.",
    url: "https://www.healthline.com/health/healthy-morning-routine",
    category: Type__1.activity,
    tags: ["morning routine", "circadian rhythm", "mood", "habits"],
  },
  {
    id: BigInt(92),
    title: "Nature Journaling: Observational Drawing",
    description:
      "Take a notebook outside and sketch leaves, birds, or sky. Combining nature exposure with focused observation activates the parasympathetic system and reduces rumination.",
    url: "https://www.arttherapy.org/upload/2017Ethics/ExpressiveArts.pdf",
    category: Type__1.activity,
    tags: ["nature", "drawing", "observation", "rumination"],
  },
  {
    id: BigInt(93),
    title: "Digital Detox: 24-Hour Challenge",
    description:
      "A structured guide to a one-day phone-free experience, including preparation, replacement activities, and reflection prompts. Designed to reset attention and reduce anxiety.",
    url: "https://www.psychologytoday.com/us/blog/mental-wealth/201402/digital-detox",
    category: Type__1.activity,
    tags: ["digital detox", "screen time", "attention", "anxiety"],
  },
  {
    id: BigInt(94),
    title: "Compassionate Self-Talk Practice",
    description:
      "When you notice harsh self-criticism, pause and respond the way you'd talk to a dear friend in the same situation. Daily practice rewires self-talk patterns in 4 weeks.",
    url: "https://self-compassion.org/exercise-1-treat-yourself-like-good-friend/",
    category: Type__1.activity,
    tags: ["self-compassion", "self-talk", "inner critic", "habit"],
  },
  {
    id: BigInt(95),
    title: "Sound Bath Listening Session",
    description:
      "A 30-minute guided sound bath using Tibetan singing bowls and binaural beats. Auditory stimulation at 40Hz is linked to reduced anxiety and improved sleep architecture.",
    url: "https://www.healthline.com/health/sound-healing",
    category: Type__1.activity,
    tags: ["sound bath", "binaural beats", "anxiety", "sleep"],
  },
  {
    id: BigInt(96),
    title: "Five Senses Mindfulness Break",
    description:
      "Pause for two minutes and fully attend to each sense one at a time: sight, sound, smell, taste, touch. Resets focus after prolonged studying and reduces mental fatigue.",
    url: "https://www.mindful.org/a-five-senses-exercise/",
    category: Type__1.activity,
    tags: ["mindfulness", "senses", "focus", "fatigue"],
  },
  {
    id: BigInt(97),
    title: "Coherent Breathing: 5 Breaths Per Minute",
    description:
      "Breathe in for 5 counts and out for 5 counts for 10 minutes. This pacing synchronises heart rate variability with the body's natural resonance frequency, deeply calming the nervous system.",
    url: "https://coherentbreathing.com/",
    category: Type__1.activity,
    tags: ["breathing", "HRV", "nervous system", "calm"],
  },
  {
    id: BigInt(98),
    title: "Bibliotherapy Reading List for Teens",
    description:
      "A curated reading list of novels, memoirs, and short stories selected for their therapeutic value in addressing depression, isolation, identity, and hope — with reading guides.",
    url: "https://www.readingagency.org.uk/individuals/bibliotherapy.html",
    category: Type__1.activity,
    tags: ["reading", "bibliotherapy", "depression", "hope"],
  },
  {
    id: BigInt(99),
    title: "Origami as Mindful Focus",
    description:
      "Follow step-by-step origami instructions for a crane, lotus, or heart. Repetitive, precise folding induces flow state and reduces cortisol — no experience needed.",
    url: "https://www.origami-instructions.com/",
    category: Type__1.activity,
    tags: ["origami", "flow", "focus", "cortisol"],
  },
  {
    id: BigInt(100),
    title: "Acts of Self-Care: Weekly Planner",
    description:
      "A downloadable weekly self-care planner with daily prompts across five domains — physical, emotional, social, creative, and spiritual — to build holistic wellness habits.",
    url: "https://positivepsychology.com/self-care-worksheets/",
    category: Type__1.activity,
    tags: ["self-care", "planner", "weekly", "holistic"],
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
