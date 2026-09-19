import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        const token = body.token;
        if(!token){
            return NextResponse.json({ status: 401, message: "Unauthorized" });
        }
        const res =await  fetch(`${process.env.LARAVEL_API_URL}/api/current-user`,{
            method: "GET",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await res.json();
        if(!data.user){
            return NextResponse.json({ status: 500, message: "Internal server error" });
        }
        const nextResponse = NextResponse.json({
                    message: 'welcome back ',
                    user: data.user,
                    status: data.status,
                });
                nextResponse.cookies.set("token", token, {
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
        return NextResponse.json({ status: 500, message: "Internal server error" });
    }
}