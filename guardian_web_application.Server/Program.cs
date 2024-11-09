using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using guardian_web_application.Server.Data;
using guardian_web_application.Server.Services;
using Microsoft.AspNetCore.Cors;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpsRedirection(options =>
{
    options.HttpsPort = 7024;
});

// Add services to the container
builder.Services.AddRazorPages();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
    });

// Configure CORS with additional headers
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowViteClient", policy =>
    {
        policy.WithOrigins(
                "https://localhost:5173",
                "http://localhost:5173",
                "https://localhost:7024",
                "http://localhost:5264"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .WithExposedHeaders("Location")
            .SetIsOriginAllowed(_ => true);
    });
});

// Add services
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IPacketService, PacketService>();
builder.Services.AddScoped<IAnalyticsService, AnalyticsService>();

// Configure Authentication
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Auth/Login";
        options.LogoutPath = "/Auth/Logout";
        options.AccessDeniedPath = "/Auth/Login";
        options.Cookie.Name = "GuardianAuth";
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = SameSiteMode.Lax;
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.ExpireTimeSpan = TimeSpan.FromHours(24);
        options.SlidingExpiration = true;
        options.Events = new CookieAuthenticationEvents
        {
            OnRedirectToLogin = context =>
            {
                if (context.Request.Path.StartsWithSegments("/api"))
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    return Task.CompletedTask;
                }
                context.Response.Redirect(context.RedirectUri);
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// Development specific configuration
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();

    // Add CORS middleware for development
    app.Use(async (context, next) =>
    {
        context.Response.Headers.Add("Access-Control-Allow-Origin", "https://localhost:5173");
        context.Response.Headers.Add("Access-Control-Allow-Credentials", "true");
        context.Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        context.Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization");

        if (context.Request.Method == "OPTIONS")
        {
            context.Response.StatusCode = 200;
            return;
        }

        await next();
    });
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseCors("AllowViteClient");

app.UseAuthentication();
app.UseAuthorization();

// Root redirect with proper async
app.MapGet("/", async (HttpContext context) =>
{
    await Task.Yield();
    if (context.User.Identity?.IsAuthenticated ?? false)
    {
        return Results.Redirect($"{app.Configuration["Spa:ClientUrl"]}/app");
    }
    return Results.Redirect("/Auth/Login");
});

// Configure API endpoints with CORS
app.MapControllers().RequireCors("AllowViteClient");
app.MapRazorPages();

// Health check endpoint
app.MapGet("/api/health", async () =>
{
    await Task.Yield();
    return Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow });
})
.RequireCors("AllowViteClient")
.AllowAnonymous();

// SPA routes handling
if (app.Environment.IsDevelopment())
{
    app.Use(async (context, next) =>
    {
        if (context.Request.Path.StartsWithSegments("/app"))
        {
            await Task.Yield();
            if (context.User.Identity?.IsAuthenticated ?? false)
            {
                var targetUrl = $"{app.Configuration["Spa:ClientUrl"]}{context.Request.Path}{context.Request.QueryString}";
                context.Response.Redirect(targetUrl);
                return;
            }
            context.Response.Redirect("/Auth/Login");
            return;
        }
        await next();
    });
}

await app.RunAsync(); // Use RunAsync instead of Run