using Microsoft.AspNetCore.Mvc;

namespace guardian_web_application.Server.Services
{
    public class BackgroundCleanupService : IHostedService
    {
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<BackgroundCleanupService> _logger;

        public BackgroundCleanupService(
            IWebHostEnvironment env,
            ILogger<BackgroundCleanupService> logger)
        {
            _env = env;
            _logger = logger;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            try
            {
                var reportsPath = Path.Combine(_env.WebRootPath, "reports");
                Directory.CreateDirectory(reportsPath);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating reports directory");
            }
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }
    }
}
