
const BoardHeader = ({columnLabels}) => {
    return (
        <div className="column-labels">
            <div className="corner-label" />
            {columnLabels.map((label) => (
                <div key={label} className="label">
                    {label}
                </div>
            ))}
        </div>
    );
};

export default BoardHeader;