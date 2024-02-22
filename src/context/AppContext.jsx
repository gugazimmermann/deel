import { createContext, useContext, useReducer, useEffect } from "react";

const AppContext = createContext(undefined);

const appReducer = (state, action) => {
  if (action.type === "PROFILE_ID") {
    return { ...state, profileID: action.payload.profileID };
  } else {
    return { ...state };
  }
};

const AppProvider = ({ children }) => {
  const storedProfileID = localStorage.getItem("profileid");

  const [state, dispatch] = useReducer(appReducer, {
    profileID: storedProfileID ? JSON.parse(storedProfileID) : null
  });

  useEffect(() => {
    localStorage.setItem("profileid", JSON.stringify(state.profileID));
  }, [state.profileID]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export { AppProvider, useApp };
