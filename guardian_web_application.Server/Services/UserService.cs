using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using guardian_web_application.Server.Data;
using guardian_web_application.Server.Models;

namespace guardian_web_application.Server.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<UserService> _logger;

        public UserService(ApplicationDbContext context, ILogger<UserService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<(bool success, string message, User? user)> ValidateUserAsync(string email, string password)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
                if (user == null)
                {
                    return (false, "Invalid email or password", null);
                }

                if (!VerifyPassword(password, user.PasswordHash))
                {
                    return (false, "Invalid email or password", null);
                }

                user.LastLoginAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return (true, "Login successful", user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating user");
                return (false, "An error occurred during login", null);
            }
        }

        public async Task<(bool success, string message, User? user)> RegisterUserAsync(string email, string password, string fullName)
        {
            try
            {
                if (await _context.Users.AnyAsync(u => u.Email.ToLower() == email.ToLower()))
                {
                    return (false, "Email already registered", null);
                }

                var user = new User
                {
                    Email = email,
                    PasswordHash = HashPassword(password),
                    FullName = fullName,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return (true, "Registration successful", user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error registering user");
                return (false, "An error occurred during registration", null);
            }
        }

        public async Task<User?> GetUserByEmail(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
        }

        public async Task<bool> ChangePassword(string userId, string currentPassword, string newPassword)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null || !VerifyPassword(currentPassword, user.PasswordHash))
                {
                    return false;
                }

                user.PasswordHash = HashPassword(newPassword);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error changing password");
                return false;
            }
        }

        private static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }

        private static bool VerifyPassword(string password, string hash)
        {
            return HashPassword(password) == hash;
        }
    }
}