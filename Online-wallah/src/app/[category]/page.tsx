import { notFound } from "next/navigation";
import { Metadata } from "next";
import CategoryListingClient from "@/components/public/CategoryListingClient";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

const CATEGORY_META: Record<string, { title: string; desc: string }> = {
  "latest-jobs": {
    title: "Latest Government & Public Institution Jobs 2026",
    desc: "Find all latest Central and State Government recruitment notifications, online application forms, eligibility criteria, and vacancies.",
  },
  "results": {
    title: "Sarkari Exam Results, Cutoff & Scorecards 2026",
    desc: "Check latest government recruitment exam results, cutoff marks, selection lists, and candidate scorecards.",
  },
  "admit-card": {
    title: "Exam Admit Cards, Hall Tickets & City Slips 2026",
    desc: "Download direct e-Admit Cards, exam hall tickets, call letters, and test center intimation slips.",
  },
  "answer-key": {
    title: "Official Exam Answer Keys & Response Sheets 2026",
    desc: "Download official question papers with provisional/final answer keys and check online objection deadlines.",
  },
  "syllabus": {
    title: "Detailed Exam Syllabus & Exam Patterns 2026",
    desc: "Download complete topic-wise exam syllabus, marking schemes, negative marking rules, and previous year question papers.",
  },
  "admission": {
    title: "National Entrance Exams & Admissions 2026",
    desc: "Online registration for NEET, JEE Main, CUET, B.Ed, Law, and Master entrance examinations.",
  },
  "engineering": {
    title: "Engineering Jobs & PSU Recruitment 2026",
    desc: "Find PSU executive trainee posts, GATE recruitment, Junior Engineer (JE), Assistant Engineer, and ISRO/DRDO vacancies.",
  },
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const meta = CATEGORY_META[category];

  if (!meta) {
    return { title: "Category Not Found" };
  }

  return {
    title: `${meta.title} | OnlineWallah.com`,
    description: meta.desc,
    openGraph: {
      title: `${meta.title} | OnlineWallah.com`,
      description: meta.desc,
      url: `https://onlinewallah.com/${category}`,
    },
    alternates: {
      canonical: `/${category}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const meta = CATEGORY_META[category];

  if (!meta) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
      <CategoryListingClient
        categorySlug={category}
        categoryTitle={meta.title}
        categoryDescription={meta.desc}
      />
    </main>
  );
}
