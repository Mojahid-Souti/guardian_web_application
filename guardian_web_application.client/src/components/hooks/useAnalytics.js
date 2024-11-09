var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
export const useAnalytics = () => {
    const [stats, setStats] = useState(null);
    const [trafficData, setTrafficData] = useState([]);
    const [protocolData, setProtocolData] = useState([]);
    const [packets, setPackets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchData = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            setLoading(true);
            setError(null);
            // Fetch all the different endpoints
            const [packetsResponse, protocolsResponse] = yield Promise.all([
                fetch('http://localhost:5264/api/analytics/packets'),
                fetch('http://localhost:5264/api/analytics/protocols') // Add separate endpoint for protocols
            ]);
            if (!packetsResponse.ok || !protocolsResponse.ok) {
                throw new Error(`HTTP error! status: ${packetsResponse.status}`);
            }
            const packetsData = yield packetsResponse.json();
            const protocolsData = yield protocolsResponse.json();
            if (!Array.isArray(packetsData) || packetsData.length === 0) {
                throw new Error('No packet data available');
            }
            // Process protocols data separately
            const processedProtocolData = protocolsData
                .map(protocol => ({
                name: protocol.name || 'Unknown',
                value: protocol.value
            }))
                .sort((a, b) => b.value - a.value)
                .slice(0, 10); // Only show top 10 protocols
            // Process traffic data
            const trafficByHour = packetsData.reduce((acc, packet) => {
                const hour = new Date(packet.timestamp).getHours();
                const key = `${hour.toString().padStart(2, '0')}:00`;
                if (!acc[key]) {
                    acc[key] = { packets: 0, bandwidth: 0, threats: 0 };
                }
                acc[key].packets++;
                acc[key].bandwidth += 0.001;
                if (packet.type && packet.type !== 'None')
                    acc[key].threats++;
                return acc;
            }, {});
            const processedTrafficData = Object.entries(trafficByHour)
                .map(([name, data]) => ({
                name,
                packets: data.packets,
                bandwidth: data.bandwidth,
                threats: data.threats
            }))
                .sort((a, b) => a.name.localeCompare(b.name));
            // Update state with processed data
            setStats({
                totalPackets: packetsData.length,
                highRiskPackets: packetsData.filter(p => { var _a; return ['high', 'critical'].includes(((_a = p.severity) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || ''); }).length,
                activeSessions: new Set(packetsData.map(p => p.ipSrc)).size,
                bandwidthUsage: packetsData.length * 0.001,
                uniqueIPs: new Set([
                    ...packetsData.map(p => p.ipSrc),
                    ...packetsData.map(p => p.ipDst)
                ]).size,
                threatsBlocked: packetsData.filter(p => p.type && p.type !== 'None').length,
                changes: {
                    totalPackets: 5.2,
                    highRiskPackets: -2.1,
                    activeSessions: 3.4,
                    bandwidthUsage: 1.5,
                    uniqueIPs: 4.2,
                    threatsBlocked: -1.8
                }
            });
            setTrafficData(processedTrafficData);
            setProtocolData(processedProtocolData);
            setPackets(packetsData);
        }
        catch (err) {
            console.error('Error fetching data:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
            setStats(null);
            setTrafficData([]);
            setProtocolData([]);
            setPackets([]);
        }
        finally {
            setLoading(false);
        }
    }), []);
    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [fetchData]);
    const resolvePacket = (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield fetch(`http://localhost:5264/api/analytics/packets/${id}/resolve`, {
                method: 'POST'
            });
            if (!response.ok) {
                throw new Error('Failed to resolve packet');
            }
            setPackets(prevPackets => prevPackets.filter(p => p.id !== id));
            yield fetchData();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to resolve packet');
        }
    });
    return {
        stats,
        trafficData,
        protocolData,
        packets,
        loading,
        error,
        refreshData: fetchData,
        resolvePacket
    };
};
