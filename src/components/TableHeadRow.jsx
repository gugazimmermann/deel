const TableHeadRow = ({ text }) => {
  return (
    <th scope="col" className="p-2 capitalize">
      {text}
    </th>
  );
};

export default TableHeadRow;
