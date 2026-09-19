

import {Transactions} from "@/components/admin/transactions/transactions";
import { getCurrentUser } from "@/lib/CurrentUser";
import {redirect} from "next/navigation";

export default async function Page() {

    const {user,token} = await getCurrentUser();
    if(token == undefined || null || !user){
        redirect('/login');
    }
    return (
        <div>
            <Transactions  rate={1} fetchagain={false} token={token} currency={user?.currency} />
        </div>
    );
}