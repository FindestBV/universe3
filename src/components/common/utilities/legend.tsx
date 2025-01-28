export const Legend = ({ data, selectedItems, onChange }) => (
  <div className="legendContainer">
    {data.map((d) => (
      <div className="checkbox" style={{ color: d.color }} key={d.name}>
        {d.name !== "Portfolio" && (
          <input
            type="checkbox"
            value={d.name}
            checked={selectedItems.includes(d.name)}
            onChange={() => onChange(d.name)}
          />
        )}
        <label>{d.name}</label>
      </div>
    ))}
  </div>
);

export default Legend;
