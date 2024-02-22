import { PageTitle } from "../components";

const PagesLayout = ({ title, children }) => {
  return (
    <section className="container flex flex-col flex-grow items-start justify-start m-auto w-full bg-slate-50 p-4">
      <PageTitle title={title} />
      {children}
    </section>
  );
};

export default PagesLayout;
