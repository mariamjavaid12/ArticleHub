using ArticleHub.Server.Data;
using ArticleHub.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using static ArticleManagementSystem.Server.DTOs.DTOs;

namespace ArticleManagementSystem.Server.Services
{
    public class AuthService : IAuthService
    {
        
        private readonly AppDbContext _context;
        private readonly JwtService _jwtService;
        private readonly PasswordHasher<User> _hasher;

        public AuthService(AppDbContext context, JwtService jwtService, PasswordHasher<User> hasher)
        {
            _context = context;
            _jwtService = jwtService;
            _hasher = hasher;
        }

        public async Task<string?> RegisterAsync(RegisterDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Username == dto.Username))
                return null;

            var user = new User
            {
                Username = dto.Username,
                Role = dto.Role
            };
            user.PasswordHash = _hasher.HashPassword(user, dto.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return "User registered successfully.";
        }

        public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == dto.Username);
            if (user == null) return null;

            var result = _hasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
            if (result == PasswordVerificationResult.Failed) return null;

            var token = _jwtService.GenerateToken(user);

            var responsedto = new AuthResponseDto
            {
                Token = token,
                Username = user.Username,
                Role = user.Role
            };
            return responsedto;
        }

        public bool ValidateToken()
        {
            return true;
        }
    }
}
