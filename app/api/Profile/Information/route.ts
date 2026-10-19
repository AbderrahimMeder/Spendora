
import { NextRequest, NextResponse } from "next/server";

const LARAVEL_API_URL = process.env.LARAVEL_API_URL;

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        // 1. Get token from the incoming request cookie
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { status: 401, message: "Unauthorized" },
                { status: 401 }
            );
        }

        if (!LARAVEL_API_URL) {
            return NextResponse.json(
                { status: 500, message: "Laravel API URL is not configured" },
                { status: 500 }
            );
        }

        // 2. Send profile data to Laravel
        const res = await fetch(
            `${LARAVEL_API_URL}/api/Profile/User-info`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                body: JSON.stringify(data),
                cache: "no-store",
            }
        );

        const getdata = await res.json();

        if (!res.ok) {
            return NextResponse.json(
                {
                    status: res.status,
                    message: getdata.message ?? "Failed to update profile",
                    errors: getdata.errors,
                },
                { status: res.status }
            );
        }
        const nextResponse = NextResponse.json({
            status: getdata.status,
            message: "Information updated successfully",
            user: getdata.user,
        });

        nextResponse.cookies.set(
            "user",
            JSON.stringify(getdata.user),
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
            }
        );

        return nextResponse;

    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : "Internal server error";

        return NextResponse.json(
            { status: 500, message },
            { status: 500 }
        );
    }
}
