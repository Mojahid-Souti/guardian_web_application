import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, AlertTriangle, Zap, Globe, Shield, Radio, BarChart2, Eye, Loader2, RefreshCcw } from "lucide-react";
import { useAnalytics } from './hooks/useAnalytics';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { SecurityPacket } from "@/types/analytics";
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select";
interface PageProps {
     title: string;
}

interface PacketAnalysisSectionProps {
     packets: SecurityPacket[];
     onResolve: (id: number) => Promise<void>;
     loading?: boolean;
     error?: string | null;
     onRetry?: () => void;
}

const PacketAnalysisSection = ({
     packets,
     onResolve,
     loading,
}: PacketAnalysisSectionProps) => {
     const [selectedPacket, setSelectedPacket] = useState<SecurityPacket | null>(null);
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

     const getSeverityBadge = (severity: string | undefined) => {
          const severityColors: Record<string, string> = {
               "low": "bg-green-100 text-green-800",
               "medium": "bg-yellow-100 text-yellow-800",
               "high": "bg-red-100 text-red-800",
               "critical": "bg-purple-100 text-purple-800"
          };

          // Add type safety for the severity check
          const severityKey = severity?.toLowerCase() || "";
          const colorClass = severityColors[severityKey] || "bg-gray-100 text-gray-800";

          return (
               <Badge variant="outline" className={colorClass}>
                    {severity || "Unknown"}
               </Badge>
          );
     };

     if (loading) {
          return (
               <Card className="col-span-12">
                    <CardContent className="flex items-center justify-center p-12">
                         <div className="text-center space-y-4">
                              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                              <p className="text-sm text-gray-600">Loading packet data...</p>
                         </div>
                    </CardContent>
               </Card>
          );
     }

     return (
          <>
               <Card className="col-span-12">
                    <CardHeader className="flex flex-row items-center justify-between">
                         <CardTitle className="flex items-center gap-2">
                              <Shield className="w-5 h-5 text-orange-500" />
                              Packet Analysis
                         </CardTitle>
                         <div className="flex items-center gap-2">
                              <Select
                                   value={itemsPerPage.toString()}
                                   onValueChange={(value) => setItemsPerPage(parseInt(value))}
                              >
                                   <SelectTrigger className="w-32">
                                        <SelectValue placeholder={`${itemsPerPage} per page`} />
                                   </SelectTrigger>
                                   <SelectContent>
                                        <SelectItem value="5">5 per page</SelectItem>
                                        <SelectItem value="10">10 per page</SelectItem>
                                        <SelectItem value="20">20 per page</SelectItem>
                                   </SelectContent>
                              </Select>
                         </div>
                    </CardHeader>
                    <CardContent>
                         <Table>
                              <TableHeader>
                                   <TableRow>
                                        <TableHead>Source IP</TableHead>
                                        <TableHead>Destination IP</TableHead>
                                        <TableHead>Information</TableHead>
                                        <TableHead>Attack Type</TableHead>
                                        <TableHead>Severity</TableHead>
                                        <TableHead>Actions</TableHead>
                                   </TableRow>
                              </TableHeader>
                              <TableBody>
                                   {currentPackets.map((packet) => (
                                        <TableRow key={packet.id}>
                                             <TableCell>{packet.ipSrc || 'N/A'}</TableCell>
                                             <TableCell>{packet.ipDst || 'N/A'}</TableCell>
                                             <TableCell>{packet.info || 'N/A'}</TableCell>
                                             <TableCell>{packet.type || 'None'}</TableCell>
                                             <TableCell>{getSeverityBadge(packet.severity)}</TableCell>
                                             <TableCell>
                                                  <div className="flex space-x-2">
                                                       <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => {
                                                                 setSelectedPacket(packet);
                                                                 setIsPacketDetailOpen(true);
                                                            }}
                                                       >
                                                            <Eye className="w-4 h-4 mr-1" /> View
                                                       </Button>
                                                       <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => onResolve(packet.id)}
                                                       >
                                                            Resolve
                                                       </Button>
                                                  </div>
                                             </TableCell>
                                        </TableRow>
                                   ))}
                              </TableBody>
                         </Table>

                         {/* Pagination Controls */}
                         <div className="flex items-center justify-between mt-4">
                              <p className="text-sm text-gray-600">
                                   Showing {startIndex + 1} to {Math.min(endIndex, packets.length)} of {packets.length} entries
                              </p>
                              <div className="flex gap-2">
                                   <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                   >
                                        Previous
                                   </Button>
                                   <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                   >
                                        Next
                                   </Button>
                              </div>
                         </div>
                    </CardContent>
               </Card>

               <Dialog open={isPacketDetailOpen} onOpenChange={setIsPacketDetailOpen}>
                    <DialogContent className="max-w-2xl">
                         <DialogHeader>
                              <DialogTitle>Packet Details</DialogTitle>
                              <DialogDescription>
                                   Detailed information about the selected network packet
                              </DialogDescription>
                         </DialogHeader>
                         {selectedPacket && (
                              <div className="grid grid-cols-2 gap-4">
                                   <div>
                                        <h3 className="mb-2 font-semibold">Packet Source</h3>
                                        <div className="p-3 bg-gray-100 rounded-md">
                                             <p><strong>IP:</strong> {selectedPacket.ipSrc || 'N/A'}</p>
                                             <p><strong>Port:</strong> {selectedPacket.port || 'N/A'}</p>
                                        </div>
                                   </div>
                                   <div>
                                        <h3 className="mb-2 font-semibold">Packet Destination</h3>
                                        <div className="p-3 bg-gray-100 rounded-md">
                                             <p><strong>IP:</strong> {selectedPacket.ipDst || 'N/A'}</p>
                                        </div>
                                   </div>
                                   <div className="col-span-2">
                                        <h3 className="mb-2 font-semibold">Additional Info</h3>
                                        <div className="p-3 bg-gray-100 rounded-md">
                                             <p><strong>Service:</strong> {selectedPacket.service || 'N/A'}</p>
                                             <p><strong>Details:</strong> {selectedPacket.info || 'N/A'}</p>
                                             <p><strong>Attack Type:</strong> {selectedPacket.type || 'None'}</p>
                                             <p><strong>Severity:</strong> {selectedPacket.severity || 'Unknown'}</p>
                                             <p><strong>Status:</strong> {selectedPacket.status || 'Unknown'}</p>
                                             <p><strong>Timestamp:</strong> {new Date(selectedPacket.timestamp).toLocaleString()}</p>
                                        </div>
                                   </div>
                              </div>
                         )}
                    </DialogContent>
               </Dialog>
          </>
     );
};

