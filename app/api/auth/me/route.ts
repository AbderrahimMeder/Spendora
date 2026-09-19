

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
export async function GET() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete("token");
        cookieStore.delete("user");
        return NextResponse.json({ message: "Logout successful" });
    } catch (error) {
        return NextResponse.json({ message: "Logout failed" }, { status: 500 });
    }

};


