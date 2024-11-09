using Microsoft.AspNetCore.Mvc;
using guardian_web_application.Server.Services;
using guardian_web_application.Server.Models;
using Microsoft.AspNetCore.Authorization;

namespace guardian_web_application.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyticsController : ControllerBase
    {
        private readonly IAnalyticsService _analyticsService;
        private readonly ILogger<AnalyticsController> _logger;

        public AnalyticsController(IAnalyticsService analyticsService, ILogger<AnalyticsController> logger)
        {
            _analyticsService = analyticsService;
            _logger = logger;
        }

        [HttpGet("stats")]
        public async Task<ActionResult<NetworkStats>> GetStats()
        {
            try
            {
                var stats = await _analyticsService.GetNetworkStatsAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching network stats");
                return StatusCode(500, "Error fetching network statistics");
            }
        }

        [HttpGet("traffic")]
        public async Task<ActionResult<IEnumerable<TrafficData>>> GetTrafficData()
        {
            try
            {
                var data = await _analyticsService.GetTrafficDataAsync();
                return Ok(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching traffic data");
                return StatusCode(500, "Error fetching traffic data");
            }
        }

        [HttpGet("protocols")]
        public async Task<ActionResult<IEnumerable<ProtocolDistribution>>> GetProtocolDistribution()
        {
            try
            {
                var data = await _analyticsService.GetProtocolDistributionAsync();
                return Ok(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching protocol distribution");
                return StatusCode(500, "Error fetching protocol distribution");
            }
        }

        [HttpGet("packets")]
        public async Task<ActionResult<IEnumerable<SecurityPacket>>> GetSecurityPackets()
        {
            try
            {
                var packets = await _analyticsService.GetSecurityPacketsAsync();
                return Ok(packets);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching security packets");
                return StatusCode(500, "Error fetching security packets");
            }
        }

        [HttpGet("packets/{id}")]
        public async Task<ActionResult<SecurityPacket>> GetPacketDetails(int id)
        {
            try
            {
                var packet = await _analyticsService.GetPacketDetailsAsync(id);
                if (packet == null) return NotFound();
                return Ok(packet);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching packet details");
                return StatusCode(500, "Error fetching packet details");
            }
        }

        [HttpPost("packets/{id}/resolve")]
        public async Task<ActionResult> ResolvePacket(int id)
        {
            try
            {
                var result = await _analyticsService.ResolvePacketAsync(id);
                if (!result) return NotFound();
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error resolving packet");
                return StatusCode(500, "Error resolving packet");
            }
        }

        [HttpPost("reports")]
        public async Task<ActionResult> GenerateReport([FromBody] ReportRequest request)
        {
            try
            {
                var fileName = await _analyticsService.GenerateReportAsync(
                    request.StartDate,
                    request.EndDate,
                    request.ReportType);

                return Ok(new { fileName });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating report");
                return StatusCode(500, "Error generating report");
            }
        }

        [HttpGet("reports/{fileName}")]
        public IActionResult DownloadReport(string fileName)
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "reports", fileName);
            if (!System.IO.File.Exists(filePath))
                return NotFound();

            var memory = new MemoryStream();
            using (var stream = new FileStream(filePath, FileMode.Open))
            {
                stream.CopyTo(memory);
            }
            memory.Position = 0;

            return File(memory, "application/pdf", fileName);
        }
    }

    public class ReportRequest
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public required string ReportType { get; set; }
    }
}