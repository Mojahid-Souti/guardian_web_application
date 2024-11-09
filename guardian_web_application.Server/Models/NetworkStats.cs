namespace guardian_web_application.Server.Models
{
    public class NetworkStats
    {
        public int TotalPackets { get; set; }
        public int HighRiskPackets { get; set; }
        public int ActiveSessions { get; set; }
        public double BandwidthUsage { get; set; }
        public int UniqueIPs { get; set; }
        public int ThreatsBlocked { get; set; }
        public Dictionary<string, double> Changes { get; set; } = new();
    }

    public class TrafficData
    {
        public required string TimeSlot { get; set; }
        public int Packets { get; set; }
        public double Bandwidth { get; set; }
        public int Threats { get; set; }
    }

    public class ProtocolDistribution
    {
        public required string Name { get; set; }
        public int Value { get; set; }
    }

    public class SecurityPacket
    {
        public int Id { get; set; }
        public required string IpSrc { get; set; }
        public required string IpDst { get; set; }
        public required string Info { get; set; }
        public required string Type { get; set; }
        public required string Status { get; set; }
        public required string Severity { get; set; }
        public DateTime Timestamp { get; set; }
    }

    public class AnalyticsReport
    {
        public int Id { get; set; }
        public DateTime GeneratedAt { get; set; }
        public required string ReportType { get; set; }
        public required string GeneratedBy { get; set; }
        public required string FilePath { get; set; }
        public required NetworkStats Stats { get; set; }
        public required List<SecurityPacket> Packets { get; set; }
    }
}
