import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { FaNetworkWired, FaShieldAlt, FaUserShield, FaTrafficLight } from "react-icons/fa";
import {
     XAxis,
     YAxis,
     CartesianGrid,
     Tooltip,
     ResponsiveContainer,
     BarChart,
     Bar,
     Legend,
     Area,
     AreaChart,
} from "recharts";
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react"

const packetData: PacketEntry[] = [
     {
          id: 1,
          src: "192.168.1.100",
          dst: "10.0.0.15",
          port: 443,
          service: "HTTPS",
          info: "TLS Handshake",
          attack: "None",
          threatLevel: "low",
     },
     {
          id: 2,
          src: "172.16.0.50",
          dst: "192.168.1.200",
          port: 80,
          service: "HTTP",
          info: "SQL Injection Attempt",
          attack: "SQL Injection",
          threatLevel: "critical",
     },
     {
          id: 3,
          src: "10.0.0.25",
          dst: "192.168.1.150",
          port: 22,
          service: "SSH",
          info: "Brute Force Attempt",
          attack: "Brute Force",
          threatLevel: "high",
     },
     {
          id: 4,
          src: "192.168.1.75",
          dst: "10.0.0.100",
          port: 3306,
          service: "MySQL",
          info: "Suspicious Query",
          attack: "Potential Data Leak",
          threatLevel: "medium",
     },
     {
          id: 5,
          src: "192.168.1.75",
          dst: "10.0.0.100",
          port: 3306,
          service: "MySQL",
          info: "Suspicious Query",
          attack: "Potential Data Leak",
          threatLevel: "medium",
     },
     {
          id: 6,
          src: "192.168.1.75",
          dst: "10.0.0.100",
          port: 3306,
          service: "MySQL",
          info: "Suspicious Query",
          attack: "Potential Data Leak",
          threatLevel: "medium",
     },
     {
          id: 7,
          src: "192.168.1.75",
          dst: "10.0.0.100",
          port: 3306,
          service: "MySQL",
          info: "Suspicious Query",
          attack: "Potential Data Leak",
          threatLevel: "medium",
     },
     {
          id: 4,
          src: "192.168.1.75",
          dst: "10.0.0.100",
          port: 3306,
          service: "MySQL",
          info: "Suspicious Query",
          attack: "Potential Data Leak",
          threatLevel: "medium",
     },
];
// Enhanced sample data for the line chart
const intrusionTrendData = [
     { name: "Jan", detected: 65, blocked: 45, average: 55 },
     { name: "Feb", detected: 59, blocked: 40, average: 49.5 },
     { name: "Mar", detected: 80, blocked: 70, average: 75 },
     { name: "Apr", detected: 81, blocked: 75, average: 78 },
     { name: "May", detected: 56, blocked: 48, average: 52 },
     { name: "Jun", detected: 55, blocked: 45, average: 50 },
     { name: "Jul", detected: 40, blocked: 35, average: 37.5 },
];

// Enhanced sample data for the bar chart
const intrusionTypeData = [
     { name: "SQL Injection", count: 28, severity: "High", risk: 85 },
     { name: "XSS Attacks", count: 23, severity: "High", risk: 80 },
     { name: "DDoS", count: 15, severity: "Critical", risk: 95 },
     { name: "Brute Force", count: 32, severity: "Medium", risk: 70 },
     { name: "File Inclusion", count: 12, severity: "High", risk: 75 },
];
// Define the type for the payload entries
interface PayloadEntry {
     name: string;
     value: number;
     color: string; // Adjust according to your actual data structure
}

interface ThreatBadgeProps {
     level: 'low' | 'medium' | 'high' | 'critical'; // Define the allowed levels
}

