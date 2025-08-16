import React, { useEffect, useState } from 'react'
import { useNavigation } from 'react-router-dom'

const CheckAuth = ({children,protectedRoutes}) => {
    const navigate = useNavigation()
    const [loading,setLoading] = useState(true)

    useEffect(()=>{
        if(protectedRoutes){
            if(!token){
                navigate("/login")
            }else{
                setLoading(false)
            }
        }else{
            if(token){
                navigate("/")
            }else{
                setLoading(false)
            }
        }
    },[navigate,protectedRoutes])
    if(loading){
        return(
            <div>...loading</div>
        )
    }

    return children
}

export default CheckAuth