import DashboardClient from "./DashboardClient";

export const metadata = {
    title: "Dashboard | Horizon Pathways",
    description: "Client Dashboard",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return <DashboardClient>{children}</DashboardClient>;
}
