import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Tabs from "./include/Tabs";
import RefreshIcon from '../../../assets/icons/refresh.svg';
import CloseIcon from '../../../assets/icons/close.svg';
import ExportIcon from '../../../assets/icons/export.svg';
import MagnifyingGlassIcon from '../../../assets/icons/search.svg';
import BrandView from "./include/BrandView";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { ClipLoader } from "react-spinners";

function Hub() {
  const { id } = useParams();
  const TABLE_HEAD = ["Hub ID", "Hub Name", "City"];
  // const BrandApiUrl = 'http://139.59.36.8/testpaavimilk/admin/logistics_api.php?action=';

  const [search, setSearch] = useState("");
  const [hublist, setHublist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Adjust as needed


  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchBrandInfo = () => {
    fetch(`${apiUrl}brand_data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })

// fetch(`${apiUrl}brand_data`, {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({ id: id }),
//   mode: "no-cors", // Correct placement inside the options object
// })
.then(response => console.log(response))
.catch(error => console.error(error));

      
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          fetchHubs(data.brand.api_url);
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


  const fetchHubs = (BrandApiUrl) => {
    setLoading(true);

    fetch(`${BrandApiUrl}get_hub`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.hublist) {
          setHublist(data.hublist);
          setCurrentPage(1); // Reset to first page on new fetch
        } else {
          setError(data.message || "No hubs found.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch data");
        setLoading(false);
      });
  };


  // Filter hubs based on search input
  const filteredHubs = hublist.filter((hub) =>
    ['id:'+hub.HubId, 'name:'+hub.Hub_Name, 'city:'+hub.City_Name]
      .some((field) => field && field.toString().toLowerCase().includes(search.toLowerCase()))
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredHubs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHubs = filteredHubs.slice(startIndex, startIndex + itemsPerPage);

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

  const exportAsPDF = () => {
    const doc = new jsPDF();
  
    // Add brand name to the top
    const BrandName = import.meta.env.VITE_BRAND_NAME;
    doc.setFontSize(14);
    doc.setTextColor('#252525'); // Black color for the brand name
    doc.text(BrandName, 14, 10); // Left-aligned brand name
  
    // Add title to the top center of the page
    doc.setFontSize(16);
    doc.text("Hub List", doc.internal.pageSize.width / 2, 20, { align: "center" });
  
    // Define table data and styles
    const tableData = filteredHubs.map((hub) => [
      hub.HubId,
      hub.Hub_Name,
      hub.City_Name,
    ]);
  
    // Tailwind colors converted to RGB/HEX
    const headerBackgroundColor = '#9999FF'; // Example Tailwind `bg-ictheme` (adjust to match your theme)
    const headerTextColor = [255, 255, 255]; // Example Tailwind `text-ictext` (white)
  
    // Add the table with styles
    doc.autoTable({
      head: [TABLE_HEAD],
      body: tableData,
      margin: { top: 30 }, // Adjusted margin for spacing below the title
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
    doc.save("Hub_List.pdf");
    closeModalExcel();
  };
  
  

  const exportAsExcel = () => {
    // Add custom headers and format the data
    const headers = ["Hub ID", "Hub Name", "City Name"]; // Custom headers
    const data = filteredHubs.map((hub) => [hub.HubId, hub.Hub_Name, hub.City_Name]);
  
    // Create worksheet and append headers and data
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
  
    // Styling for headers
    const headerRange = XLSX.utils.decode_range(worksheet['!ref']);
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      worksheet[cellAddress].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } }, // White text
        fill: { fgColor: { rgb: "0C4A6E" } }, // Custom Tailwind-like background color
      };
    }
  
    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hub List");
  
    // Write the Excel file
    XLSX.writeFile(workbook, "Hub_List.xlsx");
    closeModalExcel();
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
      <BrandView key={id} id={id}/>

      <div className="mt-2">
          <Tabs tabActive={'Hub'}/>
      </div>

      <div className="w-full max-w-6xl mx-auto bg-ictext shadow-sm shadow-ictheme rounded-lg p-4 mt-5">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold">Hub List</h2>
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
              onClick={fetchHubs}
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
              {paginatedHubs.length > 0 ? (
                paginatedHubs.map((hub) => (
                  <tr key={hub.HubId} className="border-b border-icgreylight">
                    <td className="px-2 border border-icgreylight">{hub.HubId}</td>
                    <td className="px-2 border border-icgreylight">{hub.Hub_Name}</td>
                    <td className="px-2 border border-icgreylight">{hub.City_Name}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-3 text-center text-gray-500">No hubs found</td>
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

export default Hub;
