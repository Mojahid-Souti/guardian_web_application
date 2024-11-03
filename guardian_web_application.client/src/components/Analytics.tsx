
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, AlertTriangle, Zap, Globe, Shield, Radio, BarChart2, Eye } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "./ui/badge";
import { useState } from "react";


interface PageProps {
  title: string;
}

// Type for Packet
interface Packet {
  id: number;
  ipSrc: string;
  ipDst: string;
  info: string;
  type: string;
  status: string;
  severity: string;
}

const Analytics: React.FC<PageProps> = ({ title }) => {
  // Sample stats data
  const statsCards = [
    { title: "Total Packets", value: "45,823", change: "+12.5%", icon: Radio, color: "blue" },
    { title: "High Risk", value: "238", change: "-5.2%", icon: AlertTriangle, color: "red" },
    { title: "Active Sessions", value: "1,293", change: "+8.7%", icon: Zap, color: "green" },
    { title: "Bandwidth Usage", value: "2.8 TB", change: "+15.3%", icon: Activity, color: "purple" },
    { title: "Unique IPs", value: "3,456", change: "+10.1%", icon: Globe, color: "indigo" },
    { title: "Threats Blocked", value: "892", change: "-8.9%", icon: Shield, color: "orange" }
  ];

  // Sample traffic data
  const trafficData = [
    { name: '00:00', packets: 150, bandwidth: 2.5, threats: 12 },
    { name: '04:00', packets: 200, bandwidth: 3.2, threats: 8 },
    { name: '08:00', packets: 500, bandwidth: 5.8, threats: 25 },
    { name: '12:00', packets: 800, bandwidth: 8.1, threats: 15 },
    { name: '16:00', packets: 600, bandwidth: 6.3, threats: 20 },
    { name: '20:00', packets: 300, bandwidth: 4.2, threats: 10 }
  ];

  // Sample protocol distribution
  const protocolData = [
    { name: 'TCP', value: 65 },
    { name: 'UDP', value: 25 },
    { name: 'ICMP', value: 10 }
  ];
  const PacketAnalysisSection = () => {
    const [packets, setPackets] = useState<Packet[]>([
      {
        id: 1,
        ipSrc: "192.168.1.100",
        ipDst: "10.0.0.50",
        info: "Potential SQL Injection",
        type: "SQL Injection",
        status: "Unresolved",
        severity: "High"
      },
      {
        id: 2,
        ipSrc: "203.0.113.45",
        ipDst: "172.16.0.25",
        info: "Large ICMP Packet",
        type: "Potential DoS",
        status: "Unresolved",
        severity: "Medium"
      },
      {
        id: 3,
        ipSrc: "198.51.100.75",
        ipDst: "192.168.0.10",
        info: "Unusual Port Scanning",
        type: "Reconnaissance",
        status: "Unresolved",
        severity: "Low"
      },
      {
        id: 4,
        ipSrc: "10.10.10.55",
        ipDst: "203.0.113.22",
        info: "Repeated Failed Login",
        type: "Brute Force",
        status: "Unresolved",
        severity: "High"
      },
      {
        id: 5,
        ipSrc: "172.16.10.200",
        ipDst: "192.168.1.50",
        info: "Encrypted Traffic Anomaly",
        type: "Potential Exfiltration",
        status: "Unresolved",
        severity: "Critical"
      }
    ]);

    const [selectedPacket, setSelectedPacket] = useState<Packet | null>(null);
    const [isPacketDetailOpen, setIsPacketDetailOpen] = useState(false);

    const getSeverityBadge = (severity: string) => {
      const severityColors: Record<string, string> = {
        "Low": "bg-green-100 text-green-800",
        "Medium": "bg-yellow-100 text-yellow-800",
        "High": "bg-red-100 text-red-800",
        "Critical": "bg-purple-100 text-purple-800"
      };
      return (
        <Badge variant="outline" className={severityColors[severity]}>
          {severity}
        </Badge>
      );
    };

    const handlePacketAction = (packet: Packet, action: string) => {
      switch (action) {
        case "view":
          setSelectedPacket(packet);
          setIsPacketDetailOpen(true);
          break;
        case "resolve":
          setPackets(packets.filter((p) => p.id !== packet.id));
          break;
      }
    };

    return (
      <>
        {/* Packet Analysis Section */}
        <Card className="col-span-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-500" />
              Packet Analysis
            </CardTitle>
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
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packets.map((packet) => (
                  <TableRow key={packet.id}>
                    <TableCell>{packet.ipSrc}</TableCell>
                    <TableCell>{packet.ipDst}</TableCell>
                    <TableCell>{packet.info}</TableCell>
                    <TableCell>{packet.type}</TableCell>
                    <TableCell>{getSeverityBadge(packet.severity)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{packet.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePacketAction(packet, "view")}
                        >
                          <Eye className="w-4 h-4 mr-1" /> View
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handlePacketAction(packet, "resolve")}
                        >
                          Resolve
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Packet Detail Dialog */}
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
                    <p><strong>IP:</strong> {selectedPacket.ipSrc}</p>
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Packet Destination</h3>
                  <div className="p-3 bg-gray-100 rounded-md">
                    <p><strong>IP:</strong> {selectedPacket.ipDst}</p>
                  </div>
                </div>
                <div className="col-span-2">
                  <h3 className="mb-2 font-semibold">Additional Info</h3>
                  <div className="p-3 bg-gray-100 rounded-md">
                    <p><strong>Details:</strong> {selectedPacket.info}</p>
                    <p><strong>Type:</strong> {selectedPacket.type}</p>
                    <p><strong>Status:</strong> {selectedPacket.status}</p>
                    <p><strong>Severity:</strong> {selectedPacket.severity}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        
      </>
    );
  };


  return (
    <div className="relative flex w-full h-screen p-5 bg-gray-100 shadow-md lg:p-5">

      {/* Main content */}
      <div className="flex flex-col w-full h-full bg-white rounded-md shadow-md">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-normal text-gray-800 font-poppins">
            {title}
          </h1>
        </div>

        <div className="flex-1 p-6 overflow-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-6 gap-4 mb-6">
            {statsCards.map((stat, index) => (
              <Card key={index} className="transition-all duration-300 cursor-pointer hover:scale-105">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <stat.icon className="w-4 h-4" />
                    {stat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className={`text-sm ${
                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change} from last period
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-12 gap-6 mb-6">
            {/* Traffic Overview */}
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

            {/* Protocol Distribution */}
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
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <PacketAnalysisSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;