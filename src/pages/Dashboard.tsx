import { WalletSummary } from "../components/Wallet/WalletSummary";
import { useWallet } from "../hooks/useWallet";

const Dashboard = () => {
  const { data, isLoading, error } = useWallet();

  if (isLoading) return <div>Loading Wallet...</div>;
  if (error) return <div>Error fetching wallet info</div>;

  return (
    <div className="max-w-4xl p-4 mx-auto w-full">
      <h2 className="text-3xl font-semibold mb-4 dark:text-white">Dashboard</h2>
      <WalletSummary {...data} />
    </div>
  );
};

export default Dashboard;
