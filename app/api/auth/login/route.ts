import { NextResponse } from "next/server";

const LARAVEL_API_URL = process.env.LARAVEL_API_URL;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const response = await fetch(
            `${LARAVEL_API_URL}/api/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    email: body.email,
                    password: body.password,
                }),
            }
        );
        const data = await response.json();
        if (!response.ok) {
            return NextResponse.json(
                {
                    message: data.message ?? "Login failed",
                },
                {
                    status: response.status,
                }
            );
        }
        const nextResponse = NextResponse.json({
            message: data.message,
            user: data.user,
            status: data.status,
        });
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
    } catch (error) {
        return NextResponse.json(
            {
                message: "Internal server error",
            },
            {
                status: 500,
            }
        );
    }
}