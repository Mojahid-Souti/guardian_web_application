using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using guardian_web_application.Server.Services;
using System.ComponentModel.DataAnnotations;

namespace guardian_web_application.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthController> _logger;

        public class LoginRequestModel
        {
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
            public bool RememberMe { get; set; }
        }

        public class RegisterRequestModel
        {
            [Required]
            [EmailAddress]
            public string Email { get; set; } = string.Empty;

            [Required]
            [StringLength(100, MinimumLength = 6)]
            public string Password { get; set; } = string.Empty;

            [Required]
            [Compare("Password")]
            public string ConfirmPassword { get; set; } = string.Empty;

            [Required]
            public string FullName { get; set; } = string.Empty;
        }

        public class AuthResponseModel
        {
            public bool Success { get; set; }
            public string Message { get; set; } = string.Empty;
            public string? RedirectUrl { get; set; }
        }

        public AuthController(
            IUserService userService,
            IConfiguration configuration,
            ILogger<AuthController> logger)
        {
            _userService = userService;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpGet("status")]
        public IActionResult GetStatus()
        {
            var isAuthenticated = User.Identity?.IsAuthenticated ?? false;
            return Ok(new
            {
                isAuthenticated,
                user = isAuthenticated ? new
                {
                    email = User.FindFirst(ClaimTypes.Email)?.Value,
                    name = User.FindFirst(ClaimTypes.Name)?.Value,
                    role = User.FindFirst(ClaimTypes.Role)?.Value
                } : null
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestModel request)
        {
            try
            {
                var (success, message, user) = await _userService.ValidateUserAsync(request.Email, request.Password);

                if (!success || user == null)
                {
                    return BadRequest(new AuthResponseModel
                    {
                        Success = false,
                        Message = message
                    });
                }

                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.FullName),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
                };

                var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                var authProperties = new AuthenticationProperties
                {
                    IsPersistent = request.RememberMe,
                    ExpiresUtc = DateTimeOffset.UtcNow.AddDays(7)
                };

                await HttpContext.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(claimsIdentity),
                    authProperties);

                return Ok(new AuthResponseModel
                {
                    Success = true,
                    Message = "Login successful",
                    RedirectUrl = $"{_configuration["Spa:ClientUrl"]}/app"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Login failed");
                return StatusCode(500, new AuthResponseModel
                {
                    Success = false,
                    Message = "An error occurred during login"
                });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestModel request)
        {
            try
            {
                if (request.Password != request.ConfirmPassword)
                {
                    return BadRequest(new AuthResponseModel
                    {
                        Success = false,
                        Message = "Passwords do not match"
                    });
                }

                var (success, message, user) = await _userService.RegisterUserAsync(
                    request.Email,
                    request.Password,
                    request.FullName);

                if (!success || user == null)
                {
                    return BadRequest(new AuthResponseModel
                    {
                        Success = false,
                        Message = message
                    });
                }

                // After successful registration, redirect to login instead of auto-login
                return Ok(new AuthResponseModel
                {
                    Success = true,
                    Message = "Registration successful. Please login.",
                    RedirectUrl = "https://localhost:7024/Auth/Login"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Registration failed");
                return StatusCode(500, new AuthResponseModel
                {
                    Success = false,
                    Message = "An error occurred during registration"
                });
            }
        }

        [HttpPost("sign-out")]
        public async Task<SignOutResult> SignOut()
        {
            try
            {
                await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

                // Clear authentication cookies
                foreach (var cookie in Request.Cookies.Keys)
                {
                    Response.Cookies.Delete(cookie);
                }

                return SignOut(new AuthenticationProperties
                {
                    RedirectUri = "/Auth/Login"
                }, CookieAuthenticationDefaults.AuthenticationScheme);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Logout failed");
                throw;
            }
        }
    }
}