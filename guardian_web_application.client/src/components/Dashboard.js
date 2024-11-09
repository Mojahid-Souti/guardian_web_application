var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { fetchPackets, fetchStats, fetchTrends, fetchTypes, ignorePacket } from '@/api/dashboard';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Area, AreaChart } from "recharts";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationItem, } from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Loader, MoreVertical } from "lucide-react";
import { StatsCards } from './Dashboard/StatsCards';
import { ThreatBadge } from './Dashboard/ThreatBadge';
import { CustomTooltip } from './Dashboard/CustomTooltip';
const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
    return (_jsx(Pagination, { children: _jsxs(PaginationContent, { children: [_jsx(PaginationItem, { children: _jsxs(Button, { variant: "outline", size: "sm", onClick: () => onPageChange(Math.max(currentPage - 1, 1)), disabled: currentPage === 1, className: "gap-1", children: [_jsx(ChevronLeft, { className: "h-4 w-4" }), "Previous"] }) }), _jsx(PaginationItem, { children: _jsxs("span", { className: "flex h-9 items-center px-4 text-sm", children: ["Page ", currentPage, " of ", totalPages] }) }), _jsx(PaginationItem, { children: _jsxs(Button, { variant: "outline", size: "sm", onClick: () => onPageChange(Math.min(currentPage + 1, totalPages)), disabled: currentPage === totalPages, className: "gap-1", children: ["Next", _jsx(ChevronRight, { className: "h-4 w-4" })] }) })] }) }));
};
const Dashboard = ({ title }) => {
    // State management
    const [packets, setPackets] = useState([]);
    const [stats, setStats] = useState({});
    const [trendData, setTrendData] = useState([]);
    const [typeData, setTypeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = packets.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(packets.length / recordsPerPage);
    // Data fetching
    const fetchData = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            setLoading(true);
            setError(null);
            const [packetsData, statsData, trendsData, typesData] = yield Promise.all([
                fetchPackets(),
                fetchStats(),
                fetchTrends(),
                fetchTypes()
            ]);
            setPackets(packetsData);
            setStats(statsData);
            setTrendData(trendsData);
            setTypeData(typesData);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
        finally {
            setLoading(false);
        }
    }), []);
    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, [fetchData]);
    const handlePacketAction = (packetId, action) => __awaiter(void 0, void 0, void 0, function* () {
        if (action === 'ignore') {
            try {
                yield ignorePacket(packetId);
                setPackets(packets.filter(packet => packet.id !== packetId));
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to ignore packet');
            }
        }
        else if (action === 'analyze') {
            console.log(`Analyzing packet ${packetId}`);
        }
    });
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center w-full h-screen", children: _jsxs(Button, { disabled: true, className: "gap-2", children: [_jsx(Loader, { className: "w-4 h-4 animate-spin" }), "Loading dashboard..."] }) }));
    }
    if (error) {
        return (_jsx("div", { className: "flex items-center justify-center w-full h-screen bg-gray-50", children: _jsxs("div", { className: "p-8 text-center", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-red-100", children: _jsx("svg", { className: "w-8 h-8 text-red-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }), _jsx("h3", { className: "mb-2 text-xl font-semibold text-gray-900", children: "Error Loading Dashboard" }), _jsx("p", { className: "mb-4 text-gray-600", children: error }), _jsx(Button, { onClick: fetchData, variant: "destructive", children: "Retry" })] }) }));
    }
    return (_jsxs("div", { className: "flex flex-col w-full h-screen overflow-hidden", children: [_jsx("div", { className: "flex items-center justify-between p-4 bg-white border-b", children: _jsx("h1", { className: "text-3xl font-semibold text-gray-800", children: title }) }), _jsxs("div", { className: "flex-1 p-4 overflow-y-auto", children: [_jsx(StatsCards, { stats: stats }), _jsxs("div", { className: "grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2", children: [_jsxs(Card, { className: "p-4", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Intrusion Detection Trends" }), _jsx(CardDescription, { children: "Monthly analysis of security incidents" })] }), _jsx(CardContent, { children: _jsx("div", { className: "h-80", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(AreaChart, { data: trendData, margin: { top: 10, right: 30, left: 0, bottom: 0 }, children: [_jsxs("defs", { children: [_jsxs("linearGradient", { id: "detectedGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#F87171", stopOpacity: 0.8 }), _jsx("stop", { offset: "95%", stopColor: "#F87171", stopOpacity: 0.1 })] }), _jsxs("linearGradient", { id: "blockedGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#4ADE80", stopOpacity: 0.8 }), _jsx("stop", { offset: "95%", stopColor: "#4ADE80", stopOpacity: 0.1 })] })] }), _jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name" }), _jsx(YAxis, {}), _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }), _jsx(Legend, {}), _jsx(Area, { type: "monotone", dataKey: "detected", stroke: "#EF4444", fill: "url(#detectedGradient)", strokeWidth: 2, dot: { r: 4 }, activeDot: { r: 6 } }), _jsx(Area, { type: "monotone", dataKey: "blocked", stroke: "#22C55E", fill: "url(#blockedGradient)", strokeWidth: 2, dot: { r: 4 }, activeDot: { r: 6 } })] }) }) }) })] }), _jsxs(Card, { className: "p-4", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Intrusion Types Distribution" }), _jsx(CardDescription, { children: "Analysis of attack vectors and severity" })] }), _jsx(CardContent, { children: _jsx("div", { className: "h-80", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: typeData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Bar, { dataKey: "count", fill: "#3B82F6", radius: [4, 4, 0, 0] })] }) }) }) })] })] }), _jsxs(Card, { className: "mb-6", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Packet Analysis" }), _jsx(CardDescription, { children: "Detailed network packet information and threats" })] }), _jsx(CardContent, { children: _jsxs("div", { className: "border rounded-lg", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-gray-50", children: [_jsx("th", { className: "p-4 text-left", children: "Source" }), _jsx("th", { className: "p-4 text-left", children: "Destination" }), _jsx("th", { className: "p-4 text-left", children: "Port" }), _jsx("th", { className: "p-4 text-left", children: "Service" }), _jsx("th", { className: "p-4 text-left", children: "Info" }), _jsx("th", { className: "p-4 text-left", children: "Attack" }), _jsx("th", { className: "p-4 text-left", children: "Threat Level" }), _jsx("th", { className: "p-4 text-left", children: "Actions" })] }) }), _jsx("tbody", { children: currentRecords.map((packet) => (_jsxs("tr", { className: "border-t hover:bg-gray-50", children: [_jsx("td", { className: "p-4", children: packet.src }), _jsx("td", { className: "p-4", children: packet.dst }), _jsx("td", { className: "p-4", children: packet.port }), _jsx("td", { className: "p-4", children: packet.service }), _jsx("td", { className: "p-4", children: packet.info }), _jsx("td", { className: "p-4", children: packet.attack }), _jsx("td", { className: "p-4", children: _jsx(ThreatBadge, { level: packet.threatLevel }) }), _jsx("td", { className: "p-4", children: _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", className: "h-8 w-8 p-0", children: _jsx(MoreVertical, { className: "h-4 w-4" }) }) }), _jsxs(DropdownMenuContent, { align: "end", children: [_jsx(DropdownMenuItem, { onClick: () => handlePacketAction(packet.id, 'ignore'), children: "Ignore" }), _jsx(DropdownMenuItem, { onClick: () => handlePacketAction(packet.id, 'analyze'), children: "Analyze" })] })] }) })] }, packet.id))) })] }) }), _jsx("div", { className: "flex items-center justify-between px-4 py-3 border-t", children: _jsxs("div", { className: "flex justify-between w-full items-center", children: [_jsxs("div", { className: "text-sm text-gray-700", children: ["Showing ", indexOfFirstRecord + 1, " to ", Math.min(indexOfLastRecord, packets.length), " of ", packets.length, " entries"] }), _jsx(PaginationControls, { currentPage: currentPage, totalPages: totalPages, onPageChange: setCurrentPage })] }) })] }) })] })] })] }));
};
export default Dashboard;
