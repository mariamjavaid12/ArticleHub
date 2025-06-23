
using ArticleHub.Server.Data;
using Microsoft.EntityFrameworkCore;

namespace ArticleManagementSystem.Server.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly AppDbContext _context;

        public DashboardService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<object>> GetAuthorDashboardAsync(int userId)
        {
            return await _context.Articles.Where(a => a.AuthorId == userId)
                .Include(a => a.Versions).ThenInclude(v => v.Submission)
                .Select(a => new
                {
                    ArticleId = a.Id,
                    Versions = a.Versions.Select(v => new
                    {
                        v.Language,
                        v.VersionNumber,
                        v.Title,
                        Status = v.Submission.Status
                    })
                }).ToListAsync<object>();
        }

        public async Task<List<object>> GetEditorDashboardAsync()
        {
            return await _context.Submissions.Include(s => s.ArticleVersion)
                .Where(s => s.Status == "Submitted")
                .Select(s => new
                {
                    s.Id,
                    s.ArticleVersion.ArticleId,
                    s.ArticleVersion.Language,
                    s.ArticleVersion.VersionNumber,
                    s.ArticleVersion.Title
                }).ToListAsync<object>();
        }
    }
}
