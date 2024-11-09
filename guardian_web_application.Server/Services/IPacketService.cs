using guardian_web_application.Server.Models;

namespace guardian_web_application.Server.Services
{
    public interface IPacketService
    {
        Task<IEnumerable<PacketEntry>> GetPacketsAsync();
        Task<IDictionary<string, int>> GetPacketStatsAsync();
        Task<IEnumerable<IntrusionTrend>> GetIntrusionTrendsAsync();
        Task<IEnumerable<IntrusionType>> GetIntrusionTypesAsync();
        Task<bool> IgnorePacketAsync(int id);
    }
}
