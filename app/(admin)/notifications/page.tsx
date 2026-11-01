import NotificationsTable from "@/components/notifications/NotificationsTable";
import { getCurrentUser } from "@/lib/CurrentUser";
import { redirect } from "next/navigation";
export default async function NotificationsPage() {
    const {user,token}=await getCurrentUser();
    if(!user||!token){
        redirect("/login");
    }
    return (
        <div>
            <NotificationsTable user={user} token={token} />
        </div>
    );
}