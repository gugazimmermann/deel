import { useCallback, useEffect, useState } from "react";

function App() {
  const [contracts, setContracts] = useState([]);

  const getContracts = useCallback(async () => {
    const response = await fetch("contracts", {
      method: "GET",
      headers: { "profile_id": 1 },
    });
    const res = await response.json();
    setContracts(res)
  }, []);

  useEffect(() => {
    getContracts();
  }, [getContracts]);

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Deel</h1>
      {contracts.map(c => (
        <pre key={c.id}>{JSON.stringify(c, undefined, 2)}</pre>
      ))}
    </div>
  );
}

export default App;
