import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  BookOpen,
  ClipboardList,
  GraduationCap,
  Heart,
  Shield,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";

const LOGO_SRC = "/assets/generated/lumi-arc-logo-transparent.dim_400x400.png";
import { motion } from "motion/react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const features = [
  {
    icon: ClipboardList,
    title: "DASS-21 Assessment",
    description:
      "Clinically validated questionnaire measuring stress, anxiety, and depression levels with precise scoring.",
    color: "bg-teal-100 text-teal-700",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description:
      "Visualize your mental wellness journey over time with trend charts and historical assessments.",
    color: "bg-sage-100 text-sage-600",
  },
  {
    icon: Users,
    title: "Guardian Connect",
    description:
      "Allow trusted teachers and parents to monitor your wellbeing and provide timely support.",
    color: "bg-purple-100 text-purple-700",
  },
  {
    icon: BookOpen,
    title: "Curated Resources",
    description:
      "Access books, articles, podcasts, and activities specifically chosen to support student mental health.",
    color: "bg-rose-100 text-rose-700",
  },
  {
    icon: Activity,
    title: "Wellness Activities",
    description:
      "Engage with journaling prompts, word associations, and affirmations to build emotional resilience.",
    color: "bg-amber-100 text-amber-700",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description:
      "Your data stays private. Built on the Internet Computer with end-to-end security.",
    color: "bg-blue-100 text-blue-700",
  },
];

const testimonials = [
  {
    name: "Priya S.",
    role: "University Student",
    text: "Lumi Arc helped me realize I was dealing with more anxiety than I knew. The resources section gave me practical tools that actually work.",
    stars: 5,
  },
  {
    name: "Mr. Thomas R.",
    role: "University Counselor",
    text: "Being able to check on my students' wellbeing trends has made a real difference. I can intervene earlier and more meaningfully.",
    stars: 5,
  },
  {
    name: "Ananya M.",
    role: "Parent",
    text: "As a parent, having visibility into my child's mental health check-ins — with their permission — gives me peace of mind and opens conversations.",
    stars: 5,
  },
];

