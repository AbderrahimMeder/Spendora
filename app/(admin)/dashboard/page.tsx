import { getCurrentUser } from '@/lib/CurrentUser';
import {Dashboard} from '@/components/admin/dashboard/Dashboard';

export default async  function DashboardPage() {
    const { user, token } = await getCurrentUser();

    return (
        <>
            {user && token &&
                <Dashboard user={user} token={token} />
            }
        </>
    )
}