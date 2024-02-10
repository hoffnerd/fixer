

export const CenterVertically = ({ children, className="" }) => (
    <div className="tableToCenterContent">
        <div className={`cellCentered ${className}`}>{children}</div>
    </div>
);