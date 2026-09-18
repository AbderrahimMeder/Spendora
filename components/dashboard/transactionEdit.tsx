import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function transactionEdit(){
    const {id}=useParams()
    useEffect(()=>{
        
    })
    return (
        <div>
            <h1>Transaction Edit</h1>
        </div>
    );
}