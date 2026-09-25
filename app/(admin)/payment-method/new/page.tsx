import { NewPaymentMethod } from "@/components/admin/payment-method/new-payment";
import { getCurrentUser } from "@/lib/CurrentUser";
import { redirect } from "next/navigation";

export default async function NewPaymentMethodPage() {
    const { user, token } = await getCurrentUser();
    if (!user || !token) {
        redirect('/login');
    }
    return (
        <div>
            <NewPaymentMethod token={token} mode="create" />
        </div>
    );
}