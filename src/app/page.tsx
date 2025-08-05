'use client'

import Link from "next/link";

export default function Home() {
  const routes = [
    { name: "Budget", path: "/budget", icon: "💰" },
    { name: "Buscar Produtos", path: "/search", icon: "🔍" },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center px-6 max-w-[360px] mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-[32px] font-bold text-[#1E2124] mb-4">
          Bem-vindo
        </h1>
        <p className="text-[16px] text-[#474F56]">
          Escolha onde deseja navegar
        </p>
      </div>

      <div className="gap-6 w-full">
        {routes.map((route) => (
          <Link
            key={route.path}
            href={route.path}
            className="bg-white rounded-[20px] p-6 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
          >
            <div className="text-[48px] mb-4">
              {route.icon}
            </div>
            <span className="text-[16px] font-medium text-[#1E2124]">
              {route.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
