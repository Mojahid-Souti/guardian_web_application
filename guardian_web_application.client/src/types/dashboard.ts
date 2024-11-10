// dashboard.ts
export interface PacketEntry {
     id: number;
     src: string;
     dst: string;
     port: number;
     service: string;
     info: string;
     attack: string;
     threatLevel: string;
     timestamp: string;
}

export interface DashboardStats {
     totalPackets: number;
     attacks: number;
     intrusions: number;
     activeThreats: number;
}

export interface IntrusionTrend {
     name: string;
     detected: number;
     blocked: number;
     average: number;
}

export interface IntrusionType {
     name: string;
     count: number;
     severity: string;
     risk: number;
}

export interface PageProps {
     title: string;
}

export interface CustomTooltipProps {
     active?: boolean;
     payload?: Array<{
          name: string;
          value: number;
          color: string;
     }>;
     label?: string;
}