using static ArticleManagementSystem.Server.DTOs.DTOs;

namespace ArticleManagementSystem.Server.Services
{
    public interface IAuthService
    {
        Task<string?> RegisterAsync(RegisterDto dto);
        Task<AuthResponseDto?> LoginAsync(LoginDto dto);
        bool ValidateToken();
        
    }
}
