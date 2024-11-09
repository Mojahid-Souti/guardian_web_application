using guardian_web_application.Server.Models;
using guardian_web_application.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace guardian_web_application.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class IntrusionDetectionController : ControllerBase
    {
        private readonly IPacketService _packetService;
        private readonly ILogger<IntrusionDetectionController> _logger;

        public IntrusionDetectionController(IPacketService packetService, ILogger<IntrusionDetectionController> logger)
        {
            _packetService = packetService;
            _logger = logger;
        }

        [HttpGet("packets")]
        public async Task<ActionResult<IEnumerable<PacketEntry>>> GetPackets()
        {
            try
            {
                var packets = await _packetService.GetPacketsAsync();
                return Ok(packets);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving packets");
                return StatusCode(500, "An error occurred while retrieving packets");
            }
        }

        [HttpGet("stats")]
        public async Task<ActionResult<IDictionary<string, int>>> GetStats()
        {
            try
            {
                var stats = await _packetService.GetPacketStatsAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving stats");
                return StatusCode(500, "An error occurred while retrieving stats");
            }
        }

        [HttpGet("trends")]
        public async Task<ActionResult<IEnumerable<IntrusionTrend>>> GetTrends()
        {
            try
            {
                var trends = await _packetService.GetIntrusionTrendsAsync();
                return Ok(trends);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving trends");
                return StatusCode(500, "An error occurred while retrieving trends");
            }
        }

        [HttpGet("types")]
        public async Task<ActionResult<IEnumerable<IntrusionType>>> GetTypes()
        {
            try
            {
                var types = await _packetService.GetIntrusionTypesAsync();
                return Ok(types);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving types");
                return StatusCode(500, "An error occurred while retrieving types");
            }
        }

        [HttpPost("ignore/{id}")]
        public async Task<ActionResult> IgnorePacket(int id)
        {
            try
            {
                var result = await _packetService.IgnorePacketAsync(id);
                if (result)
                    return Ok();
                return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error ignoring packet");
                return StatusCode(500, "An error occurred while ignoring the packet");
            }
        }
    }
}
