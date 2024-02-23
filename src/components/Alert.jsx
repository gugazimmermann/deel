const Alert = ({ text, success }) => {
  return (
    <div className={`w-1/2 mx-auto text-center rounded-md border font-bold my-8 ${success ? "border-green-800 bg-green-300 text-green-800" : "border-red-800 bg-red-300 text-red-800"}`}>
      {text}
    </div>
  );
};

export default Alert;
