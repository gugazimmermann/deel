import { Outlet } from "react-router";
import { Header } from "./components";

const SiteLayout = () => {
  return (
    <main className="flex flex-col min-h-screen w-full bg-slate-300">
      <Header />
      <Outlet />
    </main>
  );
};

export default SiteLayout;
