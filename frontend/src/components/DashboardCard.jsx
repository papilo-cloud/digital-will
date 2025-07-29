const DashboardCard = ({ title, value }) => {
    
  return (
    <div className="bg-[#151515] rounded-xl shadow-xl p-4 w-full">
      <h3 className="text-lg text-[#ccc]">{title}</h3>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
};

export default DashboardCard;
