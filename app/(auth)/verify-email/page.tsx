import { getCurrentUser } from "@/lib/CurrentUser";
import { redirect } from "next/navigation";
import Link from "next/link";
import { VerifieEmail } from "@/components/virefy-email";
interface VerifyEmailPageProps {
    searchParams: Promise<{
        email?: string;
    }>;
}

export default async function VerifieEmailPage({ searchParams }: VerifyEmailPageProps) {
    const { user } = await getCurrentUser();
    const params = await searchParams;
    const email = params.email;
    if (user) {
        if (user.email_verified_at !== null && user.email_verified_at!== undefined) {
            redirect('/dashboard');
        }
    }

    const userEmail = email || "your email address";

    return (
        <VerifieEmail userEmail={userEmail}/>
    );
}

