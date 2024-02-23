import { useState } from "react";
import { useApp } from "../context/AppContext";
import { balancesDeposit } from "../services";
import { Alert, Loading, Table } from "../components";
import PagesLayout from "./PagesLayout";

function Balances() {
  const { state } = useApp();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState();
  const [newBalance, setNewBalance] = useState();
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");

  const clearAll = () => {
    setAlert();
    setNewBalance();
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    clearAll();
    setLoading(true);
    const res = await balancesDeposit(state.profileID, userId, amount);
    if (res.error) setAlert(res.error);
    else setNewBalance(res);
    setLoading(false);
  };

  return (
    <PagesLayout title="balances">
      <div className="w-full flex flex-row justify-between items-center mt-4">
        <form onSubmit={handleDeposit}>
          <input
            id="user_id"
            name="user_id"
            data-testid="balances-user-id"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="px-2 py-1 text-gray-700 bg-white border border-gray-200 rounded-md mr-4"
          />
          <input
            id="amount"
            name="amount"
            data-testid="balances-amount"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="px-2 py-1 text-gray-700 bg-white border border-gray-200 rounded-md mr-4"
          />
          <button
            type="submit"
            data-testid="balances-submit"
            className="bg-blue-800 rounded-md px-2 py-1 text-slate-50"
          >
            Send Deposit
          </button>
        </form>
      </div>
      {alert && <Alert text={alert} />}
      {loading && <Loading />}
      {newBalance && (
        <Table
          headers={["New Balance"]}
          body={[
            [
              parseFloat(newBalance.newBalance).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              }),
            ],
          ]}
        />
      )}
    </PagesLayout>
  );
}

export default Balances;
