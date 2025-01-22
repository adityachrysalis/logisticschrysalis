import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";

function Tabs({tabActive}) {
  const { id } = useParams();
  
  const [activeTab, setActiveTab] = useState(tabActive);
  const [brand, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchBrandInfo = () => {
    setLoading(true);
    fetch(`${apiUrl}brand_data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setBrands(data.brand);
        } else {
          setError(data.message);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch data");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBrandInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center bg-icbackgroundcard bg-opacity-10 rounded-lg h-screen gap-4">
        <ClipLoader color="#9999ff" size={70} />
        <p className="text-lg text-gray-600">Please wait...</p>
      </div>

    );
  }
  if (error) return <p className="text-icred">{error}</p>;

  // Helper function to handle tab change
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="rounded-lg flex justify-between items-center">
      <div className="flex items-center space-x-6">
        {[
          { name: "Hub", path: `/dashboard/brands/master/deliveryhub/${id}` },
          {
            name: "Delivery Area",
            path: `/dashboard/brands/master/deliveryarea/${id}`,
          },
          {
            name: "Daily Planner",
            path: `/dashboard/brands/master/deliveryplanner/${id}`,
          },
        ].map((tab) => (
          <Link
            key={tab.name}
            to={tab.path}
            onClick={() => handleTabClick(tab.name)}
            className={`min-w-20 text-center text-sm shadow-ictheme shadow-sm p-2 rounded-lg ${
              activeTab === tab.name ? "bg-ictheme text-icbackgroundlight" : "bg-ictext"
            }`}
          >
            {tab.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Tabs;
