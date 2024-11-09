using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using Table = iText.Layout.Element.Table;
using Document = iText.Layout.Document;
using guardian_web_application.Server.Models;

namespace guardian_web_application.Server.Services
{
    public class AnalyticsService : IAnalyticsService
    {
        private readonly IPacketService _packetService;
        private readonly ILogger<AnalyticsService> _logger;
        private readonly string _reportsPath;

        public AnalyticsService(
            IPacketService packetService,
            ILogger<AnalyticsService> logger,
            IWebHostEnvironment env)
        {
            _packetService = packetService;
            _logger = logger;
            _reportsPath = Path.Combine(env.WebRootPath, "reports");
            Directory.CreateDirectory(_reportsPath);
        }

        public async Task<NetworkStats> GetNetworkStatsAsync()
        {
            var packets = await _packetService.GetPacketsAsync();
            var stats = new NetworkStats
            {
                TotalPackets = packets.Count(),
                HighRiskPackets = packets.Count(p => p.ThreatLevel == "high" || p.ThreatLevel == "critical"),
                ActiveSessions = packets.GroupBy(p => p.Src).Count(),
                BandwidthUsage = CalculateBandwidthUsage(packets),
                UniqueIPs = GetUniqueIPs(packets),
                ThreatsBlocked = packets.Count(p => p.Attack != "None")
            };

            // Calculate changes (you would typically compare with historical data)
            stats.Changes = CalculateChanges(stats);
            return stats;
        }

        public async Task<IEnumerable<TrafficData>> GetTrafficDataAsync()
        {
            var packets = await _packetService.GetPacketsAsync();
            return packets
                .GroupBy(p => p.Timestamp.ToString("HH:00"))
                .Select(g => new TrafficData
                {
                    TimeSlot = g.Key,
                    Packets = g.Count(),
                    Bandwidth = CalculateGroupBandwidth(g),
                    Threats = g.Count(p => p.Attack != "None")
                })
                .OrderBy(t => t.TimeSlot);
        }

        public async Task<IEnumerable<ProtocolDistribution>> GetProtocolDistributionAsync()
        {
            var packets = await _packetService.GetPacketsAsync();
            return packets
                .GroupBy(p => p.Service)
                .Select(g => new ProtocolDistribution
                {
                    Name = g.Key,
                    Value = g.Count()
                });
        }

        public async Task<IEnumerable<SecurityPacket>> GetSecurityPacketsAsync()
        {
            var packets = await _packetService.GetPacketsAsync();
            return packets
                .Where(p => p.Attack != "None")
                .Select(p => new SecurityPacket
                {
                    Id = p.Id,
                    IpSrc = p.Src,
                    IpDst = p.Dst,
                    Info = p.Info,
                    Type = p.Attack,
                    Status = "Unresolved",
                    Severity = p.ThreatLevel,
                    Timestamp = p.Timestamp
                });
        }

        public async Task<SecurityPacket> GetPacketDetailsAsync(int id)
        {
            var packets = await _packetService.GetPacketsAsync();
            var packet = packets.FirstOrDefault(p => p.Id == id);
            if (packet == null) return null;

            return new SecurityPacket
            {
                Id = packet.Id,
                IpSrc = packet.Src,
                IpDst = packet.Dst,
                Info = packet.Info,
                Type = packet.Attack,
                Status = "Unresolved",
                Severity = packet.ThreatLevel,
                Timestamp = packet.Timestamp
            };
        }

        public async Task<bool> ResolvePacketAsync(int id)
        {
            return await _packetService.IgnorePacketAsync(id);
        }

        public async Task<string> GenerateReportAsync(DateTime startDate, DateTime endDate, string reportType)
        {
            var packets = await _packetService.GetPacketsAsync();
            var stats = await GetNetworkStatsAsync();
            var fileName = $"security_report_{DateTime.Now:yyyyMMddHHmmss}.pdf";
            var filePath = Path.Combine(_reportsPath, fileName);

            using (var writer = new PdfWriter(filePath))
            using (var pdf = new PdfDocument(writer))
            using (var document = new Document(pdf))
            {
                // Add title
                document.Add(new Paragraph($"Security Analysis Report")
                    .SetFontSize(20)
                    .SetBold());

                document.Add(new Paragraph($"Generated on: {DateTime.Now}")
                    .SetFontSize(12));

                // Add statistics
                document.Add(new Paragraph("\nNetwork Statistics")
                    .SetFontSize(16)
                    .SetBold());

                var statsTable = new Table(2);
                AddTableRow(statsTable, "Total Packets", stats.TotalPackets.ToString());
                AddTableRow(statsTable, "High Risk Packets", stats.HighRiskPackets.ToString());
                AddTableRow(statsTable, "Threats Blocked", stats.ThreatsBlocked.ToString());
                document.Add(statsTable);

                // Add security incidents
                document.Add(new Paragraph("\nSecurity Incidents")
                    .SetFontSize(16)
                    .SetBold());

                var incidentsTable = new Table(4);
                AddTableRow(incidentsTable, "Source IP", "Destination IP", "Attack Type", "Severity");

                foreach (var packet in packets.Where(p => p.Attack != "None")
                                            .Where(p => p.Timestamp >= startDate && p.Timestamp <= endDate))
                {
                    AddTableRow(incidentsTable,
                        packet.Src,
                        packet.Dst,
                        packet.Attack,
                        packet.ThreatLevel);
                }

                document.Add(incidentsTable);

                // Add summary section
                document.Add(new Paragraph("\nSummary")
                    .SetFontSize(16)
                    .SetBold());

                var summaryTable = new Table(2);
                AddTableRow(summaryTable, "Report Period", $"{startDate:d} to {endDate:d}");
                AddTableRow(summaryTable, "Total Incidents",
                    packets.Count(p => p.Attack != "None" &&
                                     p.Timestamp >= startDate &&
                                     p.Timestamp <= endDate).ToString());
                AddTableRow(summaryTable, "Critical Incidents",
                    packets.Count(p => p.ThreatLevel == "critical" &&
                                     p.Timestamp >= startDate &&
                                     p.Timestamp <= endDate).ToString());
                document.Add(summaryTable);
            }

            return fileName;
        }

        private void AddTableRow(Table table, params string[] cells)
        {
            foreach (var cell in cells)
            {
                table.AddCell(new Cell().Add(new Paragraph(cell)));
            }
        }


        private double CalculateBandwidthUsage(IEnumerable<PacketEntry> packets)
        {
            // Simplified calculation - you would typically have actual bandwidth data
            return packets.Count() * 0.001; // Assuming average packet size of 1KB
        }

        private int GetUniqueIPs(IEnumerable<PacketEntry> packets)
        {
            return packets.Select(p => p.Src)
                         .Union(packets.Select(p => p.Dst))
                         .Distinct()
                         .Count();
        }

        private double CalculateGroupBandwidth(IEnumerable<PacketEntry> packets)
        {
            return packets.Count() * 0.001;
        }

        private Dictionary<string, double> CalculateChanges(NetworkStats currentStats)
        {
            // In a real application, you would compare with historical data
            return new Dictionary<string, double>
            {
                ["TotalPackets"] = 12.5,
                ["HighRiskPackets"] = -5.2,
                ["ActiveSessions"] = 8.7,
                ["BandwidthUsage"] = 15.3,
                ["UniqueIPs"] = 10.1,
                ["ThreatsBlocked"] = -8.9
            };
        }
    }
}