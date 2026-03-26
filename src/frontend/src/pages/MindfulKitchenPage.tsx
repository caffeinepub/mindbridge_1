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
  Cookie,
  Flame,
  FlameKindling,
  GlassWater,
  Leaf,
  Search,
  Soup,
  Sparkles,
  Sunrise,
  Users,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { type Dish, MINDFUL_DISHES } from "../data/dishesData";

type Filter =
  | "all"
  | "no-fire"
  | "cooked"
  | "snack"
  | "drink"
  | "soup"
  | "breakfast";

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
                    dish.category === "breakfast"
                      ? "bg-amber-100 text-amber-600"
                      : dish.noFire
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-orange-100 text-orange-600",
                  )}
                >
                  {dish.category === "breakfast" ? (
                    <Sunrise className="w-5 h-5" />
                  ) : dish.noFire ? (
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

              <div className="flex flex-col gap-1 items-end flex-shrink-0">
                {dish.noFire && (
                  <Badge className="bg-emerald-100 text-emerald-700 border-0 rounded-full text-xs gap-1">
                    <FlameKindling className="w-3 h-3" />
                    No Fire
                  </Badge>
                )}
                {dish.category === "breakfast" && (
                  <Badge className="bg-amber-100 text-amber-700 border-0 rounded-full text-xs gap-1">
                    <Sunrise className="w-3 h-3" />
                    Breakfast
                  </Badge>
                )}
              </div>
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

            {/* Nutrients */}
            {dish.keyNutrients && dish.keyNutrients.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {dish.keyNutrients.map((n) => (
                  <NutrientBadge key={n} label={n} />
                ))}
              </div>
            )}

            {/* Tags */}
            {dish.tags && dish.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {dish.tags.map((t) => (
                  <TagBadge key={t} label={t} />
                ))}
              </div>
            )}
          </div>

          {/* Expandable: Ingredients + Steps */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden border-t border-border/30"
              >
                <div className="p-5 pt-4 space-y-4">
                  {/* Ingredients */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                      Ingredients
                    </h4>
                    <ul className="space-y-1">
                      {dish.ingredients.map((ing) => (
                        <li
                          key={ing}
                          className="text-sm text-foreground flex items-start gap-2"
                        >
                          <span className="text-primary mt-0.5 flex-shrink-0">
                            •
                          </span>
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Steps */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                      Method
                    </h4>
                    <ol className="space-y-2">
                      {dish.method.map((step, stepIdx) => (
                        <li
                          key={step.slice(0, 20)}
                          className="text-sm text-foreground flex gap-3"
                        >
                          <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5">
                            {stepIdx + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expand toggle */}
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-center gap-1 py-3 text-xs text-muted-foreground hover:text-foreground transition-colors border-t border-border/30"
            data-ocid={`kitchen.toggle.${index + 1}`}
          >
            {expanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" /> Hide recipe
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" /> View recipe
              </>
            )}
          </button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function MindfulKitchenPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const filtered = MINDFUL_DISHES.filter((d) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "no-fire" && d.noFire) ||
      (filter === "cooked" && !d.noFire) ||
      (filter === "snack" && d.category === "snack") ||
      (filter === "drink" && d.category === "drink") ||
      (filter === "soup" && d.category === "soup") ||
      (filter === "breakfast" && d.category === "breakfast");
    const matchesSearch =
      !search.trim() ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.benefit.toLowerCase().includes(search.toLowerCase()) ||
      d.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const counts: Record<Filter, number> = {
    all: MINDFUL_DISHES.length,
    "no-fire": MINDFUL_DISHES.filter((d) => d.noFire).length,
    cooked: MINDFUL_DISHES.filter((d) => !d.noFire).length,
    snack: MINDFUL_DISHES.filter((d) => d.category === "snack").length,
    drink: MINDFUL_DISHES.filter((d) => d.category === "drink").length,
    soup: MINDFUL_DISHES.filter((d) => d.category === "soup").length,
    breakfast: MINDFUL_DISHES.filter((d) => d.category === "breakfast").length,
  };

  const filterButtons: {
    value: Filter;
    label: string;
    icon: React.ElementType;
  }[] = [
    { value: "all", label: `All (${counts.all})`, icon: ChefHat },
    {
      value: "breakfast",
      label: `Breakfast (${counts.breakfast})`,
      icon: Sunrise,
    },
    { value: "snack", label: `Snacks (${counts.snack})`, icon: Cookie },
    { value: "drink", label: `Drinks (${counts.drink})`, icon: GlassWater },
    { value: "soup", label: `Soups (${counts.soup})`, icon: Soup },
    { value: "no-fire", label: `No Fire (${counts["no-fire"]})`, icon: Leaf },
    { value: "cooked", label: `Cooked (${counts.cooked})`, icon: Flame },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
          <ChefHat className="w-4 h-4" />
          Mindful Kitchen
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          🌿 Mindful Kitchen
        </h1>
        <p className="text-muted-foreground text-sm max-w-xl">
          Nourish your mind and body with {MINDFUL_DISHES.length} thoughtfully
          curated Indian vegetarian recipes — from energising breakfasts to
          calming soups, each designed to support student wellness.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Total dishes", value: counts.all, icon: "🍽️" },
          { label: "Breakfast", value: counts.breakfast, icon: "🌅" },
          { label: "No-Fire", value: counts["no-fire"], icon: "🥗" },
          { label: "Soups", value: counts.soup, icon: "🍲" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-2xl border border-border/40 p-4 text-center shadow-sm"
          >
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="font-display text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dishes, benefits, or tags..."
            className="pl-9 h-11 rounded-xl"
            data-ocid="kitchen.search.input"
          />
        </div>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList className="h-10 rounded-xl bg-muted p-1 flex gap-1 w-full overflow-x-auto flex-wrap">
            {filterButtons.map((btn) => {
              const Icon = btn.icon;
              return (
                <TabsTrigger
                  key={btn.value}
                  value={btn.value}
                  className="rounded-lg text-xs px-3 flex items-center gap-1.5 flex-shrink-0"
                  data-ocid={`kitchen.${btn.value.replace("-", "_")}.tab`}
                >
                  <Icon className="w-3 h-3" />
                  {btn.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Results */}
      {filtered.length > 0 ? (
        <div className="space-y-5">
          {filtered.map((dish, i) => (
            <DishCard key={dish.name} dish={dish} index={i} />
          ))}
        </div>
      ) : (
        <div
          className="text-center py-16 text-muted-foreground"
          data-ocid="kitchen.empty_state"
        >
          <ChefHat className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="font-display text-base font-semibold mb-1 text-foreground">
            No dishes found
          </p>
          <p className="text-sm mb-4">Try adjusting your search or filter.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFilter("all");
              setSearch("");
            }}
            className="rounded-xl"
            data-ocid="kitchen.clear_filter.button"
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
