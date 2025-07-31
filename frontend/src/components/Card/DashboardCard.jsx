const DashboardCard = ({ title, value }) => {
    
  return (
    <div className="bg-[#151515] rounded-xl shadow-xl p-4 w-full">
      <h3 className="text-lg text-white mb-4">{title}</h3>
      <p className="text-2xl font-bold text-gray-300">{value}</p>
    </div>
  );
};

export default DashboardCard;
