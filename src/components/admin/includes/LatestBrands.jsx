import React, { useEffect, useState } from "react";
import ArrowRight from '../../../assets/icons/arrow-right.svg';
import { Link } from "react-router-dom";

const LatestBrands = () => {

const apiUrl = import.meta.env.VITE_API_URL;
  const imageUrl = import.meta.env.VITE_IMAGE_URL;
  const [brands, setBrands] = useState([]);

  const fetchBrands = () => {
    fetch(`${apiUrl}brand_list`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setBrands(data.brands);
        } else {
          setError(data.message);
        }
      })
      .catch(() => {
        setError("Failed to fetch data");
      });
  };

  useEffect(() => {
    fetchBrands();
  }, []);



  return (
    <div className="bg-icwhite shadow-sm shadow-ictheme rounded-lg p-4 lg:w-96">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg text-icbackgroundcard font-bold">Latest Brands</h2>
        <Link to={'/dashboard/brands'} className="text-icbackgroundlight rounded text-sm bg-icbackgroundcard p-2 font-semibold">
          View all
        </Link>
      </div>
      <ul>
        {brands.map((brand, index) => (
          <li key={index} className="flex justify-between items-center border-b border-icbackgroundcard last:border-b-0">
            <div className="flex items-center gap-3">
              <img src={imageUrl+brand.brand_image} alt={brand.brand_name} className="w-24 h-16 rounded-lg object-fit" />
              <div className="ml-2">
                <h3 className="font-semibold text-icbackgroundcard">{brand.brand_name}</h3>
                <p className="text-icgrey text-sm md:block hidden">{brand.weburl}</p>
              </div>
            </div>
            <Link to={`/dashboard/brands/master/${brand.id}`}><img src={ArrowRight} alt={'go'} className="w-8 h-8" /></Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LatestBrands;
