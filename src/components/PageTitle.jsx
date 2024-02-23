const PageTitle = ({ title }) => {
  return (
    <div className="w-full">
      <div className="rounded-md bg-blue-800 px-4 py-2">
        <h1 className="text-slate-50 font-bold text-xl capitalize">{title}</h1>
      </div>
    </div>
  );
};

export default PageTitle;
