import React from "react";
import ManagerLayoutClient from "./ManagerLayoutClient";

export const metadata = {
    title: "Manager Portal | Horizon Pathways",
    description: "Internal portal for reviewing and processing cases.",
};

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
    return (
        <ManagerLayoutClient>
            {children}
        </ManagerLayoutClient>
    );
}
