using guardian_web_application.Server.Models;

namespace guardian_web_application.Server.Services
{
    public interface IAnalyticsService
    {
        Task<NetworkStats> GetNetworkStatsAsync();
        Task<IEnumerable<TrafficData>> GetTrafficDataAsync();
        Task<IEnumerable<ProtocolDistribution>> GetProtocolDistributionAsync();
        Task<IEnumerable<SecurityPacket>> GetSecurityPacketsAsync();
        Task<SecurityPacket> GetPacketDetailsAsync(int id);
        Task<bool> ResolvePacketAsync(int id);
        Task<string> GenerateReportAsync(DateTime startDate, DateTime endDate, string reportType);
    }
}