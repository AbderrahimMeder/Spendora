

import DashboardLayout from "@/components/admin/dashboard/dashboard-layout";
import { getCurrentUser } from "@/lib/CurrentUser";
import { redirect } from "next/navigation";
export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const {user, token } = await getCurrentUser();
    if (!user || !token) {
        redirect('/login');
    }
    return (
        <>
            {
                <DashboardLayout user={user}>
                    {children}
                </DashboardLayout>
            }
        </>
    )
}