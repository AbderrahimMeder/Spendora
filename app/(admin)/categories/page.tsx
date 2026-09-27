import { CardCategories } from "@/components/admin/categories/card-categories"
import { getCurrentUser } from "@/lib/CurrentUser"
import { redirect } from "next/navigation"
export  default async function Categories(){
    const {user,token}=await getCurrentUser()
    if(!user||!token)return redirect('/login')
    return (
        <>
            <CardCategories token={token} user={user} />
        </>
    )

}
