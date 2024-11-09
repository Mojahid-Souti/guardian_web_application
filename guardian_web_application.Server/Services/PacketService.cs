using CsvHelper;
using guardian_web_application.Server.Models;
using Microsoft.Extensions.Configuration;
using System.Formats.Asn1;
using System.Globalization;

namespace guardian_web_application.Server.Services
{
    public class PacketService : IPacketService
    {
        private readonly string _csvPath;
        private readonly ILogger<PacketService> _logger;

        public PacketService(IConfiguration configuration, ILogger<PacketService> logger)
        {
            _logger = logger;
            string baseDir = AppDomain.CurrentDomain.BaseDirectory;
            string dataDir = Path.Combine(baseDir, "Data");
            _csvPath = Path.Combine(dataDir, "packets.csv");
            Directory.CreateDirectory(dataDir);

            if (!File.Exists(_csvPath))
            {
                _logger.LogInformation("Creating new sample data file at: " + _csvPath);
                CreateSampleData();
            }
        }

        private void CreateSampleData()
        {
            try
            {
                var random = new Random();
                var startDate = new DateTime(2023, 1, 1);
                var attackTypes = new[] { "None", "DDoS", "Brute Force", "SQL Injection", "XSS", "Remote Code Execution",
                                        "Man in Middle", "Malware", "Path Traversal", "Data Exfiltration", "Reconnaissance", "CSRF" };
                var services = new[] { "HTTP", "HTTPS", "FTP", "SSH", "SMTP", "MySQL", "RDP", "DNS" };
                var ports = new Dictionary<string, int> {
                    { "HTTP", 80 }, { "HTTPS", 443 }, { "FTP", 21 }, { "SSH", 22 },
                    { "SMTP", 25 }, { "MySQL", 3306 }, { "RDP", 3389 }, { "DNS", 53 }
                };
                var threatLevels = new[] { "low", "medium", "high", "critical" };

                var sampleData = new List<PacketEntry>();
                var id = 1;

                // Create entries for each month
                for (int month = 1; month <= 12; month++)
                {
                    // Generate more entries for peak activity months
                    int entriesPerMonth = month >= 6 && month <= 8 ? 20 : 15;

                    for (int entry = 1; entry <= entriesPerMonth; entry++)
                    {
                        var day = random.Next(1, DateTime.DaysInMonth(2023, month) + 1);
                        var timestamp = new DateTime(2023, month, day);
                        var attack = attackTypes[random.Next(attackTypes.Length)];
                        var service = services[random.Next(services.Length)];
                        var threatLevel = attack == "None" ? "low" : threatLevels[random.Next(1, threatLevels.Length)];

                        sampleData.Add(new PacketEntry
                        {
                            Id = id++,
                            Src = $"192.168.1.{random.Next(1, 255)}",
                            Dst = $"192.168.1.{random.Next(1, 255)}",
                            Port = ports[service],
                            Service = service,
                            Info = GenerateInfo(attack),
                            Attack = attack,
                            ThreatLevel = threatLevel,
                            Timestamp = timestamp.AddHours(random.Next(24)).AddMinutes(random.Next(60))
                        });
                    }
                }

                // Sort by timestamp
                sampleData = sampleData.OrderBy(x => x.Timestamp).ToList();

                // Write to CSV
                using (var writer = new StreamWriter(_csvPath, false, System.Text.Encoding.UTF8))
                using (var csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
                {
                    csv.WriteRecords(sampleData);
                }

                _logger.LogInformation($"Successfully created sample data with {sampleData.Count} entries");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating sample data file");
                throw;
            }
        }

        private string GenerateInfo(string attack)
        {
            return attack switch
            {
                "None" => "Normal access",
                "DDoS" => "High traffic volume detected",
                "Brute Force" => "Multiple login attempts",
                "SQL Injection" => "Suspicious SQL query pattern",
                "XSS" => "Cross-site scripting attempt",
                "Remote Code Execution" => "Suspicious command execution",
                "Man in Middle" => "SSL/TLS anomaly detected",
                "Malware" => "Malicious payload detected",
                "Path Traversal" => "Directory traversal attempt",
                "Data Exfiltration" => "Unusual data transfer pattern",
                "Reconnaissance" => "System scanning detected",
                "CSRF" => "Cross-site request forgery attempt",
                _ => "Unknown activity"
            };
        }

        public async Task<IEnumerable<PacketEntry>> GetPacketsAsync()
        {
            try
            {
                var packets = new List<PacketEntry>();
                using (var reader = new StreamReader(_csvPath))
                using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
                {
                    packets = csv.GetRecords<PacketEntry>().ToList();
                }
                return packets;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error reading packet data from CSV");
                throw;
            }
        }

        public async Task<IDictionary<string, int>> GetPacketStatsAsync()
        {
            var packets = await GetPacketsAsync();
            return new Dictionary<string, int>
            {
                ["TotalPackets"] = packets.Count(),
                ["Attacks"] = packets.Count(p => p.Attack != "None"),
                ["Intrusions"] = packets.Count(p => p.ThreatLevel == "high" || p.ThreatLevel == "critical"),
                ["ActiveThreats"] = packets.Count(p => p.ThreatLevel != "low")
            };
        }

        public async Task<IEnumerable<IntrusionTrend>> GetIntrusionTrendsAsync()
        {
            var packets = await GetPacketsAsync();
            return packets
                .GroupBy(p => p.Timestamp.ToString("MMM"))
                .Select(g => new IntrusionTrend
                {
                    Name = g.Key,
                    Detected = g.Count(),
                    Blocked = g.Count(p => p.ThreatLevel != "critical"),
                    Average = g.Average(p => p.ThreatLevel == "critical" ? 1 : 0) * 100
                })
                .OrderBy(t => DateTime.ParseExact(t.Name, "MMM", CultureInfo.InvariantCulture))
                .ToList();
        }

        public async Task<IEnumerable<IntrusionType>> GetIntrusionTypesAsync()
        {
            var packets = await GetPacketsAsync();
            return packets
                .Where(p => p.Attack != "None")
                .GroupBy(p => p.Attack)
                .Select(g => new IntrusionType
                {
                    Name = g.Key,
                    Count = g.Count(),
                    Severity = g.Max(p => p.ThreatLevel),
                    Risk = CalculateRisk(g.ToList())
                })
                .OrderByDescending(t => t.Count)
                .ToList();
        }

        public async Task<bool> IgnorePacketAsync(int id)
        {
            try
            {
                var packets = (await GetPacketsAsync()).ToList();
                var updatedPackets = packets.Where(p => p.Id != id);

                using (var writer = new StreamWriter(_csvPath))
                using (var csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
                {
                    csv.WriteRecords(updatedPackets);
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error ignoring packet");
                return false;
            }
        }

        private int CalculateRisk(List<PacketEntry> packets)
        {
            var threatLevelWeights = new Dictionary<string, int>
            {
                ["low"] = 25,
                ["medium"] = 50,
                ["high"] = 75,
                ["critical"] = 100
            };

            return (int)packets.Average(p => threatLevelWeights[p.ThreatLevel.ToLower()]);
        }

        public string GetServiceFromPort(int port)
        {
            if (Enum.IsDefined(typeof(PortService), port))
            {
                return ((PortService)port).ToString();
            }
            return "Unknown";
        }

    }

}
