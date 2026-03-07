import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  ChefHat,
  ChevronDown,
  ChevronUp,
  Clock,
  Flame,
  FlameKindling,
  Leaf,
  Search,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { type Dish, MINDFUL_DISHES } from "../data/dishesData";

type Filter = "all" | "no-fire" | "cooked";

function NutrientBadge({ label }: { label: string }) {
  return (
    <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
      {label}
    </span>
  );
}

function TagBadge({ label }: { label: string }) {
  return (
    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
      #{label}
    </span>
  );
}

function DishCard({ dish, index }: { dish: Dish; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      data-ocid={`kitchen.item.${index + 1}`}
    >
      <Card
        className={cn(
          "rounded-2xl border-border/40 shadow-sm hover:shadow-md transition-shadow overflow-hidden",
          dish.noFire && "ring-1 ring-emerald-200",
        )}
      >
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-5 pb-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                    dish.noFire
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-orange-100 text-orange-600",
                  )}
                >
                  {dish.noFire ? (
                    <Leaf className="w-5 h-5" />
                  ) : (
                    <Flame className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="font-display font-semibold text-base leading-tight">
                    {dish.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {dish.tagline}
                  </p>
                </div>
              </div>

              {dish.noFire && (
                <Badge className="bg-emerald-100 text-emerald-700 border-0 rounded-full text-xs gap-1 flex-shrink-0">
                  <FlameKindling className="w-3 h-3" />
                  No Fire
                </Badge>
              )}
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Prep: {dish.prepTime}
              </span>
              {dish.cookTime !== "0 mins" && (
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  Cook: {dish.cookTime}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                Serves {dish.serves}
              </span>
            </div>

            {/* Benefit */}
            <div className="bg-blue-50 rounded-xl p-3 mb-3">
              <div className="flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-800 leading-relaxed">
                  {dish.benefit}
                </p>
              </div>
            </div>

            {/* Key Nutrients */}
            <div className="flex flex-wrap gap-1 mb-3">
              {dish.keyNutrients.map((n) => (
                <NutrientBadge key={n} label={n} />
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {dish.tags.map((t) => (
                <TagBadge key={t} label={t} />
              ))}
            </div>
          </div>

          {/* Expand button */}
          <div className="border-t border-border/40 px-5">
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="w-full flex items-center justify-between py-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              data-ocid={`kitchen.item.${index + 1}.toggle`}
            >
              <span className="flex items-center gap-1.5">
                <ChefHat className="w-4 h-4" />
                {expanded ? "Hide Recipe" : "View Full Recipe"}
              </span>
              {expanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Expandable recipe */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="border-t border-border/40 p-5 space-y-5 bg-muted/20">
                  {/* Ingredients */}
                  <div>
                    <h4 className="font-display font-semibold text-sm mb-3 flex items-center gap-1.5">
                      <Leaf className="w-4 h-4 text-emerald-600" />
                      Ingredients
                    </h4>
                    <ul className="space-y-1.5">
                      {dish.ingredients.map((ing) => (
                        <li
                          key={ing}
                          className="flex items-start gap-2 text-xs text-foreground"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Method */}
                  <div>
                    <h4 className="font-display font-semibold text-sm mb-3 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-orange-500" />
                      Cooking Method
                      {dish.noFire && (
                        <Badge className="ml-1 bg-emerald-100 text-emerald-700 border-0 rounded-full text-xs">
                          No Fire Needed
                        </Badge>
                      )}
                    </h4>
                    <ol className="space-y-3">
                      {dish.method.map((step, i) => (
                        <li
                          key={step.slice(0, 40)}
                          className="flex items-start gap-3"
                        >
                          <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <p className="text-xs text-foreground leading-relaxed">
                            {step}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function MindfulKitchenPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = MINDFUL_DISHES.filter((d) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "no-fire" && d.noFire) ||
      (filter === "cooked" && !d.noFire);

    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      d.name.toLowerCase().includes(q) ||
      d.tagline.toLowerCase().includes(q) ||
      d.tags.some((t) => t.includes(q)) ||
      d.benefit.toLowerCase().includes(q) ||
      d.keyNutrients.some((n) => n.toLowerCase().includes(q));

    return matchesFilter && matchesSearch;
  });

  const counts: Record<Filter, number> = {
    all: MINDFUL_DISHES.length,
    "no-fire": MINDFUL_DISHES.filter((d) => d.noFire).length,
    cooked: MINDFUL_DISHES.filter((d) => !d.noFire).length,
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
          <Leaf className="w-4 h-4 text-emerald-600" />
          Mindful Kitchen
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Indian Greens for Mental Well-Being
        </h1>
        <p className="text-muted-foreground text-sm max-w-xl">
          Traditional Indian vegetarian dishes curated specifically to reduce
          stress, anxiety, and depression. Every recipe uses greens and
          nutrient-dense ingredients with evidence-backed mood-supporting
          properties. Several can be prepared without any cooking fire.
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap gap-3 mt-4">
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
            <Leaf className="w-3.5 h-3.5" />
            {counts["no-fire"]} no-fire dishes
          </div>
          <div className="flex items-center gap-1.5 text-xs text-orange-700 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-full">
            <Flame className="w-3.5 h-3.5" />
            {counts.cooked} cooked dishes
          </div>
          <div className="flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            All 100% vegetarian
          </div>
        </div>
      </motion.div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dishes, nutrients, or benefits..."
            className="pl-9 h-11 rounded-xl"
            data-ocid="kitchen.search.input"
          />
        </div>
        <Tabs
          value={filter}
          onValueChange={(v) => setFilter(v as Filter)}
          className="w-full md:w-auto"
        >
          <TabsList className="h-11 rounded-xl bg-muted p-1 flex gap-1">
            <TabsTrigger
              value="all"
              className="rounded-lg text-xs px-4"
              data-ocid="kitchen.all.tab"
            >
              All ({counts.all})
            </TabsTrigger>
            <TabsTrigger
              value="no-fire"
              className="rounded-lg text-xs px-4"
              data-ocid="kitchen.nofire.tab"
            >
              <FlameKindling className="w-3.5 h-3.5 mr-1" />
              No Fire ({counts["no-fire"]})
            </TabsTrigger>
            <TabsTrigger
              value="cooked"
              className="rounded-lg text-xs px-4"
              data-ocid="kitchen.cooked.tab"
            >
              <Flame className="w-3.5 h-3.5 mr-1" />
              Cooked ({counts.cooked})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-5">
          {filtered.map((dish, i) => (
            <DishCard key={dish.id} dish={dish} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16" data-ocid="kitchen.empty_state">
          <Search className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-50" />
          <h3 className="font-display text-lg font-semibold mb-1">
            No dishes found
          </h3>
          <p className="text-muted-foreground text-sm">
            Try adjusting your search or filter.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              setSearch("");
              setFilter("all");
            }}
            data-ocid="kitchen.clear.button"
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
