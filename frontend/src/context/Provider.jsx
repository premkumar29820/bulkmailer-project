import { createContext } from "react"
import { useState } from "react"
export const Mailcontext=createContext()
const Provider=({children})=>{
    const [maildata,setmaildata]=useState({
        subject:"",
        recipients:"",
        body:"",
        file:null,
        filemails:[]
    })
    const handlechange=(e)=>{
        const {name,value}=e.target 
        setmaildata((prev)=>({
            ...prev,[name]:value
        }))
    }
    return(
        <Mailcontext.Provider value={{maildata,setmaildata,handlechange}}>
            {children}
        </Mailcontext.Provider>
    )
}
export default Provider