import TransactionAction from "@/components/admin/transactions/transactionAction";
import { getCurrentUser } from "@/lib/CurrentUser";
import { redirect } from "next/navigation";


export default async function Page() {
    const {user,token} = await getCurrentUser();
    if (!user || !token) {
        redirect('/login');
    }
    return (
        <>
        <TransactionAction mode="edit" user={user} token={token}/>
        </>
    );
}