const roles = [
  {
    icon: GraduationCap,
    title: "Student",
    description:
      "Access your personal dashboard, track your mood daily, complete DASS-21 assessments, and explore 100+ curated wellness resources.",
    buttonLabel: "Student Portal",
    roleParam: "student",
    bg: "bg-teal-50 border-teal-200",
    iconBg: "bg-teal-100 text-teal-600",
    btnClass: "bg-teal-600 hover:bg-teal-700 text-white",
    ocid: "landing.student.button",
  },
  {
    icon: Users,
    title: "Teacher",
    description:
      "View class-level wellness reports, identify at-risk students at a glance, and click into individual profiles for a detailed view.",
    buttonLabel: "Teacher Dashboard",
    roleParam: "teacher",
    bg: "bg-sage-50 border-sage-200",
    iconBg: "bg-sage-100 text-sage-600",
    btnClass: "bg-sage-600 hover:bg-sage-700 text-white",
    ocid: "landing.teacher.button",
  },
  {
    icon: Heart,
    title: "Parent / Guardian",
    description:
      "Monitor your child's mood history, daily habit streaks, XP progress, and wellness badges — all updated in real time.",
    buttonLabel: "Guardian View",
    roleParam: "guardian",
    bg: "bg-rose-50 border-rose-200",
    iconBg: "bg-rose-100 text-rose-600",
    btnClass: "bg-rose-500 hover:bg-rose-600 text-white",
    ocid: "landing.guardian.button",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  const goToLogin = (roleParam: string) => {
    navigate({ to: "/login/$role", params: { role: roleParam } });
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center mesh-bg">
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-teal-200/30 blur-3xl" />
          <div className="absolute top-1/2 -left-48 w-80 h-80 rounded-full bg-sage-200/25 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-rose-200/20 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div
                initial="hidden"
                animate="visible"
                custom={0}
                variants={fadeUp}
                className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
              >
                <img src={LOGO_SRC} alt="" className="w-5 h-5 object-contain" />
                Clinically-informed mental wellness
              </motion.div>

              <motion.h1
                initial="hidden"
                animate="visible"
                custom={1}
                variants={fadeUp}
                className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6"
              >
                Your bridge to{" "}
                <span className="text-teal-600 relative">
                  mental
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 200 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 8 Q50 2 100 6 Q150 10 198 4"
                      stroke="oklch(0.42 0.09 195)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                      opacity="0.5"
                    />
                  </svg>
                </span>{" "}
                wellness
              </motion.h1>

              <motion.p
                initial="hidden"
                animate="visible"
                custom={2}
                variants={fadeUp}
                className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg"
              >
                Lumi Arc helps students understand their mental health through
                validated assessments, track their progress over time, and
                connect with curated resources — all in a safe, private
                environment.
              </motion.p>

              <motion.div
                initial="hidden"
                animate="visible"
                custom={3}
                variants={fadeUp}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Button
                  onClick={() => goToLogin("student")}
                  size="lg"
                  className="h-12 px-8 rounded-xl bg-primary text-primary-foreground shadow-teal hover:shadow-teal-lg font-medium text-base"
                  data-ocid="landing.primary_button"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 rounded-xl border-border/60 font-medium text-base"
                  onClick={() =>
                    document
                      .getElementById("who-is-lumi-arc-for")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  data-ocid="landing.secondary_button"
                >
                  Who is it for?
                </Button>
              </motion.div>

              <motion.div
                initial="hidden"
                animate="visible"
                custom={4}
                variants={fadeUp}
                className="flex items-center gap-6 mt-10"
              >
                {[
                  { label: "Students Supported", value: "2,400+" },
                  { label: "Resources Available", value: "100+" },
                  { label: "Universities Connected", value: "38" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="font-display text-2xl font-bold text-teal-700">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-lg">
                <img
                  src="/assets/generated/hero-mindbridge.dim_1200x600.jpg"
                  alt="Lumi Arc — Mental wellness landscape"
                  className="w-full h-[460px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 to-transparent" />
              </div>

              {/* Floating card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="absolute -bottom-6 -left-6 glass-card rounded-2xl p-4 shadow-md max-w-[200px]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span className="text-sm font-semibold">Wellbeing Score</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mb-1">
                  <div className="bg-teal-500 h-2 rounded-full w-3/4 transition-all" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Improving this week
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="absolute -top-6 -right-6 glass-card rounded-2xl p-4 shadow-md"
              >
                <div className="flex items-center gap-1 text-yellow-500 mb-1">
                  <Star className="w-3 h-3 fill-yellow-500" />
                  <Star className="w-3 h-3 fill-yellow-500" />
                  <Star className="w-3 h-3 fill-yellow-500" />
                  <Star className="w-3 h-3 fill-yellow-500" />
                  <Star className="w-3 h-3 fill-yellow-500" />
                </div>
                <p className="text-xs font-medium">
                  Trusted by students & educators
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who is Lumi Arc for? */}
      <section
        id="who-is-lumi-arc-for"
        className="py-24 bg-gradient-to-b from-background to-muted/20"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-14"
          >
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              Who is Lumi Arc for?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Lumi Arc serves everyone in the university wellness ecosystem —
              students, teachers, and parents — each with their own tailored
              experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {roles.map((role, i) => {
              const Icon = role.icon;
              return (
                <motion.div
                  key={role.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i * 0.1}
                  variants={fadeUp}
                  className={`rounded-2xl border p-8 flex flex-col ${role.bg}`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${role.iconBg}`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-3">
                    {role.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                    {role.description}
                  </p>
                  <Button
                    onClick={() => goToLogin(role.roleParam)}
                    data-ocid={role.ocid}
                    className={`w-full rounded-xl font-medium ${role.btnClass}`}
                  >
                    {role.buttonLabel}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              Everything you need to thrive
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Built with evidence-based tools and compassionate design, Lumi Arc
              supports students through every step of their mental wellness
              journey.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i * 0.05}
                  variants={fadeUp}
                  className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-border/40"
                  data-ocid={`features.item.${i + 1}`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2">
                    {f.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {f.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              Stories of growth
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Real experiences from students, teachers, and parents using Lumi
              Arc.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.1}
                variants={fadeUp}
                className="bg-card rounded-2xl p-6 shadow-sm border border-border/40"
                data-ocid={`testimonials.item.${i + 1}`}
              >
                <div className="flex items-center gap-1 text-yellow-500 mb-4">
                  {Array.from({ length: t.stars }, (_, j) => (
                    <Star
                      key={`star-${t.name}-${j}`}
                      className="w-4 h-4 fill-yellow-500"
                    />
                  ))}
                </div>
                <p className="text-foreground mb-4 leading-relaxed italic">
                  "{t.text}"
                </p>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary/5 mesh-bg">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ready to start your journey?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8 text-lg">
              It only takes a few minutes to complete your first assessment and
              get personalized insights and resources.
            </p>
            <Button
              onClick={() => goToLogin("student")}
              size="lg"
              className="h-14 px-10 rounded-xl bg-primary text-primary-foreground shadow-teal-lg font-medium text-lg"
              data-ocid="landing.cta_button"
            >
              Begin Assessment
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>
      {/* DASS-21 Acknowledgement */}
      <footer className="py-8 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4">
          <p className="text-xs text-muted-foreground text-center leading-relaxed max-w-3xl mx-auto">
            <span className="font-semibold">Acknowledgement:</span> The DASS-21
            (Depression Anxiety Stress Scales – 21 item version) used in this
            application is based on the work of Lovibond, S.H. &amp; Lovibond,
            P.F. (1995).{" "}
            <em>Manual for the Depression Anxiety Stress Scales</em> (2nd ed.).
            Sydney: Psychology Foundation of Australia. The DASS is a clinically
            validated, freely available psychometric instrument widely used in
            research and clinical settings. It is reproduced here for
            educational and self-awareness purposes only, in accordance with its
            open-access usage terms.
          </p>
        </div>
      </footer>
    </div>
  );
}
