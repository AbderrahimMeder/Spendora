
import {TablePaymentMethod} from "@/components/admin/payment-method/table-payment-method";
import {getCurrentUser} from "@/lib/CurrentUser";
import { redirect } from "next/navigation";
export default async function PaymentMethod() {
    const { user,token } = await getCurrentUser();
    if (!user) {
        redirect('/login');
    }
    return (
        <div>
            <TablePaymentMethod token={token}/>
        </div>
    );
}