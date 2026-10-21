import { getCurrentUser } from '@/lib/CurrentUser';
import {Dashboard} from '@/components/admin/dashboard/Dashboard';
import type { User } from '@/types';
export default async  function DashboardPage() {
    const { user, token }:{user:User|null,token:string|null} = await getCurrentUser();
    return (
        <>
            {user && token &&
                <Dashboard user={user} token={token} />
            }
        </>
    )
}