const Analytics: React.FC<PageProps> = ({ title }) => {
     const {
          stats,
          trafficData,
          protocolData,
          packets,
          loading,
          error,
          refreshData,
          resolvePacket
     } = useAnalytics();

     if (loading) {
          return (
               <div className="flex items-center justify-center w-full h-screen">
                    <div className="text-center space-y-4">
                         <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
                         <p className="text-lg text-gray-600">Loading analytics data...</p>
                    </div>
               </div>
          );
     }

     if (error) {
          return (
               <div className="flex items-center justify-center w-full h-screen">
                    <div className="text-center space-y-4">
                         <AlertTriangle className="w-12 h-12 mx-auto text-red-500" />
                         <p className="text-lg text-red-600">{error}</p>
                         <Button onClick={refreshData} className="gap-2">
                              <RefreshCcw className="w-4 h-4" />
                              Retry
                         </Button>
                    </div>
               </div>
          );
     }

     const statsCards = [
          {
               title: "Total Packets",
               value: stats?.totalPackets.toLocaleString() ?? "0",
               change: `${stats?.changes.totalPackets.toFixed(1)}%`,
               icon: Radio,
               color: "blue"
          },
          {
               title: "High Risk",
               value: stats?.highRiskPackets.toLocaleString() ?? "0",
               change: `${stats?.changes.highRiskPackets.toFixed(1)}%`,
               icon: AlertTriangle,
               color: "red"
          },
          {
               title: "Active Sessions",
               value: stats?.activeSessions.toLocaleString() ?? "0",
               change: `${stats?.changes.activeSessions.toFixed(1)}%`,
               icon: Zap,
               color: "green"
          },
          {
               title: "Bandwidth Usage",
               value: `${(stats?.bandwidthUsage ?? 0).toFixed(1)} TB`,
               change: `${stats?.changes.bandwidthUsage.toFixed(1)}%`,
               icon: Activity,
               color: "purple"
          },
          {
               title: "Unique IPs",
               value: stats?.uniqueIPs.toLocaleString() ?? "0",
               change: `${stats?.changes.uniqueIPs.toFixed(1)}%`,
               icon: Globe,
               color: "indigo"
          },
          {
               title: "Threats Blocked",
               value: stats?.threatsBlocked.toLocaleString() ?? "0",
               change: `${stats?.changes.threatsBlocked.toFixed(1)}%`,
               icon: Shield,
               color: "orange"
          }
     ];

     return (
          <div className="relative flex w-full h-screen p-5 bg-gray-100 shadow-md lg:p-5">
               <div className="flex flex-col w-full h-full bg-white rounded-md shadow-md">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                         <h1 className="text-2xl font-normal text-gray-800 font-poppins">
                              {title}
                         </h1>
                    </div>

                    <div className="flex-1 p-6 overflow-auto">
                         <div className="grid grid-cols-6 gap-4 mb-6">
                              {statsCards.map((stat, index) => (
                                   <Card key={index} className="transition-all duration-300 hover:shadow-lg">
                                        <CardHeader className="pb-2">
                                             <CardTitle className="flex items-center gap-2 text-sm">
                                                  <stat.icon className="w-4 h-4" />
                                                  {stat.title}
                                             </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                             <p className="text-2xl font-bold">{stat.value}</p>
                                             <p className={`text-sm ${stat.change.startsWith('-') ? 'text-red-600' : 'text-green-600'
                                                  }`}>
                                                  {stat.change} from last period
                                             </p>
                                        </CardContent>
                                   </Card>
                              ))}
                         </div>

                         <div className="grid grid-cols-12 gap-6 mb-6">
                              <Card className="col-span-8">
                                   <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                             <BarChart2 className="w-5 h-5 text-blue-500" />
                                             Network Traffic Overview
                                        </CardTitle>
                                   </CardHeader>
                                   <CardContent className="h-72">
                                        <ResponsiveContainer width="100%" height="100%">
                                             <LineChart data={trafficData}>
                                                  <CartesianGrid strokeDasharray="3 3" />
                                                  <XAxis dataKey="name" />
                                                  <YAxis yAxisId="left" />
                                                  <YAxis yAxisId="right" orientation="right" />
                                                  <Tooltip />
                                                  <Line
                                                       yAxisId="left"
                                                       type="monotone"
                                                       dataKey="packets"
                                                       stroke="#2563eb"
                                                       strokeWidth={2}
                                                       dot={{ r: 4 }}
                                                       activeDot={{ r: 8 }}
                                                  />
                                                  <Line
                                                       yAxisId="right"
                                                       type="monotone"
                                                       dataKey="bandwidth"
                                                       stroke="#16a34a"
                                                       strokeWidth={2}
                                                       dot={{ r: 4 }}
                                                       activeDot={{ r: 8 }}
                                                  />
                                             </LineChart>
                                        </ResponsiveContainer>
                                   </CardContent>
                              </Card>
                              <Card className="col-span-4">
                                   <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                             <Activity className="w-5 h-5 text-purple-500" />
                                             Protocol Distribution
                                        </CardTitle>
                                   </CardHeader>
                                   <CardContent className="h-72">
                                        <ResponsiveContainer width="100%" height="100%">
                                             <BarChart data={protocolData}>
                                                  <CartesianGrid strokeDasharray="3 3" />
                                                  <XAxis
                                                       dataKey="name"
                                                       tick={{ fontSize: 12 }}
                                                       interval={0}
                                                       angle={-45}
                                                       textAnchor="end"
                                                       height={60}
                                                  />
                                                  <YAxis />
                                                  <Tooltip />
                                                  <Bar
                                                       dataKey="value"
                                                       fill="#8884d8"
                                                       name="Count"
                                                       label={{
                                                            position: 'top',
                                                            fontSize: 12
                                                       }}
                                                  />
                                             </BarChart>
                                        </ResponsiveContainer>
                                   </CardContent>
                              </Card>

                              <PacketAnalysisSection
                                   packets={packets}
                                   onResolve={resolvePacket}
                              />
                         </div>
                    </div>
               </div>
          </div>
     );
};

export default Analytics;