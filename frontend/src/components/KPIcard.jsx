const KpiCard = ({
    icon,
    label,
    value,
    description,
    status,
    warning = false
}) => {
    return (
        <div className="stat-card">
            <div className="stat-card-top">
                <div
                    className={`stat-icon ${
                        warning ? "warning" : ""
                    }`}
                >
                    {icon}
                </div>

                {status && (
                    <span
                        className={`stat-change ${
                            warning
                                ? "warning-text"
                                : "positive"
                        }`}
                    >
                        {status}
                    </span>
                )}
            </div>

            <p>{label}</p>

            <h2>{value}</h2>

            <span className="stat-footer">
                {description}
            </span>
        </div>
    );
};

export default KpiCard;