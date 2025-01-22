import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Tabs from "./include/Tabs";
import RefreshIcon from '../../../assets/icons/refresh.svg';
import MagnifyingGlassIcon from '../../../assets/icons/search.svg';
import BrandView from "./include/BrandView";
import CloseIcon from '../../../assets/icons/close.svg';
import ExportIcon from '../../../assets/icons/export.svg';
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { ClipLoader } from "react-spinners";

function Area() {
  const { id } = useParams();
  const TABLE_HEAD = ["Area ID", "Area Name", "Area Pin", "City", "Route Name", "Delivery Boy", "Hub"];

  const [search, setSearch] = useState("");
  const [arealist, setArealist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Adjust as needed

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchBrandInfo = () => {
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
          fetchAreas(data.brand.api_url);
        } else {
          setError(data.message);
        }
      })
      .catch(() => {
        setError("Failed to fetch data");
      });
  };

  useEffect(() => {
    fetchBrandInfo();
    
  }, []);


  const fetchAreas = (BrandApiUrl) => {
    setLoading(true);

    fetch(`${BrandApiUrl}get_area`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.arealist) {
          setArealist(data.arealist);
          setCurrentPage(1); // Reset to first page on new fetch
        } else {
          setError(data.message || "No Area found.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch data");
        setLoading(false);
      });
  };



  // Filter hubs based on search input
  const filteredArea = arealist.filter((area) =>
    ['id:' + area.area_id, 'name:' + area.area_name, 'pin:' + area.area_pin, 'city:' + area.area_city]
      .some((field) => field && field.toString().toLowerCase().includes(search.toLowerCase()))
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredArea.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedArea = filteredArea.slice(startIndex, startIndex + itemsPerPage);

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


      const [isModalOpenExport, setIsModalOpenExport] = useState(false);
    
      const openModalExcel = () => {
        setIsModalOpenExport(true);
      };
    
      const closeModalExcel = () => {
        setIsModalOpenExport(false);
      };  


     // Export data as PDF
// Export data as PDF
const exportAsPDF = () => {
  // Prepare the data to export
  const doc = new jsPDF();

   // Add brand name to the top
   const BrandName = import.meta.env.VITE_BRAND_NAME;
   doc.setFontSize(14);
   doc.setTextColor('#252525'); 
   doc.text(BrandName, 14, 10); 
 
   // Add title to the top center of the page
   doc.setFontSize(16);
   doc.text("Delivery Area", doc.internal.pageSize.width / 2, 20, { align: "center" });

   // Tailwind colors converted to RGB/HEX
   const headerBackgroundColor = '#9999FF'; 
   const headerTextColor = [255, 255, 255];
  // Set up autoTable
  doc.autoTable({
    head: [TABLE_HEAD], // Table headers
    body: paginatedArea.map(area => [
      area.area_id,
      area.area_name,
      area.area_pin,
      area.area_city,
      area.routes ? area.routes.map(route => route.route_name).join('\n') : "",
      area.routes ? area.routes.map(route => route.delivery_boy).join('\n') : "", // Separate each delivery boy with newline
      area.routes ? area.routes.map(route => route.hub).join('\n') : "" // Separate each hub with newline
    ]), // Table data
    startY: 30, // Position to start the table
    margin: { top: 30 },
    theme: "grid", // Adds borders to the table
  headStyles: {
    fillColor: headerBackgroundColor, // Custom header background color
    textColor: headerTextColor, // Custom header text color
    halign: "center", // Center-align header text
  },
  bodyStyles: {
    halign: "center", // Center-align body text
  },
  didDrawPage: (data) => {
    // Add footer at the bottom of the page
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.text(
      `Page ${doc.internal.getNumberOfPages()}`,
      doc.internal.pageSize.width / 2,
      pageHeight - 10,
      { align: "center" }
    );
  },
  });






  // Save the PDF
  doc.save("area_list.pdf");
};


// Export data as Excel
const exportAsExcel = () => {
  // Prepare the data for Excel
  const excelData = [
    TABLE_HEAD, // Headers
    ...paginatedArea.map(area => [
      area.area_id,
      area.area_name,
      area.area_pin,
      area.area_city,
      area.routes ? area.routes.map(route => route.route_name).join(', \n') : "",
      area.routes ? area.routes.map(route => route.delivery_boy).join(', \n') : "", // Use '\n' for line breaks
      area.routes ? area.routes.map(route => route.hub).join(', \n') : "" // Use '\n' for line breaks
    ])
  ];

  // Create a worksheet
  const ws = XLSX.utils.aoa_to_sheet(excelData);

  // Apply style for line breaks in Excel (white-space: pre-line)
  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let row = range.s.r; row <= range.e.r; row++) {
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cell = ws[XLSX.utils.encode_cell({ r: row, c: col })];
      if (cell && typeof cell.v === 'string' && cell.v.includes('\n')) {
        cell.s = { alignment: { wrapText: true } }; // Allow text wrapping
      }
    }
  }

  // Create a workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Area List");

  // Export as Excel file
  XLSX.writeFile(wb, "area_list.xlsx");
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
    <>
      {/*<BrandView key={id} id={id}/>*/}

      <BrandView key={id} id={id} />

      <div className="mt-2">
        <Tabs tabActive={'Delivery Area'} />
      </div>

      <div className="w-full max-w-6xl mx-auto bg-ictext shadow-sm shadow-ictheme rounded-lg p-4 mt-5">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold">Area List</h2>
          </div>
          <div className="flex gap-2 items-center">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-64 pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ictheme"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <img src={MagnifyingGlassIcon} alt="Search" className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchAreas}
              className="bg-icbackgroundcard text-icbackgroundlight px-4 py-2 rounded-md flex items-center gap-2"
            >
              <img src={RefreshIcon} alt="Refresh" className="h-5 w-5" /> Refresh
            </button>

            {/* Export Button */}
            <button
              onClick={openModalExcel}
              className="bg-icbackgroundcard text-icbackgroundlight px-4 py-2 rounded-md flex items-center gap-2"
            >
              <img src={ExportIcon} alt="Refresh" className="h-5 w-5" /> Export
            </button>

            {/* Modal Export*/}
            {isModalOpenExport && (
              <div className="fixed inset-0 bg-icbackgroundcard bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-ictext rounded-lg p-6 w-96">
                  <div className="flex justify-between mb-6">
                    <h2 className="text-lg font-semibold text-icbackgroundcard">
                      Export Options
                    </h2>
                    <button
                      onClick={closeModalExcel}
                      className="text-sm text-ictheme hover:text-gray-700 underline"
                    >
                      <img src={CloseIcon} alt="Refresh" className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={exportAsPDF}
                      className="bg-icbackgroundcard text-icbackgroundlight hover:bg-ictheme hover:text-icbackgroundcard px-4 py-2 rounded-md text-center"
                    >
                      Export as PDF
                    </button>
                    <button
                      onClick={exportAsExcel}
                      className="bg-icbackgroundcard text-icbackgroundlight hover:bg-ictheme hover:text-icbackgroundcard px-4 py-2 rounded-md text-center"
                    >
                      Export as Excel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border bg-white border-gray-300">
            <thead className="bg-icbackgroundcard text-icbackgroundlight">
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th key={head} className="p-2 text-left font-semibold border-b">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedArea.length > 0 ? (
                paginatedArea.map((area) => (
                  area.routes && area.routes.length > 0 ? (
                    area.routes.map((route, index) => (
                      <tr key={`${area.area_id}-${index}`} className="border-b border-icgreylight">
                        {index === 0 && (
                          <>
                            <td rowSpan={area.routes.length} className="px-2 py-1 border border-icgreylight">{area.area_id}</td>
                            <td rowSpan={area.routes.length} className="px-2 py-1 border border-icgreylight">{area.area_name}</td>
                            <td rowSpan={area.routes.length} className="px-2 py-1 border border-icgreylight">{area.area_pin}</td>
                            <td rowSpan={area.routes.length} className="px-2 py-1 border border-icgreylight">{area.area_city}</td>
                          </>
                        )}
                        <td className="px-2 py-1 border border-icgreylight">{route.route_name || ""}</td>
                        <td className="px-2 py-1 border border-icgreylight">{route.delivery_boy || ""}</td>
                        <td className="px-2 py-1 border border-icgreylight">{route.hub || ""}</td>
                      </tr>
                    ))
                  ) : (
                    <tr key={area.area_id} className="border-b border-icgreylight">
                      <td className="px-2 py-1 border border-icgreylight">{area.area_id}</td>
                      <td className="px-2 py-1 border border-icgreylight">{area.area_name}</td>
                      <td className="px-2 py-1 border border-icgreylight">{area.area_pin}</td>
                      <td className="px-2 py-1 border border-icgreylight">{area.area_city}</td>
                      <td className="px-2 py-1 border border-icgreylight"></td>
                      <td className="px-2 py-1 border border-icgreylight"></td>
                      <td className="px-2 py-1 border border-icgreylight"></td>
                    </tr>
                  )
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-3 text-center text-gray-500">No Area found</td>
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
    </>
  );
}

export default Area;
