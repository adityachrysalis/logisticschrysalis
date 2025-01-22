import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function NewBrand() {
    const apiUrl = import.meta.env.VITE_API_URL; // Backend API URL
    const [formData, setFormData] = useState({
        brand_image: null,
        brand_name: "",
        api_url: "",
        brand_url: "",
        brand_email: "",
        brand_mobile: "",
    });
    const [preview, setPreview] = useState(null);
    const [message, setMessage] = useState("");

    // Cleanup URL object to prevent memory leaks
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, brand_image: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append("brand_image", formData.brand_image);
        formDataToSend.append("brand_name", formData.brand_name);
        formDataToSend.append("api_url", formData.api_url);
        formDataToSend.append("brand_url", formData.brand_url);
        formDataToSend.append("brand_email", formData.brand_email);
        formDataToSend.append("brand_mobile", formData.brand_mobile);

        try {
            const response = await fetch(`${apiUrl}register_brand`, {
                method: "POST",
                body: formDataToSend,
            });

            if (response.success == 0) {
                throw new Error(`Error: ${response.status}`);
            }

            const result = await response.json();
            if (result.success) {
                toast.success("Brand registered successfully!");
                setFormData({
                    brand_image: null,
                    brand_name: "",
                    api_url: "",
                    brand_url: "",
                    brand_email: "",
                    brand_mobile: "",
                });
                setPreview(null);
            } else {
                toast.warn(result.message);
            }
        } catch (error) {
            toast.error(result.message);
        }
    };

    return (
        <>
            <h1 className="text-xl font-semibold text-icbackgroundcard mb-4">
                Dashboard/Brands/New
            </h1>
            <div className="w-full max-w-2xl mx-auto bg-ictex rounded-lg p-6 bg-ictext">
                <h2 className="text-lg font-semibold mb-4">Register New Brand</h2>
                {message && <p className="text-center text-red-500 mb-4">{message}</p>}
                <form onSubmit={handleSubmit}>
                    {/* Image Upload */}
                    <div className="flex items-center gap-4 p-3 rounded-md bg-ictext shadow-ictheme shadow-sm">
                        <label className="block text-icbackgroundcard font-medium">
                            <span className="text-sm">Brand Logo</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="mt-1 block w-full text-sm text-icbackgroundcard
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-icbackgroundcard file:text-icbackgroundlight
                                        hover:file:text-ictheme hover:file:bg-icbackgroundcard"
                                onChange={handleImageChange}
                            />
                        </label>
                        {preview && (
                            <div className="flex items-center justify-center h-20 w-20 rounded overflow-hidden">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        )}
                    </div>

                    <div className="p-3 mt-10 rounded-md shadow-ictheme shadow-sm bg-ictext">
                        {/* Brand Name */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-icbackgroundcard mb-1">
                                Brand Name <span className="text-icred">*</span>
                            </label>
                            <input
                                type="text"
                                name="brand_name"
                                value={formData.brand_name}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        {/* API URL and Brand URL */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-icbackgroundcard mb-1">API URL</label>
                                <input
                                    type="url"
                                    name="api_url"
                                    value={formData.api_url}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-icbackgroundcard mb-1">Brand URL</label>
                                <input
                                    type="url"
                                    name="brand_url"
                                    value={formData.brand_url}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        </div>

                        {/* Brand Email and Mobile */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-icbackgroundcard mb-1">
                                    Brand Email <span className="text-icred">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="brand_email"
                                    value={formData.brand_email}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-icbackgroundcard mb-1">Brand Mobile</label>
                                <input
                                    type="tel"
                                    name="brand_mobile"
                                    value={formData.brand_mobile}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        </div>
                    </div>
                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full mt-10 shadow-ictheme shadow-sm bg-icbackgroundcard text-icbackgroundlight py-2 rounded hover:text-ictheme focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Register
                    </button>
                </form>
            </div>
        </>
    );
}

export default NewBrand;
