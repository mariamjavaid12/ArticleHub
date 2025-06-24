using ArticleHub.Server.Data;
using ArticleHub.Server.Models;
using ArticleManagementSystem.Server.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpContextAccessor();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add JWT and password hashing services
builder.Services.AddSingleton<JwtService>();
builder.Services.AddScoped<PasswordHasher<User>>();
builder.Services.AddScoped<IArticleService, ArticleService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ISubmissionService, SubmissionService>();
builder.Services.AddScoped<ILanguageService, LanguageService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins("https://localhost:64667") 
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});
// Add authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "my_super_secret_key_here_123!";
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Issuer"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
            NameClaimType = ClaimTypes.Name,
            RoleClaimType = ClaimTypes.Role
        };
    });
builder.Services.AddAuthorization();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

//app.UseHttpsRedirection();

app.UseRouting();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.Use(async (context, next) =>
{
    var user = context.User;

    if (!user.Identity.IsAuthenticated)
    {
        Console.WriteLine($"[AUTH] Unauthenticated request to {context.Request.Path}");
    }
    else
    {
        var username = user.Identity.Name;
        var roles = string.Join(",", user.Claims
            .Where(c => c.Type == ClaimTypes.Role || c.Type == "role")
            .Select(c => c.Value));

        Console.WriteLine($"[AUTH] Authenticated user: {username}, Roles: {roles}, Path: {context.Request.Path}");

        // Optional: log all claims
        foreach (var claim in user.Claims)
        {
            Console.WriteLine($"[CLAIM] {claim.Type} => {claim.Value}");
        }

        if (!user.IsInRole("Author") && context.Request.Path.StartsWithSegments("/api/articles"))
        {
            Console.WriteLine($"[AUTH] User does not have required role for this endpoint.");
        }
    }

    await next();
});
app.UseAuthorization();

app.MapControllers();

app.Run();

