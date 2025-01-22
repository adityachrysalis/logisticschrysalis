import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OrderChart from "../includes/OrderChart";
import Tabs from "./include/Tabs";
import BrandData from "./include/BrandData";

function Master(){
  const navigate = useNavigate();
  const userSession = sessionStorage.getItem("token"); 
  const { id } = useParams();


  useEffect(() => {
    if (userSession == null) {
      navigate("/"); // Redirect only if not already in /dashboard
    }
  }, [navigate, userSession]);



    return(
       <>

        <BrandData key={id} id={id}/>

        <div className="mt-2">
            <Tabs tabActive={''} />
        </div>
        

        <div className="mt-5">
        <OrderChart />
        </div>

           
            
       </>
    );
}

export default Master;