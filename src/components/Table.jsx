import TableHeadRow from "./TableHeadRow";
import TableBodyRow from "./TableBodyRow";

const Table = ({ headers, body }) => {
  return (
    <table className="min-w-full text-left mt-4">
      <thead className="border-b font-medium">
        <tr>
          {headers.map((h) => (
            <TableHeadRow key={h} text={h} />
          ))}
        </tr>
      </thead>
      <tbody>
        {body.map((row, i) => (
          <tr key={i} className="border-b">
            {row.map((r, i) => (
              <TableBodyRow key={`${r}#${i}`} text={r} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
