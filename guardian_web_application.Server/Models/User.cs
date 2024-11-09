using System.ComponentModel.DataAnnotations;

namespace guardian_web_application.Server.Models
{
    public class User
    {
        public Guid Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public DateTime? LastLoginAt { get; set; }
    }
}