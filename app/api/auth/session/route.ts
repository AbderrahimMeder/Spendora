import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();

    const userCookie = cookieStore.get("user")?.value;

    if (!userCookie) {
        return NextResponse.json(
            { user: null },
            { status: 401 }
        );
    }

    const user = JSON.parse(userCookie);

    return NextResponse.json({
        user,
    });
}