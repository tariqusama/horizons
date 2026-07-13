import Link from "next/link";
import React from "react";

const managerLinks = [
    { href: "/manager", label: "Dashboard Overview", icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
    )},
    { href: "/manager/assigned-cases", label: "Assigned Cases", icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            <path d="M9 14l2 2 4-4"></path>
        </svg>
    )},
    { href: "/manager/analytics", label: "Analytics & Reports", icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
    )}
];

export const metadata = {
    title: "Manager Portal | Horizon Pathways",
    description: "Internal portal for reviewing and processing cases.",
};

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-[#F3F4F6]">
            {/* Dark Sidebar */}
            <aside className="w-[280px] bg-[#111827] text-white flex flex-col shrink-0 sticky top-0 h-screen overflow-y-auto">
                <div className="p-6">
                    <div className="flex flex-col mb-8">
                        <span className="font-black text-[22px] tracking-tight text-white">Horizon</span>
                        <span className="text-[#E3755D] font-bold text-[10px] tracking-[0.2em] pl-0.5">MANAGER PORTAL</span>
                    </div>

                    <nav className="space-y-2">
                        {managerLinks.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
                            >
                                <span className="text-gray-400">{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>
                
                <div className="mt-auto p-6">
                    <div className="bg-gray-800 rounded-2xl p-4 flex items-center space-x-3 border border-gray-700">
                        <div className="w-10 h-10 rounded-full bg-[#E3755D] flex items-center justify-center font-bold">
                            SM
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">Sarah Miller</p>
                            <Link href="/" className="text-xs text-[#E3755D] hover:underline">Exit to Main Site</Link>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Top Header */}
                <header className="h-[72px] bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0 sticky top-0 z-10">
                    <div className="flex items-center">
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Search cases..." 
                                className="w-[300px] bg-gray-100 border-none rounded-full px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#E3755D]/50"
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white"></span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                        </button>
                    </div>
                </header>

                <div className="p-8 flex-1 overflow-x-hidden">
                    {children}
                </div>
            </main>
        </div>
    );
}
