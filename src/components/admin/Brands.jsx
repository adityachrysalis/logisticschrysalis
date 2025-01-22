import { useEffect } from "react";
import {useNavigate } from "react-router-dom";
import { BrandsList } from "./includes/BrandsList";

function Brands(){
  const navigate = useNavigate();
  const userSession = sessionStorage.getItem("token"); // Adjust based on your session storage key

  useEffect(() => {
    if (userSession == null) {
      navigate("/"); // Redirect only if not already in /dashboard
    }
  }, [navigate, userSession]);


    return(
       <>
           <h1 className="text-xl font-semibold text-icbackgroundcard mb-2">Dashboard/Brands</h1>

           <BrandsList />
       </>
    );
}

export default Brands;