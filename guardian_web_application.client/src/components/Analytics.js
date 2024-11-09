import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, AlertTriangle, Zap, Globe, Shield, Radio, BarChart2, Eye, Loader2, RefreshCcw } from "lucide-react";
import { useAnalytics } from './hooks/useAnalytics';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
const PacketAnalysisSection = ({ packets, onResolve, loading, }) => {
    const [selectedPacket, setSelectedPacket] = useState(null);
    const [isPacketDetailOpen, setIsPacketDetailOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    // Reset to first page when items per page changes or when packets change
    useEffect(() => {
        setCurrentPage(1);
    }, [itemsPerPage, packets.length]);
    const totalPages = Math.ceil(packets.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPackets = packets.slice(startIndex, endIndex);
    const getSeverityBadge = (severity) => {
        const severityColors = {
            "low": "bg-green-100 text-green-800",
            "medium": "bg-yellow-100 text-yellow-800",
            "high": "bg-red-100 text-red-800",
            "critical": "bg-purple-100 text-purple-800"
        };
        // Add type safety for the severity check
        const severityKey = (severity === null || severity === void 0 ? void 0 : severity.toLowerCase()) || "";
        const colorClass = severityColors[severityKey] || "bg-gray-100 text-gray-800";
        return (_jsx(Badge, { variant: "outline", className: colorClass, children: severity || "Unknown" }));
    };
    if (loading) {
        return (_jsx(Card, { className: "col-span-12", children: _jsx(CardContent, { className: "flex items-center justify-center p-12", children: _jsxs("div", { className: "text-center space-y-4", children: [_jsx(Loader2, { className: "w-8 h-8 animate-spin mx-auto text-primary" }), _jsx("p", { className: "text-sm text-gray-600", children: "Loading packet data..." })] }) }) }));
    }
    return (_jsxs(_Fragment, { children: [_jsxs(Card, { className: "col-span-12", children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Shield, { className: "w-5 h-5 text-orange-500" }), "Packet Analysis"] }), _jsx("div", { className: "flex items-center gap-2", children: _jsxs(Select, { value: itemsPerPage.toString(), onValueChange: (value) => setItemsPerPage(parseInt(value)), children: [_jsx(SelectTrigger, { className: "w-32", children: _jsx(SelectValue, { placeholder: `${itemsPerPage} per page` }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "5", children: "5 per page" }), _jsx(SelectItem, { value: "10", children: "10 per page" }), _jsx(SelectItem, { value: "20", children: "20 per page" })] })] }) })] }), _jsxs(CardContent, { children: [_jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Source IP" }), _jsx(TableHead, { children: "Destination IP" }), _jsx(TableHead, { children: "Information" }), _jsx(TableHead, { children: "Attack Type" }), _jsx(TableHead, { children: "Severity" }), _jsx(TableHead, { children: "Actions" })] }) }), _jsx(TableBody, { children: currentPackets.map((packet) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: packet.ipSrc || 'N/A' }), _jsx(TableCell, { children: packet.ipDst || 'N/A' }), _jsx(TableCell, { children: packet.info || 'N/A' }), _jsx(TableCell, { children: packet.type || 'None' }), _jsx(TableCell, { children: getSeverityBadge(packet.severity) }), _jsx(TableCell, { children: _jsxs("div", { className: "flex space-x-2", children: [_jsxs(Button, { size: "sm", variant: "outline", onClick: () => {
                                                                    setSelectedPacket(packet);
                                                                    setIsPacketDetailOpen(true);
                                                                }, children: [_jsx(Eye, { className: "w-4 h-4 mr-1" }), " View"] }), _jsx(Button, { size: "sm", variant: "destructive", onClick: () => onResolve(packet.id), children: "Resolve" })] }) })] }, packet.id))) })] }), _jsxs("div", { className: "flex items-center justify-between mt-4", children: [_jsxs("p", { className: "text-sm text-gray-600", children: ["Showing ", startIndex + 1, " to ", Math.min(endIndex, packets.length), " of ", packets.length, " entries"] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => setCurrentPage(prev => Math.max(1, prev - 1)), disabled: currentPage === 1, children: "Previous" }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => setCurrentPage(prev => Math.min(totalPages, prev + 1)), disabled: currentPage === totalPages, children: "Next" })] })] })] })] }), _jsx(Dialog, { open: isPacketDetailOpen, onOpenChange: setIsPacketDetailOpen, children: _jsxs(DialogContent, { className: "max-w-2xl", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Packet Details" }), _jsx(DialogDescription, { children: "Detailed information about the selected network packet" })] }), selectedPacket && (_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "mb-2 font-semibold", children: "Packet Source" }), _jsxs("div", { className: "p-3 bg-gray-100 rounded-md", children: [_jsxs("p", { children: [_jsx("strong", { children: "IP:" }), " ", selectedPacket.ipSrc || 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { children: "Port:" }), " ", selectedPacket.port || 'N/A'] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "mb-2 font-semibold", children: "Packet Destination" }), _jsx("div", { className: "p-3 bg-gray-100 rounded-md", children: _jsxs("p", { children: [_jsx("strong", { children: "IP:" }), " ", selectedPacket.ipDst || 'N/A'] }) })] }), _jsxs("div", { className: "col-span-2", children: [_jsx("h3", { className: "mb-2 font-semibold", children: "Additional Info" }), _jsxs("div", { className: "p-3 bg-gray-100 rounded-md", children: [_jsxs("p", { children: [_jsx("strong", { children: "Service:" }), " ", selectedPacket.service || 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { children: "Details:" }), " ", selectedPacket.info || 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { children: "Attack Type:" }), " ", selectedPacket.type || 'None'] }), _jsxs("p", { children: [_jsx("strong", { children: "Severity:" }), " ", selectedPacket.severity || 'Unknown'] }), _jsxs("p", { children: [_jsx("strong", { children: "Status:" }), " ", selectedPacket.status || 'Unknown'] }), _jsxs("p", { children: [_jsx("strong", { children: "Timestamp:" }), " ", new Date(selectedPacket.timestamp).toLocaleString()] })] })] })] }))] }) })] }));
};
const Analytics = ({ title }) => {
    var _a, _b, _c, _d, _e, _f;
    const { stats, trafficData, protocolData, packets, loading, error, refreshData, resolvePacket } = useAnalytics();
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center w-full h-screen", children: _jsxs("div", { className: "text-center space-y-4", children: [_jsx(Loader2, { className: "w-12 h-12 animate-spin mx-auto text-primary" }), _jsx("p", { className: "text-lg text-gray-600", children: "Loading analytics data..." })] }) }));
    }
    if (error) {
        return (_jsx("div", { className: "flex items-center justify-center w-full h-screen", children: _jsxs("div", { className: "text-center space-y-4", children: [_jsx(AlertTriangle, { className: "w-12 h-12 mx-auto text-red-500" }), _jsx("p", { className: "text-lg text-red-600", children: error }), _jsxs(Button, { onClick: refreshData, className: "gap-2", children: [_jsx(RefreshCcw, { className: "w-4 h-4" }), "Retry"] })] }) }));
    }
    const statsCards = [
        {
            title: "Total Packets",
            value: (_a = stats === null || stats === void 0 ? void 0 : stats.totalPackets.toLocaleString()) !== null && _a !== void 0 ? _a : "0",
            change: `${stats === null || stats === void 0 ? void 0 : stats.changes.totalPackets.toFixed(1)}%`,
            icon: Radio,
            color: "blue"
        },
        {
            title: "High Risk",
            value: (_b = stats === null || stats === void 0 ? void 0 : stats.highRiskPackets.toLocaleString()) !== null && _b !== void 0 ? _b : "0",
            change: `${stats === null || stats === void 0 ? void 0 : stats.changes.highRiskPackets.toFixed(1)}%`,
            icon: AlertTriangle,
            color: "red"
        },
        {
            title: "Active Sessions",
            value: (_c = stats === null || stats === void 0 ? void 0 : stats.activeSessions.toLocaleString()) !== null && _c !== void 0 ? _c : "0",
            change: `${stats === null || stats === void 0 ? void 0 : stats.changes.activeSessions.toFixed(1)}%`,
            icon: Zap,
            color: "green"
        },
        {
            title: "Bandwidth Usage",
            value: `${((_d = stats === null || stats === void 0 ? void 0 : stats.bandwidthUsage) !== null && _d !== void 0 ? _d : 0).toFixed(1)} TB`,
            change: `${stats === null || stats === void 0 ? void 0 : stats.changes.bandwidthUsage.toFixed(1)}%`,
            icon: Activity,
            color: "purple"
        },
        {
            title: "Unique IPs",
            value: (_e = stats === null || stats === void 0 ? void 0 : stats.uniqueIPs.toLocaleString()) !== null && _e !== void 0 ? _e : "0",
            change: `${stats === null || stats === void 0 ? void 0 : stats.changes.uniqueIPs.toFixed(1)}%`,
            icon: Globe,
            color: "indigo"
        },
        {
            title: "Threats Blocked",
            value: (_f = stats === null || stats === void 0 ? void 0 : stats.threatsBlocked.toLocaleString()) !== null && _f !== void 0 ? _f : "0",
            change: `${stats === null || stats === void 0 ? void 0 : stats.changes.threatsBlocked.toFixed(1)}%`,
            icon: Shield,
            color: "orange"
        }
    ];
    return (_jsx("div", { className: "relative flex w-full h-screen p-5 bg-gray-100 shadow-md lg:p-5", children: _jsxs("div", { className: "flex flex-col w-full h-full bg-white rounded-md shadow-md", children: [_jsx("div", { className: "flex items-center justify-between p-4 border-b border-gray-200", children: _jsx("h1", { className: "text-2xl font-normal text-gray-800 font-poppins", children: title }) }), _jsxs("div", { className: "flex-1 p-6 overflow-auto", children: [_jsx("div", { className: "grid grid-cols-6 gap-4 mb-6", children: statsCards.map((stat, index) => (_jsxs(Card, { className: "transition-all duration-300 hover:shadow-lg", children: [_jsx(CardHeader, { className: "pb-2", children: _jsxs(CardTitle, { className: "flex items-center gap-2 text-sm", children: [_jsx(stat.icon, { className: "w-4 h-4" }), stat.title] }) }), _jsxs(CardContent, { children: [_jsx("p", { className: "text-2xl font-bold", children: stat.value }), _jsxs("p", { className: `text-sm ${stat.change.startsWith('-') ? 'text-red-600' : 'text-green-600'}`, children: [stat.change, " from last period"] })] })] }, index))) }), _jsxs("div", { className: "grid grid-cols-12 gap-6 mb-6", children: [_jsxs(Card, { className: "col-span-8", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(BarChart2, { className: "w-5 h-5 text-blue-500" }), "Network Traffic Overview"] }) }), _jsx(CardContent, { className: "h-72", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(LineChart, { data: trafficData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name" }), _jsx(YAxis, { yAxisId: "left" }), _jsx(YAxis, { yAxisId: "right", orientation: "right" }), _jsx(Tooltip, {}), _jsx(Line, { yAxisId: "left", type: "monotone", dataKey: "packets", stroke: "#2563eb", strokeWidth: 2, dot: { r: 4 }, activeDot: { r: 8 } }), _jsx(Line, { yAxisId: "right", type: "monotone", dataKey: "bandwidth", stroke: "#16a34a", strokeWidth: 2, dot: { r: 4 }, activeDot: { r: 8 } })] }) }) })] }), _jsxs(Card, { className: "col-span-4", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Activity, { className: "w-5 h-5 text-purple-500" }), "Protocol Distribution"] }) }), _jsx(CardContent, { className: "h-72", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: protocolData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name", tick: { fontSize: 12 }, interval: 0, angle: -45, textAnchor: "end", height: 60 }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "value", fill: "#8884d8", name: "Count", label: {
                                                                position: 'top',
                                                                fontSize: 12
                                                            } })] }) }) })] }), _jsx(PacketAnalysisSection, { packets: packets, onResolve: resolvePacket })] })] })] }) }));
};
export default Analytics;
