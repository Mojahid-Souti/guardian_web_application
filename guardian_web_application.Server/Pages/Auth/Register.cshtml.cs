using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace guardian_web_application.Server.Validation
{
    public class StrongPasswordAttribute : ValidationAttribute
    {
        public int MinimumLength { get; set; } = 8;
        public bool RequireDigit { get; set; } = true;
        public bool RequireLowercase { get; set; } = true;
        public bool RequireUppercase { get; set; } = true;
        public bool RequireSpecialCharacter { get; set; } = true;
        public bool DisallowCommonPasswords { get; set; } = true;

        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value == null || string.IsNullOrWhiteSpace(value.ToString()))
            {
                return new ValidationResult("Password cannot be empty.");
            }

            var password = value.ToString();
            var errors = new List<string>();

            if (password.Length < MinimumLength)
                errors.Add($"Password must be at least {MinimumLength} characters long.");

            if (RequireDigit && !password.Any(char.IsDigit))
                errors.Add("Password must contain at least one digit.");

            if (RequireLowercase && !password.Any(char.IsLower))
                errors.Add("Password must contain at least one lowercase letter.");

            if (RequireUppercase && !password.Any(char.IsUpper))
                errors.Add("Password must contain at least one uppercase letter.");

            if (RequireSpecialCharacter && !Regex.IsMatch(password, @"[!@#$%^&*(),.?\"":{}|<>]"))
                errors.Add("Password must contain at least one special character.");

            if (DisallowCommonPasswords && IsCommonPassword(password))
                errors.Add("This password is too common. Please choose a more unique password.");

            // Check for sequential characters
            if (HasSequentialCharacters(password))
                errors.Add("Password cannot contain sequential characters (e.g., '123', 'abc').");

            // Check for repeating characters
            if (HasRepeatingCharacters(password))
                errors.Add("Password cannot contain repeating characters (e.g., '111', 'aaa').");

            return errors.Count == 0
                ? ValidationResult.Success
                : new ValidationResult(string.Join(" ", errors));
        }

        private bool IsCommonPassword(string password)
        {
            // Add a list of common passwords to check against
            var commonPasswords = new HashSet<string>
            {
                "password123", "12345678", "qwerty123", "admin123",
                "letmein123", "welcome123", "monkey123", "football123"
                // Add more common passwords as needed
            };

            return commonPasswords.Contains(password.ToLower());
        }

        private bool HasSequentialCharacters(string password)
        {
            const string sequences = "abcdefghijklmnopqrstuvwxyz01234567890";
            const int sequenceLength = 3;

            for (int i = 0; i <= sequences.Length - sequenceLength; i++)
            {
                string forward = sequences.Substring(i, sequenceLength);
                string backward = new string(forward.Reverse().ToArray());

                if (password.ToLower().Contains(forward) || password.ToLower().Contains(backward))
                    return true;
            }

            return false;
        }

        private bool HasRepeatingCharacters(string password)
        {
            const int maxRepeats = 3;
            for (int i = 0; i <= password.Length - maxRepeats; i++)
            {
                if (password.Skip(i).Take(maxRepeats).Distinct().Count() == 1)
                    return true;
            }

            return false;
        }
    }
}