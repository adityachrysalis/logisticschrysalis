import Header from "./components/Header";
import Nav from "./components/Nav";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login";
import { useEffect } from "react";
import Dashboard from "./components/admin/Dashboard";
import Analytics from "./components/admin/Analytics";
import Brands from "./components/admin/Brands";
import NewBrand from "./components/admin/NewBrand";
import Master from "./components/admin/Master/Master";
import DeliveryPlanner from "./components/admin/Master/DeliveryPlanner";
import Hub from "./components/admin/Master/Hub";
import Area from "./components/admin/Master/Area";

function Logistics() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const userSession = sessionStorage.getItem("token"); // Adjust based on your session storage key

  useEffect(() => {
    if (userSession != null && !location.pathname.startsWith("/dashboard")) {
      navigate("/dashboard"); // Redirect only if not already in /dashboard
    }
  }, [navigate, userSession, location]);




  return (
    <div className="bg-white">
      {/* Render Nav conditionally */}
      {!userSession && <Nav />}

      <Routes>
        <Route path="/" element={<Header />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Analytics />} />
          <Route path="/dashboard/brands" element={<Brands />} />
          <Route path="/dashboard/brands/master/:id" element={<Master />}/>
          <Route path="/dashboard/brands/master/deliveryplanner/:id" element={<DeliveryPlanner />}/>
          <Route path="/dashboard/brands/master/deliveryhub/:id" element={<Hub />}/>
          <Route path="/dashboard/brands/master/deliveryarea/:id" element={<Area/>}/>
          <Route path="/dashboard/newBrand" element={<NewBrand />} />
          <Route path="/dashboard/settings" element={<h1>Settings Page</h1>} />
        </Route>

      </Routes>

      <ToastContainer
        position="top-center"
        autoClose={10000}
        hideProgressBar={false}
        closeOnClick={false}
        pauseOnHover={true}
        draggable
        theme="dark"
      />
    </div>
  );
}

export default Logistics;
