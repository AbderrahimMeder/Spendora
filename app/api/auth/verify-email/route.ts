import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get("token");

        if (!token) {
            return NextResponse.redirect(
                new URL("/login", request.url)
            );
        }

        const res = await fetch(
            `${process.env.LARAVEL_API_URL}/api/verify-email`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ token }),
                cache: "no-store",
            }
        );
        const data = await res.json();
        if (res.ok) {
            const nextResponse = NextResponse.redirect(
                new URL("/dashboard", request.url)
            );
            nextResponse.cookies.set("token", data.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
            });
            nextResponse.cookies.set(
                "user",
                JSON.stringify({
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                email_verified_at: data.user.email_verified_at,
                role: data.user.role,
                currency: data.user.currency,
                country: data.user.country,
                language: data.user.language,
                theme: data.user.theme,
                timezone: data.user.timezone,
                avatar: data.user.avatar,
                }),
                {
                    httpOnly: false,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    path: "/",
                    maxAge: 60 * 60 * 24 * 7,
                }
            );
            return nextResponse;
        }

        return NextResponse.redirect(
            new URL("/login", request.url)
        );

    } catch (error) {
        console.error("VERIFY ERROR:", error);

        return NextResponse.redirect(
            new URL("/login", request.url)
        );
    }
}