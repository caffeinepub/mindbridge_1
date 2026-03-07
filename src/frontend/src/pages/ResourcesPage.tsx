import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  BookOpen,
  ExternalLink,
  FileText,
  Headphones,
  Loader2,
  Search,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { WellnessResource } from "../backend.d";
import { SAMPLE_RESOURCES } from "../data/sampleData";
import { useGetAllResources } from "../hooks/useQueries";

const categoryConfig = {
  all: { label: "All", icon: Search, color: "bg-muted text-foreground" },
  book: {
    label: "Books",
    icon: BookOpen,
    color: "bg-amber-100 text-amber-700",
  },
  article: {
    label: "Articles",
    icon: FileText,
    color: "bg-blue-100 text-blue-700",
  },
  podcast: {
    label: "Podcasts",
    icon: Headphones,
    color: "bg-purple-100 text-purple-700",
  },
  activity: {
    label: "Activities",
    icon: Activity,
    color: "bg-teal-100 text-teal-700",
  },
};

type Category = keyof typeof categoryConfig;

function ResourceCard({
  resource,
  index,
}: { resource: WellnessResource; index: number }) {
  const cat = resource.category as unknown as string;
  const config = categoryConfig[cat as Category] ?? categoryConfig.article;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      data-ocid={`resources.item.${index + 1}`}
    >
      <Card className="rounded-2xl border-border/40 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
        <CardContent className="p-5 flex flex-col gap-3 h-full">
          <div className="flex items-start justify-between gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${config.color}`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <Badge
              className={`rounded-full text-xs ${config.color} capitalize`}
            >
              {config.label}
            </Badge>
          </div>

          <div className="flex-1">
            <h3 className="font-display font-semibold text-sm leading-snug mb-2">
              {resource.title}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {resource.description}
            </p>
          </div>

          {resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {resource.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid={`resources.link.${index + 1}`}
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-xl h-9 text-xs mt-auto gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              Open Resource
            </Button>
          </a>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ResourcesPage() {
  const { data: backendResources, isLoading } = useGetAllResources();
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");

  const resources =
    backendResources && backendResources.length > 0
      ? backendResources
      : SAMPLE_RESOURCES;

  const filtered = resources.filter((r) => {
    const catMatch =
      activeCategory === "all" ||
      (r.category as unknown as string) === activeCategory;
    const searchMatch =
      !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return catMatch && searchMatch;
  });

  const counts = {
    all: resources.length,
    book: resources.filter((r) => (r.category as unknown as string) === "book")
      .length,
    article: resources.filter(
      (r) => (r.category as unknown as string) === "article",
    ).length,
    podcast: resources.filter(
      (r) => (r.category as unknown as string) === "podcast",
    ).length,
    activity: resources.filter(
      (r) => (r.category as unknown as string) === "activity",
    ).length,
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
          <BookOpen className="w-4 h-4" />
          Wellness Library
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Curated Resources
        </h1>
        <p className="text-muted-foreground text-sm max-w-xl">
          Handpicked books, articles, podcasts, and activities to support your
          mental health journey. Explore at your own pace.
        </p>
      </motion.div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources..."
            className="pl-9 h-11 rounded-xl"
            data-ocid="resources.search.input"
          />
        </div>
        <Tabs
          value={activeCategory}
          onValueChange={(v) => setActiveCategory(v as Category)}
          className="w-full md:w-auto"
        >
          <TabsList className="h-11 rounded-xl bg-muted p-1 flex gap-1">
            {(Object.keys(categoryConfig) as Category[]).map((cat) => {
              const { label } = categoryConfig[cat];
              return (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="rounded-lg text-xs px-3"
                  data-ocid={`resources.${cat}.tab`}
                >
                  {label}
                  {counts[cat] > 0 && (
                    <span className="ml-1 text-xs opacity-60">
                      ({counts[cat]})
                    </span>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Loading */}
      {isLoading && (
        <div
          className="flex items-center justify-center py-16"
          data-ocid="resources.loading_state"
        >
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">
            Loading resources...
          </span>
        </div>
      )}

      {/* Grid */}
      {!isLoading && filtered.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((resource, i) => (
            <ResourceCard
              key={resource.id.toString()}
              resource={resource}
              index={i}
            />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-16" data-ocid="resources.empty_state">
          <Search className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-50" />
          <h3 className="font-display text-lg font-semibold mb-1">
            No resources found
          </h3>
          <p className="text-muted-foreground text-sm">
            Try adjusting your search or filter.
          </p>
        </div>
      )}
    </div>
  );
}
