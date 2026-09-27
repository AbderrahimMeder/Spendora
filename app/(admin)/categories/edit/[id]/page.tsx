import { getCurrentUser } from "@/lib/CurrentUser";
import { redirect } from "next/navigation";
import { CreateToggle } from "@/components/admin/categories/createCategorieToggel";


export default async function EditCategoryPage() {
    const { user, token } = await getCurrentUser()
    if (!user || !token) return redirect('/login')
    return (
        <>
            <CreateToggle
                token={token}
                mode='edit'
            />
        </>
    )
}