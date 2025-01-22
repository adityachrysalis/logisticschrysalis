import { useState, useEffect } from "react";
import AddIcon from '../../../assets/icons/add.svg';
import RefreshIcon from '../../../assets/icons/refresh.svg';
import MagnifyingGlassIcon from '../../../assets/icons/search.svg';
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const TABLE_HEAD = ["Brand", "Name", "Mobile", "Email", "Status", "Actions"];

export function BrandsList() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const imageUrl = import.meta.env.VITE_IMAGE_URL;
  const [search, setSearch] = useState("");
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  const fetchBrands = () => {
    setLoading(true);
    fetch(`${apiUrl}brand_list`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setBrands(data.brands);
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
    fetchBrands();
  }, []);

  // Filter orders based on search input
  const filteredBrands = brands.filter((brand) =>
    ['name:' + brand.brand_name, 'mobile:' + brand.brand_mobile, 'email:' + brand.brand_email]
      .some((field) => field.toLowerCase().includes(search.toLowerCase()))
  );


  // Pagination logic
  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBrands = filteredBrands.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center bg-icbackgroundcard bg-opacity-10 rounded-lg h-screen gap-4">
        <ClipLoader color="#9999ff" size={70} />
        <p className="text-lg text-gray-600">Please wait...</p>
      </div>

    );
  }

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="w-full max-w-6xl mx-auto bg-icwhite shadow-md rounded-lg p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold text-icbackgroundcard">Brand List</h2>
          <p className="text-icbackgroundcard text-sm">All registered brands</p>
        </div>
        <div className="flex gap-2 items-center w-full md:w-auto">
          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ictheme"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <img src={MagnifyingGlassIcon} alt="Search" className="h-5 w-5 absolute left-3 top-2.5 text-icgrey" />
          </div>
          {/* Refresh Button */}
          <button
            onClick={fetchBrands}
            className="bg-icbackgroundcard text-icbackgroundlight px-4 py-2 rounded-md flex items-center gap-2"
          >
            <img src={RefreshIcon} alt="Refresh" className="h-5 w-5" />
          </button>
          {/* New Button */}
          <Link to={'/dashboard/newBrand'} className="bg-icbackgroundcard text-icbackgroundlight px-4 py-2 rounded-md flex items-center gap-2">
            <img src={AddIcon} alt="New Brand" className="h-5 w-5" /> New Brand
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border bg-icwhite border-icbackgroundcard">
          <thead className="">
            <tr className="bg-icbackgroundcard">
              {TABLE_HEAD.map((head) => (
                <th key={head} className="p-3 text-left text-icbackgroundlight font-semibold border-b">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedBrands.length > 0 ? (
              paginatedBrands.map((brand) => (
                <tr key={brand.id} className="border-b hover:bg-icbackgroundlight border border-icgreylight">
                  <td className=" flex items-center justify-center">
                    <img src={imageUrl + brand.brand_image} alt={brand.brand_name} className="h-12 w-16" />
                  </td>
                  <td className="px-2 text-icbackgroundcard border border-icgreylight">{brand.brand_name}</td>
                  <td className="px-2 text-icbackgroundcard border border-icgreylight">{brand.brand_mobile}</td>
                  <td className="px-2 text-icbackgroundcard border border-icgreylight">{brand.brand_email}</td>
                  <td className="px-2 justify-center">
                    <span
                      className={`px-2 py-1 rounded text-xs border border-icgreylight font-medium text-icbackgroundlight ${brand.status === 1 ? 'bg-icactive' : 'bg-icred'
                        }`}
                    >
                      {brand.status === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-2 items-center border border-icgreylight justify-center">
                    <Link to={`/dashboard/brands/master/${brand.id}`} className="text-icbackgroundlight bg-icbackgroundcard px-4 w-20 text-center rounded-md flex items-center gap-2">
                      Master
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-3 text-center text-gray-500">No Brand found</td>
              </tr>
            )}

          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 border rounded-md ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}
        >
          Previous
        </button>
        <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 border rounded-md ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
