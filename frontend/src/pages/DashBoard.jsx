import DashboardLayout from "../components/DashboardLayout";
import DashboardCard from "../components/Card/DashboardCard";
import useGetWills from "../hooks/useGetWills";
import WillCardHeader from "../components/Card/WillCardHeader";
import WillsCard from "../components/Card/WillsCard";


const Dashboard = () => {

    const {wills, willsCreated, totalBalance, hasWill, willInfo} = useGetWills()

  return (
    <DashboardLayout>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <DashboardCard title={'Wills Created'} value={willsCreated} />
            <DashboardCard title={'Total Value Locked'} value={`${totalBalance.toFixed(5)} ETH`} />
            <DashboardCard title={'My Will Status'} value={hasWill ? (willInfo.executed ? 'Executed' : 'Active'): "You don't have a Will"} />
        </div>
          <WillCardHeader>
              {wills?.map((will, idx) => (
                <WillsCard
                    address={will.address}
                    timeLeft={will.timeLeft > 0 ? will.timeLeft : 0}
                    status={will.executed ? 'Executed' : will.isDead ? 'Dead - Can execute' : 'Alive'}
                    balance={will.balance}
                    lastPing={will.lastPing}
                    deathTimeout={will.deathTimeout}
                    cancelled={will.cancelled? 'Yes' : 'No'}
                />
              ))}
          </WillCardHeader>
    </DashboardLayout>
  );
};

export default Dashboard;
