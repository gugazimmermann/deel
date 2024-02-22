import { useCallback, useState } from "react";
import { useApp } from "../context/AppContext";
import { Alert, Loading, Table } from "../components";
import PagesLayout from "./PagesLayout";

function Jobs() {
  const { state } = useApp();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState();
  const [success, setSuccess] = useState();
  const [jobs, setJobs] = useState([]);
  const [jobId, setJobId] = useState("");

  const clearAll = () => {
    setAlert();
    setJobs([]);
  };

  const handlePayJob = async (e) => {
    e.preventDefault();
    clearAll();
    setLoading(true);
    const response = await fetch(`jobs/${jobId}/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        profile_id: state.profileID || null,
      },
    });
    const res = await response.json();
    if (res.error) setAlert(res.error);
    else setSuccess(res.message);
    setLoading(false);
  };

  const getJobsUnpaid = useCallback(async () => {
    clearAll();
    setLoading(true);
    const response = await fetch("jobs/unpaid", {
      method: "GET",
      headers: { profile_id: state.profileID || null },
    });
    const res = await response.json();
    if (res.error) setAlert(res.error);
    else setJobs(res);
    setLoading(false);
  }, [state.profileID]);

  return (
    <PagesLayout title="jobs">
      <div className="w-full flex flex-row justify-between items-center mt-4">
        <div className="w-1/2 flex justify-start">
          <button
            type="button"
            onClick={() => getJobsUnpaid()}
            className="bg-blue-800 rounded-md px-2 py-1 text-slate-50 w-1/3"
          >
            List Unpaid
          </button>
        </div>
        <div className="w-1/2 flex justify-end gap-4">
          <form onSubmit={handlePayJob}>
            <label className="text-slate-500 mr-4" htmlFor="contract_id">
              Pay for a Job
            </label>
            <input
              id="job_id"
              name="job_id"
              data-testid="pay-job-id"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              className="px-2 py-1 text-gray-700 bg-white border border-gray-200 rounded-md mr-4"
            />
            <button
              type="submit"
              data-testid="pay-job-submit"
              className="bg-blue-800 rounded-md px-2 py-1 text-slate-50"
            >
              Send
            </button>
          </form>
        </div>
      </div>
      {(alert || success) && (
        <Alert text={alert || success} success={success} />
      )}
      {loading && <Loading />}
      {jobs.length > 0 && (
        <Table
          headers={["ID", "description", "price", "created at", "contract id"]}
          body={jobs.map((j) => [
            j.id,
            j.description,
            parseFloat(j.price).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            }),
            j.createdAt.split("T")[0],
            j.ContractId,
          ])}
        />
      )}
    </PagesLayout>
  );
}

export default Jobs;
