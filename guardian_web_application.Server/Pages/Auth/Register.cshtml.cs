using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using guardian_web_application.Server.Services;

namespace guardian_web_application.Server.Pages.Auth
{
    public class RegisterModel : PageModel
    {
        private readonly IUserService _userService;
        private readonly IConfiguration _configuration;

        [BindProperty]
        public InputModel Input { get; set; } = new();

        public class InputModel
        {
            [Required]
            [EmailAddress]
            [Display(Name = "Email")]
            public string Email { get; set; } = string.Empty;

            [Required]
            [StringLength(100, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 6)]
            [DataType(DataType.Password)]
            [Display(Name = "Password")]
            public string Password { get; set; } = string.Empty;

            [DataType(DataType.Password)]
            [Display(Name = "Confirm password")]
            [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
            public string ConfirmPassword { get; set; } = string.Empty;

            [Required]
            [Display(Name = "Full Name")]
            public string FullName { get; set; } = string.Empty;
        }

        public RegisterModel(IUserService userService, IConfiguration configuration)
        {
            _userService = userService;
            _configuration = configuration;
        }

        public IActionResult OnGet()
        {
            if (User.Identity?.IsAuthenticated ?? false)
            {
                return Redirect(_configuration["Spa:ClientUrl"] + "/app");
            }
            return Page();
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (ModelState.IsValid)
            {
                var (success, message, user) = await _userService.RegisterUserAsync(
                    Input.Email,
                    Input.Password,
                    Input.FullName);

                if (!success || user == null)
                {
                    ModelState.AddModelError(string.Empty, message);
                    return Page();
                }

                // Redirect to login page after successful registration
                TempData["SuccessMessage"] = "Registration successful. Please log in.";
                return RedirectToPage("./Login");
            }

            // If we got this far, something failed, redisplay form
            return Page();
        }
    }
}