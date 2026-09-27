import {NewPaymentMethod} from "@/components/admin/payment-method/new-payment";
import { getCurrentUser } from "@/lib/CurrentUser";
import { redirect } from "next/navigation";
export default async function PaymentMethodEdit() {

    const { user,token } = await getCurrentUser();
    if (!user) {
        redirect('/login');
    }

    return (
        <div>
            <NewPaymentMethod 
            user={user} 
            token={token} 
            mode='edit'
            />
        </div>
    );
}