
using ArticleHub.Server.Data;
using Microsoft.EntityFrameworkCore;

namespace ArticleManagementSystem.Server.Services
{
    public class LanguageService : ILanguageService
    {
        private readonly AppDbContext _context;

        public LanguageService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<string>> GetLanguagesAsync()
        {
            return await _context.ArticleVersions.Select(v => v.Language).Distinct().ToListAsync();
        }

        public Task<string> AddLanguageAsync(string language)
        {
            // Simulate adding language (no DB change in current logic)
            return Task.FromResult($"Language '{language}' registered (virtual).");
        }
    }
}
