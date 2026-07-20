import React from "react";
import AdminLayoutClient from "./AdminLayoutClient";

export const metadata = {
    title: "Admin Control Center | Horizon Pathways",
    description: "Internal portal for managing cases, clients, and operations.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminLayoutClient>
            {children}
        </AdminLayoutClient>
    );
}
