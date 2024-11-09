export interface NetworkStats {
     totalPackets: number;
     highRiskPackets: number;
     activeSessions: number;
     bandwidthUsage: number;
     uniqueIPs: number;
     threatsBlocked: number;
     changes: {
          totalPackets: number;
          highRiskPackets: number;
          activeSessions: number;
          bandwidthUsage: number;
          uniqueIPs: number;
          threatsBlocked: number;
     };
}

export interface TrafficData {
     name: string;
     packets: number;
     bandwidth: number;
     threats: number;
}

export interface ProtocolDistribution {
     name: string;
     value: number;
}

export interface SecurityPacket {
     id: number;
     ipSrc: string;     
     ipDst: string;      
     port?: number;
     service?: string;
     info: string;
     type: string;      
     status: string;
     severity: string;  
     timestamp: string;
}

export interface ReportOptions {
     title?: string;
     notes?: string;
     includeCharts?: boolean;
     format?: 'pdf' | 'xlsx';
}

export const SeverityColors: Record<string, string> = {
     low: "bg-green-100 text-green-800",
     medium: "bg-yellow-100 text-yellow-800",
     high: "bg-orange-100 text-orange-800",
     critical: "bg-red-100 text-red-800"
};
