
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(request:NextRequest){
    const data =await  request.json()
    const token = request.cookies.get('token')?.value
    if(!token){
        return NextResponse.json({
            status:403
        })
    }
    try{
        const res = await fetch(`${process.env.LARAVEL_API_URL}/api/Profile/UpdateCurrency`,{
        method:'PATCH',
        headers:{
            'content-type':'application/json',
            Authorization: `Bearer ${token}`,
        },
        body:JSON.stringify({currency:data.currency})
    })
    const GetData = await res.json()
    if(GetData.status === 201){
        const response =  NextResponse.json({
            status:201,
            message:'currency update',
        })
        response.cookies.set('user',
            JSON.stringify(GetData.user)
            ,{
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    path: "/",
                    maxAge: 60 * 60 * 24 * 7,
            })
        return response
    }
    return NextResponse.json({
        status:401,
        message:GetData.message
    })
    }catch(err:any){
        return NextResponse.json({
            status:500,
            message:err.message
        })
    }

}