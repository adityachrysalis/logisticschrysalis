import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ArrowLeft from "../../../../assets/icons/arrow-left.svg"
import { ClipLoader } from "react-spinners";

function BrandData({id}){

  const navigate = useNavigate();

    const apiUrl = import.meta.env.VITE_API_URL;
    const imageUrl = import.meta.env.VITE_IMAGE_URL;
    const [brand, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
  
    const fetchBrandInfo = () => {
      setLoading(true);
      fetch(`${apiUrl}brand_data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }), // Use latest date
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

    return(
       <>


    <div className="shadow-ictheme shadow-sm bg-ictext rounded-lg px-6 py-1 flex justify-between items-center">

    <img
      src={ArrowLeft}
      alt="Go Back"
      className="h-10 max-w-10 bg-ictext shadow-ictheme shadow-sm p-2 rounded-lg transform hover:scale-125 transition-transform duration-500 cursor-pointer"
      onClick={() => navigate(-1)} // Go back to the previous page
    />
        <img src={imageUrl+brand.brand_image} alt={brand.brand_name} className="max-h-18 max-w-20 transform hover:scale-125 transition-transform duration-500" />

        <h1 className="text-lg font-semibold text-icbackgroundcard">{brand.brand_name}</h1>
        <h1 className="text-base font-semibold text-icbackgroundcard">Email: <span className="text-ictheme">{brand.brand_email}</span></h1>
        <h1 className="text-base font-semibold text-icbackgroundcard ">Mobile: <span className="text-ictheme">{brand.brand_mobile}</span></h1>
        <h1 className="text-base font-semibold text-icbackgroundcard">
            Status:  
            <span className={`text-${brand.status === 1 ? 'icactive' : 'icred'}`}>
                {brand.status === 1 ? ' Active' : ' Inactive'}
            </span>
        </h1>

        <a href={brand.weburl} target="_blank" className="bg-ictheme base p-2 px-10 rounded-lg text-icbackgroundlight">Website</a>

        <Link to={'/dashboard/newBrand'} className="bg-icbackgroundcard base p-2 px-12 rounded-lg text-icbackgroundlight ">Edit</Link>

        
    </div>


           
            
       </>
    );
}

export default BrandData;