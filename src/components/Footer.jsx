function Footer(){
    const BrandName = import.meta.env.VITE_BRAND_NAME;
    return(
        <footer className="p-6 text-center text-icbackgroundlight z-10 ">
            <p>&copy; {new Date().getFullYear()} {BrandName} All Rights Reserved | A cloud based solution by Chrysalis Software & Systems Pvt. Ltd.</p>
        </footer>
    );
}

export default Footer;