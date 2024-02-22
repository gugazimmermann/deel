import { useState } from "react";
import { adminBestClients, adminBestProfession } from "../services";
import { Alert, Loading, Table } from "../components";
import PagesLayout from "./PagesLayout";

const maskDate = (value) => {
  if (!value) return "";
  return value
    .replace(/\D+/g, "")
    .replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")
    .slice(0, 10);
};

const maskLimit = (value) => {
  if (!value) return "";
  return value.replace(/\D+/g, "");
};

function Admin() {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState();
  const [bestProfession, setBestProfession] = useState();
  const [BestClients, setBestClients] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [limit, setLimit] = useState("");

  const clearAll = () => {
    setAlert();
    setBestProfession();
    setBestClients([]);
  };

  const validateDates = (start, end) => {
    if (!start || !end) {
      setAlert("Must have start and end date");
      return false;
    }
    return true;
  };

  const getBestProfession = async () => {
    clearAll();
    if (!validateDates(startDate, endDate)) return;
    setLoading(true);
    const res = await adminBestProfession(startDate, endDate);
    if (res.error) setAlert(res.error);
    else setBestProfession(res);
    setLoading(false);
  };

  const getBestClients = async () => {
    clearAll();
    if (!validateDates(startDate, endDate)) return;
    setLoading(true);
    const res = await adminBestClients(startDate, endDate, limit);
    if (res.error) setAlert(res.error);
    else setBestClients(res);
    setLoading(false);
  };

  return (
    <PagesLayout title="admin">
      <div className="w-full flex flex-row justify-between items-center mt-4">
        <div className="w-2/3 flex justify-start  gap-4">
          <form>
            <input
              id="start-date"
              name="start-date"
              data-testid="start-date"
              placeholder="Start Date"
              value={maskDate(startDate)}
              onChange={(e) => setStartDate(maskDate(e.target.value))}
              className="w-1/4 px-2 py-1 text-gray-700 bg-white border border-gray-200 rounded-md mr-4"
            />
            <input
              id="end-date"
              name="end-date"
              data-testid="end-date"
              placeholder="End Date"
              value={maskDate(endDate)}
              onChange={(e) => setEndDate(maskDate(e.target.value))}
              className="w-1/4 px-2 py-1 text-gray-700 bg-white border border-gray-200 rounded-md mr-4"
            />
            <input
              id="limit"
              name="limit"
              data-testid="limit"
              placeholder="Best Clients Limit"
              type="number"
              min="1"
              value={maskLimit(limit)}
              onChange={(e) => setLimit(maskLimit(e.target.value))}
              className="w-1/4 px-2 py-1 text-gray-700 bg-white border border-gray-200 rounded-md mr-4"
            />
          </form>
        </div>
        <div className="w-1/4 flex justify-end gap-4">
          <button
            type="button"
            data-testid="button-best-profession"
            onClick={() => getBestProfession()}
            className="bg-blue-800 rounded-md px-2 py-1 text-slate-50"
          >
            Best Profession
          </button>
          <button
            type="button"
            data-testid="button-best-clients"
            onClick={() => getBestClients()}
            className="bg-blue-800 rounded-md px-2 py-1 text-slate-50"
          >
            Best Clients
          </button>
        </div>
      </div>
      {alert && <Alert text={alert} />}
      {loading && <Loading />}
      {bestProfession && (
        <Table
          headers={["profession", "total"]}
          body={[
            [
              bestProfession.profession,
              parseFloat(bestProfession.total).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              }),
            ],
          ]}
        />
      )}
      {BestClients.length > 0 && (
        <Table
          headers={["ID", "full name", "paid"]}
          body={BestClients.map((c) => [
            c.id,
            c.fullName,
            parseFloat(c.paid).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            }),
          ])}
        />
      )}
    </PagesLayout>
  );
}

export default Admin;
