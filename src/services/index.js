export const contractById = async (profileID, contractId) => {
  try {
    const response = await fetch(`contracts/${contractId}`, {
      method: "GET",
      headers: { profile_id: profileID || null },
    });
    return await response.json();
  } catch (err) {
    return err;
  }
};

export const contractsAll = async (profileID) => {
  try {
    const response = await fetch("contracts", {
      method: "GET",
      headers: { profile_id: profileID || null },
    });
    return await response.json();
  } catch (err) {
    return err;
  }
};

export const jobsUnpaid = async (profileID) => {
  try {
    const response = await fetch("jobs/unpaid", {
      method: "GET",
      headers: { profile_id: profileID || null },
    });
    return await response.json();
  } catch (err) {
    return err;
  }
};

export const jobsPay = async (profileID, jobId) => {
  try {
    const response = await fetch(`jobs/${jobId}/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        profile_id: profileID || null,
      },
    });
    return await response.json();
  } catch (err) {
    return err;
  }
};

export const balancesDeposit = async (profileID, userId, amount) => {
  try {
    const response = await fetch(`balances/deposit/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        profile_id: profileID || null,
      },
      body: JSON.stringify({ amount }),
    });
    return await response.json();
  } catch (err) {
    return err;
  }
};

export const adminBestClients = async (startDate, endDate, limit) => {
  try {
    const response = await fetch(
      `admin/best-clients?start=${startDate}&end=${endDate}&limit=${limit}`,
      { method: "GET" }
    );
    return await response.json();
  } catch (err) {
    return err;
  }
};

export const adminBestProfession = async (startDate, endDate) => {
  try {
    const response = await fetch(
      `admin/best-profession?start=${startDate}&end=${endDate}`,
      { method: "GET" }
    );
    return await response.json();
  } catch (err) {
    return err;
  }
};
