import { jsx as _jsx } from "react/jsx-runtime";
export const ThreatBadge = ({ level }) => {
    const colors = {
        low: "bg-green-100 text-green-800",
        medium: "bg-yellow-100 text-yellow-800",
        high: "bg-orange-100 text-orange-800",
        critical: "bg-red-100 text-red-800",
    };
    return (_jsx("div", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[level]}`, children: level.charAt(0).toUpperCase() + level.slice(1) }));
};
export default ThreatBadge;
