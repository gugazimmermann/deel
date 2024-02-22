import { useCallback, useState } from "react";
import { useApp } from "../context/AppContext";
import { Alert, Loading, Table } from "../components";
import PagesLayout from "./PagesLayout";

function Contracts() {
  const { state } = useApp();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState();
  const [contracts, setContracts] = useState([]);
  const [contractId, setContractId] = useState("");

  const clearAll = () => {
    setAlert();
    setContracts([]);
  };

  const handleSearchContractId = async (e) => {
    e.preventDefault();
    clearAll();
    setLoading(true);
    const response = await fetch(`contracts/${contractId}`, {
      method: "GET",
      headers: { profile_id: state.profileID || null },
    });
    const res = await response.json();
    if (res.error) setAlert(res.error);
    else setContracts([res]);
    setLoading(false);
  };

  const getContracts = useCallback(async () => {
    clearAll();
    setLoading(true);
    const response = await fetch("contracts", {
      method: "GET",
      headers: { profile_id: state.profileID || null },
    });
    const res = await response.json();
    if (res.error) setAlert(res.error);
    else setContracts(res);
    setLoading(false);
  }, [state.profileID]);

  return (
    <PagesLayout title="contracts">
      <div className="w-full flex flex-row justify-between items-center mt-4">
        <div className="w-1/2 flex justify-start">
          <button
            type="button"
            onClick={() => getContracts()}
            className="bg-blue-800 rounded-md px-2 py-1 text-slate-50 w-1/3"
          >
            List
          </button>
        </div>
        <div className="w-1/2 flex justify-end gap-4">
          <form onSubmit={handleSearchContractId}>
            <label className="text-slate-500 mr-4" htmlFor="contract_id">
              Search by ID
            </label>
            <input
              id="contract_id"
              name="contract_id"
              data-testid="search-contract-id"
              value={contractId}
              onChange={(e) => setContractId(e.target.value)}
              className="px-2 py-1 text-gray-700 bg-white border border-gray-200 rounded-md mr-4"
            />
            <button
              type="submit"
              data-testid="search-contract-submit"
              className="bg-blue-800 rounded-md px-2 py-1 text-slate-50"
            >
              Search
            </button>
          </form>
        </div>
      </div>
      {alert && <Alert text={alert} />}
      {loading && <Loading />}
      {contracts.length > 0 && (
        <Table
          headers={["ID", "terms", "created at", "contractor id", "client id"]}
          body={contracts.map((c) => [
            c.id,
            c.terms,
            c.createdAt.split("T")[0],
            c.ContractorId,
            c.ClientId,
          ])}
        />
      )}
    </PagesLayout>
  );
}

export default Contracts;