const ThreatBadge: React.FC<ThreatBadgeProps> = ({ level }) => {
     const colors = {
          low: "bg-green-100 text-green-800",
          medium: "bg-yellow-100 text-yellow-800",
          high: "bg-orange-100 text-orange-800",
          critical: "bg-red-100 text-red-800",
     };

     return (
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[level]}`}>
               {level.charAt(0).toUpperCase() + level.slice(1)}
          </div>
     );
};

// Custom tooltip styles
const CustomTooltip: React.FC<{ active?: boolean; payload?: PayloadEntry[]; label?: string }> = ({ active, payload, label }) => {
     if (active && payload && payload.length) {
          return (
               <div className="p-4 border border-gray-200 rounded-lg shadow-lg bg-white/90 backdrop-blur-sm">
                    <p className="text-sm font-semibold text-gray-800">{label}</p>
                    {payload.map((entry, index) => (
                         <p key={index} className="text-sm" style={{ color: entry.color }}>
                              {`${entry.name}: ${entry.value}`}
                         </p>
                    ))}
               </div>
          );
     }
     return null;
};

interface PageProps {
     title: string;
}

interface PacketEntry {
     id: number;
     src: string;
     dst: string;
     port: number;
     service: string;
     info: string;
     attack: string;
     threatLevel: 'low' | 'medium' | 'high' | 'critical'; // Ensure threatLevel is typed correctly
}

const Dashboard: React.FC<PageProps> = ({ title }) => {
     const [packets, setPackets] = useState(packetData);

     const handlePacketAction = (packetId: number, action: string) => {
          if (action === 'ignore') {
               setPackets(packets.filter(packet => packet.id !== packetId));
          } else if (action === 'analyze') {
               // Handle navigation to analytics page
               console.log(`Analyzing packet ${packetId}`);
          }
     };

     return (
          <div className="flex flex-col w-full h-screen p-5 bg-gray-100 shadow-md lg:p-5">
               {/* Fixed Header */}
               <div className="flex items-center justify-between p-4 duration-300 bg-white border-b rounded-tl-xl rounded-tr-xl">
                    <h1 className="text-3xl font-semibold text-gray-800">{title}</h1>
                    
               </div>

               {/* Scrollable Content */}
               <div className="flex-1 p-4 overflow-auto bg-white rounded-bl-xl">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4 ">
                         {/* ... (keep existing stats cards) */}
                         <Card className="relative p-0 overflow-hidden bg-gray-100">
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20" />
                              <div className="absolute inset-[1px] bg-gray-100 rounded-lg" />
                              <div className="relative p-4">
                                   <CardHeader className="p-0 pb-2">
                                        <CardTitle className="flex items-center text-lg text-gray-800">
                                             <FaNetworkWired className="mr-2 text-2xl text-blue-500" />
                                             Packets
                                        </CardTitle>
                                   </CardHeader>
                                   <CardContent className="p-0">
                                        <CardDescription className="text-2xl font-bold text-gray-900">
                                             150,000
                                        </CardDescription>
                                        <CardDescription className="flex items-center text-base">
                                             <span className="text-green-500">+10%</span>
                                             <span className="ml-1 text-gray-500">From last week</span>
                                        </CardDescription>
                                        <Button size="sm" className="mt-3 text-sm text-white bg-black hover:bg-black/80">
                                             View Details
                                        </Button>
                                   </CardContent>
                              </div>
                         </Card>

                         <Card className="relative p-0 overflow-hidden bg-gray-100">
                              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20" />
                              <div className="absolute inset-[1px] bg-gray-100 rounded-lg" />
                              <div className="relative p-4">
                                   <CardHeader className="p-0 pb-2">
                                        <CardTitle className="flex items-center text-lg text-gray-800">
                                             <FaShieldAlt className="mr-2 text-2xl text-red-500" />
                                             Attacks
                                        </CardTitle>
                                   </CardHeader>
                                   <CardContent className="p-0">
                                        <CardDescription className="text-2xl font-bold text-gray-900">
                                             5
                                        </CardDescription>
                                        <CardDescription className="flex items-center text-base">
                                             <span className="text-red-500">+3</span>
                                             <span className="ml-1 text-gray-500">Last hour</span>
                                        </CardDescription>
                                        <Button size="sm" className="mt-3 text-sm text-white bg-black hover:bg-black/80">
                                             Review Logs
                                        </Button>
                                   </CardContent>
                              </div>
                         </Card>

                         <Card className="relative p-0 overflow-hidden bg-gray-100">
                              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-green-600/20" />
                              <div className="absolute inset-[1px] bg-gray-100 rounded-lg" />
                              <div className="relative p-4">
                                   <CardHeader className="p-0 pb-2">
                                        <CardTitle className="flex items-center text-lg text-gray-800">
                                             <FaUserShield className="mr-2 text-2xl text-green-500" />
                                             Intrusions
                                        </CardTitle>
                                   </CardHeader>
                                   <CardContent className="p-0">
                                        <CardDescription className="text-2xl font-bold text-gray-900">
                                             12
                                        </CardDescription>
                                        <CardDescription className="flex items-center text-base">
                                             <span className="text-green-500">+20%</span>
                                             <span className="ml-1 text-gray-500">This month</span>
                                        </CardDescription>
                                        <Button size="sm" className="mt-3 text-sm text-white bg-black hover:bg-black/80">
                                             Prevention Logs
                                        </Button>
                                   </CardContent>
                              </div>
                         </Card>

                         <Card className="relative p-0 overflow-hidden bg-gray-100">
                              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20" />
                              <div className="absolute inset-[1px] bg-gray-100 rounded-lg" />
                              <div className="relative p-4">
                                   <CardHeader className="p-0 pb-2">
                                        <CardTitle className="flex items-center text-lg text-gray-800">
                                             <FaTrafficLight className="mr-2 text-2xl text-yellow-500" />
                                             Threats
                                        </CardTitle>
                                   </CardHeader>
                                   <CardContent className="p-0">
                                        <CardDescription className="text-2xl font-bold text-gray-900">
                                             Moderate
                                        </CardDescription>
                                        <CardDescription className="flex items-center text-base">
                                             <span className="text-red-500">-2</span>
                                             <span className="ml-1 text-gray-500">Alerts active</span>
                                        </CardDescription>
                                        <Button size="sm" className="mt-3 text-sm text-white hover:bg-black/80">
                                             Threat Details
                                        </Button>
                                   </CardContent>
                              </div>
                         </Card>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
                         <Card className="p-4 bg-gradient-to-br from-gray-50 to-gray-100">
                              <CardHeader>
                                   <CardTitle className="text-xl font-bold text-gray-800">Intrusion Detection Trends</CardTitle>
                                   <CardDescription className="text-gray-600">Monthly analysis of security incidents</CardDescription>
                              </CardHeader>
                              <CardContent>
                                   <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                             <AreaChart
                                                  data={intrusionTrendData}
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
                                                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                                  <XAxis dataKey="name" stroke="#6B7280" style={{ fontSize: "12px", fontFamily: "Inter" }} />
                                                  <YAxis stroke="#6B7280" style={{ fontSize: "12px", fontFamily: "Inter" }} />
                                                  <Tooltip content={<CustomTooltip />} />
                                                  <Legend
                                                       wrapperStyle={{
                                                            paddingTop: "20px",
                                                            fontSize: "14px",
                                                            fontFamily: "Inter",
                                                       }}
                                                  />
                                                  <Area
                                                       type="monotone"
                                                       dataKey="detected"
                                                       stroke="#EF4444"
                                                       fill="url(#detectedGradient)"
                                                       strokeWidth={2}
                                                       activeDot={{ r: 6 }}
                                                       animationDuration={1500}
                                                       animationBegin={0}
                                                  />
                                                  <Area
                                                       type="monotone"
                                                       dataKey="blocked"
                                                       stroke="#22C55E"
                                                       fill="url(#blockedGradient)"
                                                       strokeWidth={2}
                                                       activeDot={{ r: 6 }}
                                                       animationDuration={1500}
                                                       animationBegin={300}
                                                  />
                                             </AreaChart>
                                        </ResponsiveContainer>
                                   </div>
                              </CardContent>
                         </Card>

                         {/* Enhanced Intrusion Types Bar Chart */}
                         <Card className="p-4 bg-gradient-to-br from-gray-50 to-gray-100">
                              <CardHeader>
                                   <CardTitle className="text-xl font-bold text-gray-800">Intrusion Types Distribution</CardTitle>
                                   <CardDescription className="text-gray-600">Analysis of attack vectors and severity</CardDescription>
                              </CardHeader>
                              <CardContent>
                                   <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                             <BarChart data={intrusionTypeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                                  <defs>
                                                       <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
                                                            <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.8} />
                                                       </linearGradient>
                                                  </defs>
                                                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                                  <XAxis
                                                       dataKey="name"
                                                       stroke="#6B7280"
                                                       style={{ fontSize: "12px", fontFamily: "Inter" }}
                                                       label={{
                                                            value: "Intrusion Types",
                                                            position: "insideBottom",
                                                            offset: -5,
                                                            style: { textAnchor: "middle", fill: "#6B7280", fontSize: "14px", fontFamily: "Inter" },
                                                       }}
                                                  />
                                                  <YAxis
                                                       stroke="#6B7280"
                                                       style={{ fontSize: "12px", fontFamily: "Inter" }}
                                                       label={{
                                                            value: "Count",
                                                            angle: -90,
                                                            position: "insideLeft",
                                                            style: { textAnchor: "middle", fill: "#6B7280", fontSize: "14px", fontFamily: "Inter" },
                                                       }}
                                                  />
                                                  <Tooltip />
                                                  <Legend
                                                       verticalAlign="bottom"
                                                       align="center"
                                                       wrapperStyle={{
                                                            margin: -10,
                                                            textAlign: "center",
                                                            justifyContent: "center",
                                                            fontSize: "14px",
                                                            fontFamily: "Inter",
                                                            color: "#6B7280",
                                                       }}
                                                  />
                                                  <Bar dataKey="count" fill="url(#barGradient)" />
                                             </BarChart>
                                        </ResponsiveContainer>
                                   </div>
                              </CardContent>
                         </Card>
                    </div>

                    <div className="pb-5 mt-8">
                         <Card className="mb-6">
                              <CardHeader>
                                   <CardTitle className="text-xl font-bold text-gray-800">Packet Analysis</CardTitle>
                                   <CardDescription className="text-gray-600">Detailed network packet information and threats</CardDescription>
                              </CardHeader>
                              <CardContent>
                                   <div className="border rounded-lg shadow-sm">
                                        <div className="overflow-x-auto">
                                             <table className="w-full border-collapse">
                                                  <thead>
                                                       <tr className="bg-gray-50">
                                                            <th className="px-6 py-4 font-bold text-left text-gray-500 border-b">Source</th>
                                                            <th className="px-6 py-4 font-bold text-left text-gray-500 border-b">Destination</th>
                                                            <th className="px-6 py-4 font-bold text-left text-gray-500 border-b">Port</th>
                                                            <th className="px-6 py-4 font-bold text-left text-gray-500 border-b">Service</th>
                                                            <th className="px-6 py-4 font-bold text-left text-gray-500 border-b">Info</th>
                                                            <th className="px-6 py-4 font-bold text-left text-gray-500 border-b">Attack</th>
                                                            <th className="px-6 py-4 font-bold text-left text-gray-500 border-b">Threat Level</th>
                                                            <th className="px-6 py-4 font-bold text-left text-gray-500 border-b">Actions</th>
                                                       </tr>
                                                  </thead>
                                                  <tbody className="bg-white divide-y divide-gray-200">
                                                       {packets.map((packet) => (
                                                            <tr key={packet.id} className="hover:bg-gray-50">
                                                                 <td className="px-6 py-4 font-mono text-sm text-gray-700">{packet.src}</td>
                                                                 <td className="px-6 py-4 font-mono text-sm text-gray-700">{packet.dst}</td>
                                                                 <td className="px-6 py-4 text-gray-700">{packet.port}</td>
                                                                 <td className="px-6 py-4 text-gray-700">{packet.service}</td>
                                                                 <td className="px-6 py-4 text-gray-700">{packet.info}</td>
                                                                 <td className="px-6 py-4 text-gray-700">{packet.attack}</td>
                                                                 <td className="px-6 py-4">
                                                                      <ThreatBadge level={packet.threatLevel} />
                                                                 </td>
                                                                 <td className="px-6 py-4">
                                                                      <DropdownMenu>
                                                                           <DropdownMenuTrigger asChild>
                                                                                <Button variant="ghost" className="w-8 h-8 p-0">
                                                                                     <MoreVertical className="w-4 h-4" />
                                                                                </Button>
                                                                           </DropdownMenuTrigger>
                                                                           <DropdownMenuContent align="end">
                                                                                <DropdownMenuItem
                                                                                     onClick={() => handlePacketAction(packet.id, 'ignore')}
                                                                                >
                                                                                     Ignore
                                                                                </DropdownMenuItem>
                                                                                <DropdownMenuItem
                                                                                     onClick={() => handlePacketAction(packet.id, 'analyze')}
                                                                                >
                                                                                     Send to Analytics
                                                                                </DropdownMenuItem>
                                                                           </DropdownMenuContent>
                                                                      </DropdownMenu>
                                                                 </td>
                                                            </tr>
                                                       ))}
                                                  </tbody>
                                             </table>
                                        </div>
                                   </div>
                              </CardContent>
                         </Card>
                    </div>
               </div>
          </div>
     );
};

export default Dashboard;
