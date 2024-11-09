import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (_jsxs("div", { className: "p-4 border border-gray-200 rounded-lg shadow-lg bg-white/90 backdrop-blur-sm", children: [_jsx("p", { className: "text-sm font-semibold text-gray-800", children: label }), payload.map((entry, index) => (_jsx("p", { className: "text-sm", style: { color: entry.color }, children: `${entry.name}: ${entry.value}` }, index)))] }));
    }
    return null;
};
export default CustomTooltip;
