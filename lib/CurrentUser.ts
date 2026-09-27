
import {cookies} from 'next/headers';
export const getCurrentUser = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const user = cookieStore.get('user')?.value;
    if (!token || !user) {
        return {
            user: null,
            token: null,
        };
    }
    if(user){
        return {
            user: JSON.parse(user),
            token: token,
        };
    }
    const res = await fetch(`${process.env.LARAVEL_API_URL}/api/current-user`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        return {
            user: null,
            token: null,
        };
    }
    const data = await res.json();
    return {
        user: data.user,
        token: token,
    } as const;
}
    
