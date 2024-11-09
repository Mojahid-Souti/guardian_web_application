import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaNetworkWired, FaShieldAlt, FaUserShield, FaTrafficLight } from "react-icons/fa";
export const StatsCards = ({ stats }) => {
    var _a, _b, _c, _d;
    return (_jsxs("div", { className: "grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4", children: [_jsxs(Card, { className: "relative p-0 overflow-hidden bg-gray-100", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20" }), _jsx("div", { className: "absolute inset-[1px] bg-gray-100 rounded-lg" }), _jsxs("div", { className: "relative p-4", children: [_jsx(CardHeader, { className: "p-0 pb-2", children: _jsxs(CardTitle, { className: "flex items-center text-lg text-gray-800", children: [_jsx(FaNetworkWired, { className: "mr-2 text-2xl text-blue-500" }), "Packets"] }) }), _jsxs(CardContent, { className: "p-0", children: [_jsx(CardDescription, { className: "text-2xl font-bold text-gray-900", children: (_b = (_a = stats.TotalPackets) === null || _a === void 0 ? void 0 : _a.toLocaleString()) !== null && _b !== void 0 ? _b : '0' }), _jsxs(CardDescription, { className: "flex items-center text-base", children: [_jsx("span", { className: "text-green-500", children: "+10%" }), _jsx("span", { className: "ml-1 text-gray-500", children: "From last week" })] }), _jsx(Button, { size: "sm", className: "mt-3 text-sm text-white bg-black hover:bg-black/80", children: "View Details" })] })] })] }), _jsxs(Card, { className: "relative p-0 overflow-hidden bg-gray-100", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20" }), _jsx("div", { className: "absolute inset-[1px] bg-gray-100 rounded-lg" }), _jsxs("div", { className: "relative p-4", children: [_jsx(CardHeader, { className: "p-0 pb-2", children: _jsxs(CardTitle, { className: "flex items-center text-lg text-gray-800", children: [_jsx(FaShieldAlt, { className: "mr-2 text-2xl text-red-500" }), "Attacks"] }) }), _jsxs(CardContent, { className: "p-0", children: [_jsx(CardDescription, { className: "text-2xl font-bold text-gray-900", children: (_c = stats.Attacks) !== null && _c !== void 0 ? _c : '0' }), _jsxs(CardDescription, { className: "flex items-center text-base", children: [_jsx("span", { className: "text-red-500", children: "+3" }), _jsx("span", { className: "ml-1 text-gray-500", children: "Last hour" })] }), _jsx(Button, { size: "sm", className: "mt-3 text-sm text-white bg-black hover:bg-black/80", children: "Review Logs" })] })] })] }), _jsxs(Card, { className: "relative p-0 overflow-hidden bg-gray-100", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-green-500/20 to-green-600/20" }), _jsx("div", { className: "absolute inset-[1px] bg-gray-100 rounded-lg" }), _jsxs("div", { className: "relative p-4", children: [_jsx(CardHeader, { className: "p-0 pb-2", children: _jsxs(CardTitle, { className: "flex items-center text-lg text-gray-800", children: [_jsx(FaUserShield, { className: "mr-2 text-2xl text-green-500" }), "Intrusions"] }) }), _jsxs(CardContent, { className: "p-0", children: [_jsx(CardDescription, { className: "text-2xl font-bold text-gray-900", children: (_d = stats.Intrusions) !== null && _d !== void 0 ? _d : '0' }), _jsxs(CardDescription, { className: "flex items-center text-base", children: [_jsx("span", { className: "text-green-500", children: "+20%" }), _jsx("span", { className: "ml-1 text-gray-500", children: "This month" })] }), _jsx(Button, { size: "sm", className: "mt-3 text-sm text-white bg-black hover:bg-black/80", children: "Prevention Logs" })] })] })] }), _jsxs(Card, { className: "relative p-0 overflow-hidden bg-gray-100", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20" }), _jsx("div", { className: "absolute inset-[1px] bg-gray-100 rounded-lg" }), _jsxs("div", { className: "relative p-4", children: [_jsx(CardHeader, { className: "p-0 pb-2", children: _jsxs(CardTitle, { className: "flex items-center text-lg text-gray-800", children: [_jsx(FaTrafficLight, { className: "mr-2 text-2xl text-yellow-500" }), "Threats"] }) }), _jsxs(CardContent, { className: "p-0", children: [_jsx(CardDescription, { className: "text-2xl font-bold text-gray-900", children: "Moderate" }), _jsxs(CardDescription, { className: "flex items-center text-base", children: [_jsx("span", { className: "text-red-500", children: "-2" }), _jsx("span", { className: "ml-1 text-gray-500", children: "Alerts active" })] }), _jsx(Button, { size: "sm", className: "mt-3 text-sm text-white bg-black hover:bg-black/80", children: "Threat Details" })] })] })] })] }));
};
export default StatsCards;
