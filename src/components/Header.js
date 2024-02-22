import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import NavBar from "./NavBar";

const Header = () => {
  const { state, dispatch } = useApp();
  const [profileId, setProfileId] = useState("");

  const handleChangeProfileId = (value) => {
    dispatch({
      type: "PROFILE_ID",
      payload: { profileID: value },
    });
    setProfileId(value);
  };

  useEffect(() => {
    if (state.profileID) setProfileId(state.profileID);
  }, [state.profileID]);

  return (
    <header className="py-2 w-full bg-blue-100 shadow-md shadow-black/5">
      <div className="container mx-auto flex items-center justify-between">
        <div className="w-1/2 flex justify-start items-center">
          <img src="/images/logo.png" alt="Deel Logo" className="w-16 h-auto" />
          <NavBar />
        </div>
        <div className="w-1/2 flex justify-end items-center gap-4">
          <label className="text-slate-500" htmlFor="profile_id">
            Client or Contractor Id
          </label>
          <select
            id="profile_id"
            name="profile_id"
            data-testid="select-profile-id"
            value={profileId}
            onChange={(e) => handleChangeProfileId(e.target.value)}
            className="px-2 py-1 text-gray-700 bg-white border border-gray-200 rounded-md"
          >
            {Array.from({ length: 8 }, (_, index) => index + 1).map((pid) => (
              <option key={pid} value={pid}>
                {pid}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};

export default Header;
