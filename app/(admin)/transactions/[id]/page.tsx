

import TransactionDetails from "@/components/admin/transactions/transactiondDetails";
import { getCurrentUser } from "@/lib/CurrentUser";
import { redirect } from "next/navigation";
export default async function Page() {

    const { user, token } = await getCurrentUser();
    if (!user || !token) {
        return redirect('/login');
    }
    return (
        <div>
            <TransactionDetails user={user} token={token}/>
        </div>
    );
    
}   