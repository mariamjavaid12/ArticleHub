
using ArticleHub.Server.Data;
using Microsoft.EntityFrameworkCore;
using static ArticleManagementSystem.Server.DTOs.DTOs;

namespace ArticleManagementSystem.Server.Services
{
    public class SubmissionService : ISubmissionService
    {
        private readonly AppDbContext _context;

        public SubmissionService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> SubmitArticleAsync(SubmitArticleDto dto)
        {
            var version = await _context.ArticleVersions.Include(v => v.Submission).FirstOrDefaultAsync(v =>
                v.ArticleId == dto.ArticleId && v.Language == dto.Language && v.VersionNumber == dto.VersionNumber);

            if (version == null) return false;

            version.Submission.Status = "Submitted";
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> ReviewSubmissionAsync(int id, ReviewSubmissionDto dto, int reviewerId)
        {
            var submission = await _context.Submissions.Include(s => s.ArticleVersion).FirstOrDefaultAsync(s => s.Id == id);
            if (submission == null) return false;

            submission.Status = dto.Status;
            submission.ReviewedAt = DateTime.UtcNow;
            submission.ReviewedById = reviewerId;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<object>> GetPendingSubmissionsAsync()
        {
            return await _context.Submissions.Include(s => s.ArticleVersion).ThenInclude(av => av.Article)
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

        public async Task<List<object>> GetMySubmissionsAsync(int userId)
        {
            return await _context.Submissions.Include(s => s.ArticleVersion).ThenInclude(v => v.Article)
                .Where(s => s.ArticleVersion.Article.AuthorId == userId)
                .Select(s => new
                {
                    s.Id,
                    s.Status,
                    s.ArticleVersion.Language,
                    s.ArticleVersion.VersionNumber,
                    s.ArticleVersion.Title
                }).ToListAsync<object>();
        }
    }
}
