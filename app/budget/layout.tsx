import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orçamento - Ancora Express",
  description: "Criação e gestão de orçamentos",
};

export default function BudgetLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
