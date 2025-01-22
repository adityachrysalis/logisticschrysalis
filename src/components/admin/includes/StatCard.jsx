// StatCard.js
function StatCard({ icon, value, label }) {
    return (
      <div className="shadow-sm shadow-ictheme max-w-sm bg-icwhite rounded-lg p-6 md:w-56">
        <div className="flex items-center justify-between mb-4">
          <img src={icon} alt={`${label} Icon`} className="w-10 h-10 object-contain ml-5" />
          <h2 className="text-2xl font-bold text-center mr-10 text-icbackgroundcard">{value}</h2>
        </div>
        <p className="text-lg text-center text-icbackgroundcard">{label}</p>
      </div>
    );
  }
  
  export default StatCard;