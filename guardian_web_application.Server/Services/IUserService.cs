using guardian_web_application.Server.Models;

namespace guardian_web_application.Server.Services
{
    public interface IUserService
    {
        Task<(bool success, string message, User? user)> ValidateUserAsync(string email, string password);
        Task<(bool success, string message, User? user)> RegisterUserAsync(string email, string password, string fullName);
        Task<User?> GetUserByEmail(string email);
        Task<bool> ChangePassword(string userId, string currentPassword, string newPassword);
    }
}