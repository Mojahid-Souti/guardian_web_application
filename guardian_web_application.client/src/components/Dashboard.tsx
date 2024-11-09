/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import { fetchPackets, fetchStats, fetchTrends, fetchTypes, ignorePacket } from '@/api/dashboard';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import {
     XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
     BarChart, Bar, Legend, Area, AreaChart
} from "recharts";
import {
     DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
     Pagination,
     PaginationContent,
     PaginationItem,
} from "@/components/ui/pagination";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Loader, MoreVertical } from "lucide-react";
import { PacketEntry, IntrusionTrend, IntrusionType, PageProps } from '@/types/dashboard';
import { StatsCards } from './Dashboard/StatsCards';
import { ThreatBadge } from './Dashboard/ThreatBadge';
import { CustomTooltip } from './Dashboard/CustomTooltip';

interface PaginationControlsProps {
     currentPage: number;
     totalPages: number;
     onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
     currentPage,
     totalPages,
     onPageChange
}) => {
     return (
          <Pagination>
               <PaginationContent>
                    <PaginationItem>
                         <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                              disabled={currentPage === 1}
                              className="gap-1"
                         >
                              <ChevronLeft className="h-4 w-4" />
                              Previous
                         </Button>
                    </PaginationItem>
                    <PaginationItem>
                         <span className="flex h-9 items-center px-4 text-sm">
                              Page {currentPage} of {totalPages}
                         </span>
                    </PaginationItem>
                    <PaginationItem>
                         <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                              disabled={currentPage === totalPages}
                              className="gap-1"
                         >
                              Next
                              <ChevronRight className="h-4 w-4" />
                         </Button>
                    </PaginationItem>
               </PaginationContent>
          </Pagination>
     );
};
const Dashboard: React.FC<PageProps> = ({ title }) => {
     // State management
     const [packets, setPackets] = useState<PacketEntry[]>([]);
     const [stats, setStats] = useState<Record<string, any>>({});
     const [trendData, setTrendData] = useState<IntrusionTrend[]>([]);
     const [typeData, setTypeData] = useState<IntrusionType[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);

     // Pagination state
     const [currentPage, setCurrentPage] = useState(1);
     const recordsPerPage = 5;
     const indexOfLastRecord = currentPage * recordsPerPage;
     const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
     const currentRecords = packets.slice(indexOfFirstRecord, indexOfLastRecord);
     const totalPages = Math.ceil(packets.length / recordsPerPage);

     // Data fetching
     const fetchData = useCallback(async () => {
          try {
               setLoading(true);
               setError(null);
               const [packetsData, statsData, trendsData, typesData] = await Promise.all([
                    fetchPackets(),
                    fetchStats(),
                    fetchTrends(),
                    fetchTypes()
               ]);

               setPackets(packetsData);
               setStats(statsData);
               setTrendData(trendsData);
               setTypeData(typesData);
          } catch (err) {
               setError(err instanceof Error ? err.message : 'An error occurred');
          } finally {
               setLoading(false);
          }
     }, []);

     useEffect(() => {
          fetchData();
          const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
          return () => clearInterval(interval);
     }, [fetchData]);

     const handlePacketAction = async (packetId: number, action: string) => {
          if (action === 'ignore') {
               try {
                    await ignorePacket(packetId);
                    setPackets(packets.filter(packet => packet.id !== packetId));
               } catch (err) {
                    setError(err instanceof Error ? err.message : 'Failed to ignore packet');
               }
          } else if (action === 'analyze') {
               console.log(`Analyzing packet ${packetId}`);
          }
     };

     if (loading) {
          return (
               <div className="flex items-center justify-center w-full h-screen">
                    <Button disabled className="gap-2">
                         <Loader className="w-4 h-4 animate-spin" />
                         Loading dashboard...
                    </Button>
               </div>
          );
     }

     if (error) {
          return (
               <div className="flex items-center justify-center w-full h-screen bg-gray-50">
                    <div className="p-8 text-center">
                         <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-red-100">
                              <svg
                                   className="w-8 h-8 text-red-500"
                                   fill="none"
                                   stroke="currentColor"
                                   viewBox="0 0 24 24"
                                   xmlns="http://www.w3.org/2000/svg"
                              >
                                   <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                   />
                              </svg>
                         </div>
                         <h3 className="mb-2 text-xl font-semibold text-gray-900">Error Loading Dashboard</h3>
                         <p className="mb-4 text-gray-600">{error}</p>
                         <Button onClick={fetchData} variant="destructive">
                              Retry
                         </Button>
                    </div>
               </div>
          );
     }

     return (
          <div className="flex flex-col w-full h-screen overflow-hidden">
               {/* Fixed Header */}
               <div className="flex items-center justify-between p-4 bg-white border-b">
                    <h1 className="text-3xl font-semibold text-gray-800">{title}</h1>
               </div>

               {/* Scrollable Content */}
               <div className="flex-1 p-4 overflow-y-auto">
                    {/* Stats Cards */}
                    <StatsCards stats={stats} />

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
                         {/* Trends Chart */}
                         <Card className="p-4">
                              <CardHeader>
                                   <CardTitle>Intrusion Detection Trends</CardTitle>
                                   <CardDescription>Monthly analysis of security incidents</CardDescription>
                              </CardHeader>
                              <CardContent>
                                   <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                             <AreaChart
                                                  data={trendData}
                                                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                             >
                                                  <defs>
                                                       <linearGradient id="detectedGradient" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#F87171" stopOpacity={0.8} />
                                                            <stop offset="95%" stopColor="#F87171" stopOpacity={0.1} />
                                                       </linearGradient>
                                                       <linearGradient id="blockedGradient" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.8} />
                                                            <stop offset="95%" stopColor="#4ADE80" stopOpacity={0.1} />
                                                       </linearGradient>
                                                  </defs>
                                                  <CartesianGrid strokeDasharray="3 3" />
                                                  <XAxis dataKey="name" />
                                                  <YAxis />
                                                  <Tooltip content={<CustomTooltip />} />
                                                  <Legend />
                                                  <Area
                                                       type="monotone"
                                                       dataKey="detected"
                                                       stroke="#EF4444"
                                                       fill="url(#detectedGradient)"
                                                       strokeWidth={2}
                                                       dot={{ r: 4 }}
                                                       activeDot={{ r: 6 }}
                                                  />
                                                  <Area
                                                       type="monotone"
                                                       dataKey="blocked"
                                                       stroke="#22C55E"
                                                       fill="url(#blockedGradient)"
                                                       strokeWidth={2}
                                                       dot={{ r: 4 }}
                                                       activeDot={{ r: 6 }}
                                                  />
                                             </AreaChart>
                                        </ResponsiveContainer>
                                   </div>
                              </CardContent>
                         </Card>

                         {/* Distribution Chart */}
                         <Card className="p-4">
                              <CardHeader>
                                   <CardTitle>Intrusion Types Distribution</CardTitle>
                                   <CardDescription>Analysis of attack vectors and severity</CardDescription>
                              </CardHeader>
                              <CardContent>
                                   <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                             <BarChart data={typeData}>
                                                  <CartesianGrid strokeDasharray="3 3" />
                                                  <XAxis dataKey="name" />
                                                  <YAxis />
                                                  <Tooltip />
                                                  <Legend />
                                                  <Bar
                                                       dataKey="count"
                                                       fill="#3B82F6"
                                                       radius={[4, 4, 0, 0]}
                                                  />
                                             </BarChart>
                                        </ResponsiveContainer>
                                   </div>
                              </CardContent>
                         </Card>
                    </div>

                    {/* Packets Table */}
                    <Card className="mb-6">
                         <CardHeader>
                              <CardTitle>Packet Analysis</CardTitle>
                              <CardDescription>Detailed network packet information and threats</CardDescription>
                         </CardHeader>
                         <CardContent>
                              <div className="border rounded-lg">
                                   <div className="overflow-x-auto">
                                        <table className="w-full">
                                             <thead>
                                                  <tr className="bg-gray-50">
                                                       <th className="p-4 text-left">Source</th>
                                                       <th className="p-4 text-left">Destination</th>
                                                       <th className="p-4 text-left">Port</th>
                                                       <th className="p-4 text-left">Service</th>
                                                       <th className="p-4 text-left">Info</th>
                                                       <th className="p-4 text-left">Attack</th>
                                                       <th className="p-4 text-left">Threat Level</th>
                                                       <th className="p-4 text-left">Actions</th>
                                                  </tr>
                                             </thead>
                                             <tbody>
                                                  {currentRecords.map((packet) => (
                                                       <tr key={packet.id} className="border-t hover:bg-gray-50">
                                                            <td className="p-4">{packet.src}</td>
                                                            <td className="p-4">{packet.dst}</td>
                                                            <td className="p-4">{packet.port}</td>
                                                            <td className="p-4">{packet.service}</td>
                                                            <td className="p-4">{packet.info}</td>
                                                            <td className="p-4">{packet.attack}</td>
                                                            <td className="p-4">
                                                                 <ThreatBadge level={packet.threatLevel} />
                                                            </td>
                                                            <td className="p-4">
                                                                 <DropdownMenu>
                                                                      <DropdownMenuTrigger asChild>
                                                                           <Button variant="ghost" className="h-8 w-8 p-0">
                                                                                <MoreVertical className="h-4 w-4" />
                                                                           </Button>
                                                                      </DropdownMenuTrigger>
                                                                      <DropdownMenuContent align="end">
                                                                           <DropdownMenuItem onClick={() => handlePacketAction(packet.id, 'ignore')}>
                                                                                Ignore
                                                                           </DropdownMenuItem>
                                                                           <DropdownMenuItem onClick={() => handlePacketAction(packet.id, 'analyze')}>
                                                                                Analyze
                                                                           </DropdownMenuItem>
                                                                      </DropdownMenuContent>
                                                                 </DropdownMenu>
                                                            </td>
                                                       </tr>
                                                  ))}
                                             </tbody>
                                        </table>
                                   </div>

                                   {/* Pagination */}
                                   <div className="flex items-center justify-between px-4 py-3 border-t">
                                        <div className="flex justify-between w-full items-center">
                                             <div className="text-sm text-gray-700">
                                                  Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, packets.length)} of {packets.length} entries
                                             </div>
                                             <PaginationControls
                                                  currentPage={currentPage}
                                                  totalPages={totalPages}
                                                  onPageChange={setCurrentPage}
                                             />
                                        </div>
                                   </div>
                              </div>
                         </CardContent>
                    </Card>
               </div>
          </div>
     );
};

export default Dashboard;