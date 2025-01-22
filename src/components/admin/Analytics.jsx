import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LatestBrands from "./includes/LatestBrands";
import BrandIcon from "../../assets/icons/brands.svg";
import TruckIcon from "../../assets/icons/truck.svg";
import PersonIcon from "../../assets/icons/user.svg";
import BoxIcon from "../../assets/icons/box.svg";
import StatCard from "./includes/StatCard";
import OrderChart from "./includes/OrderChart";

function Analytics() {
  const navigate = useNavigate();
  const userSession = sessionStorage.getItem("token");

  useEffect(() => {
    if (!userSession) {
      navigate("/");
    }
  }, [navigate, userSession]);

  const stats = [
    { icon: BrandIcon, value: "04", label: "Total Brands" },
    { icon: PersonIcon, value: "13", label: "Total Staff" },
    { icon: TruckIcon, value: "04", label: "Orders Pending" },
    { icon: BoxIcon, value: "553", label: "Orders Delivered" },
  ];

  return (
    <>
      <h1 className="text-xl font-semibold text-icbackgroundcard mb-2">Dashboard</h1>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:p-5 rounded-lg items-center justify-center">
        {/* Top two components (50/50 width on large screens) */}
        
            <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4 items-center justify-center">
                {stats.map((stat, index) => (
                    <center>
                <StatCard key={index} icon={stat.icon} value={stat.value} label={stat.label} />
                </center>
                ))}
            </div>
        
        <center><LatestBrands /></center>

        {/* Full-width component */}
        <div className="lg:col-span-2 flex justify-center">
            <OrderChart />
        </div>
        </div>


     
    </>
  );
}

export default Analytics;
