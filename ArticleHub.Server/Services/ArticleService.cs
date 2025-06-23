using ArticleHub.Server.Data;
using ArticleHub.Server.Models;
using Microsoft.EntityFrameworkCore;
using static ArticleManagementSystem.Server.DTOs.DTOs;

namespace ArticleManagementSystem.Server.Services
{
    public class ArticleService : IArticleService
    {
        private readonly AppDbContext _context;

        public ArticleService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ArticleDto>> GetAllArticlesAsync(int userId, string role)
        {
            return await _context.Articles
                .Include(a => a.Author)
                .Include(a => a.Versions)
                .Where(a => role == "Editor" || a.AuthorId == userId)
                .Select(a => new ArticleDto
                {
                    Id = a.Id,
                    AuthorUsername = a.Author.Username,
                    Versions = a.Versions.Select(v => new ArticleVersionDto
                    {
                        VersionNumber = v.VersionNumber,
                        Language = v.Language,
                        Title = v.Title,
                        Abstract = v.Abstract,
                        Body = v.Body,
                        CreatedAt = v.CreatedAt,
                        Status = v.Submission.Status
                    }).ToList()
                }).ToListAsync();
        }

        public async Task<ArticleDto?> GetArticleByIdAsync(int id)
        {
            var article = await _context.Articles.Include(a => a.Author).Include(a => a.Versions)
                .ThenInclude(v => v.Submission).FirstOrDefaultAsync(a => a.Id == id);

            if (article == null) return null;

            return new ArticleDto
            {
                Id = article.Id,
                AuthorUsername = article.Author.Username,
                Versions = article.Versions.Select(v => new ArticleVersionDto
                {
                    VersionNumber = v.VersionNumber,
                    Language = v.Language,
                    Title = v.Title,
                    Abstract = v.Abstract,
                    Body = v.Body,
                    CreatedAt = v.CreatedAt,
                    Status = v.Submission.Status
                }).ToList()
            };
        }

        public async Task<Article> CreateArticleAsync(int userId, CreateArticleDto dto)
        {
            var article = new Article
            {
                AuthorId = userId,
                Versions = new List<ArticleVersion>
            {
                new ArticleVersion
                {
                    Language = dto.Language,
                    Title = dto.Title,
                    Abstract = dto.Abstract,
                    Body = dto.Body,
                    VersionNumber = 1,
                    CreatedAt = DateTime.UtcNow,
                    Submission = new Submissions { Status = "Draft" }
                }
            }
            };

            _context.Articles.Add(article);
            await _context.SaveChangesAsync();
            return article;
        }

        public async Task<ArticleVersion?> UpdateArticleAsync(int articleId, CreateArticleDto dto)
        {
            var article = await _context.Articles.Include(a => a.Versions).FirstOrDefaultAsync(a => a.Id == articleId);
            if (article == null) return null;

            var newVersion = new ArticleVersion
            {
                ArticleId = articleId,
                Language = dto.Language,
                Title = dto.Title,
                Abstract = dto.Abstract,
                Body = dto.Body,
                VersionNumber = article.Versions.Count + 1,
                CreatedAt = DateTime.UtcNow,
                Submission = new Submissions { Status = "Draft" }
            };

            _context.ArticleVersions.Add(newVersion);
            await _context.SaveChangesAsync();
            return newVersion;
        }

        public async Task<bool> DeleteArticleAsync(int id)
        {
            var article = await _context.Articles.FindAsync(id);
            if (article == null) return false;
            _context.Articles.Remove(article);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<ArticleVersion?> AddVersionAsync(int articleId, CreateArticleDto dto)
        {
            var article = await _context.Articles.Include(a => a.Versions).FirstOrDefaultAsync(a => a.Id == articleId);
            if (article == null) return null;

            var newVersion = new ArticleVersion
            {
                ArticleId = articleId,
                Language = dto.Language,
                Title = dto.Title,
                Abstract = dto.Abstract,
                Body = dto.Body,
                VersionNumber = article.Versions.Count + 1,
                CreatedAt = DateTime.UtcNow,
                Submission = new Submissions { Status = "Draft" }
            };

            _context.ArticleVersions.Add(newVersion);
            await _context.SaveChangesAsync();
            return newVersion;
        }

        public async Task<List<ArticleVersionDto>> GetVersionsAsync(int articleId)
        {
            return await _context.ArticleVersions
                .Where(v => v.ArticleId == articleId)
                .Include(v => v.Submission)
                .Select(v => new ArticleVersionDto
                {
                    VersionNumber = v.VersionNumber,
                    Language = v.Language,
                    Title = v.Title,
                    Abstract = v.Abstract,
                    Body = v.Body,
                    CreatedAt = v.CreatedAt,
                    Status = v.Submission.Status
                }).ToListAsync();
        }

        public async Task<List<ArticleVersionDto>> GetLanguageVersionsAsync(int articleId, string language)
        {
            return await _context.ArticleVersions
                .Where(v => v.ArticleId == articleId && v.Language == language)
                .Include(v => v.Submission)
                .Select(v => new ArticleVersionDto
                {
                    VersionNumber = v.VersionNumber,
                    Language = v.Language,
                    Title = v.Title,
                    Abstract = v.Abstract,
                    Body = v.Body,
                    CreatedAt = v.CreatedAt,
                    Status = v.Submission.Status
                }).ToListAsync();
        }

        public async Task<ArticleVersionDto?> GetSpecificVersionAsync(int articleId, string language, int version)
        {
            var v = await _context.ArticleVersions.Include(av => av.Submission)
                .FirstOrDefaultAsync(av => av.ArticleId == articleId && av.Language == language && av.VersionNumber == version);

            if (v == null) return null;

            return new ArticleVersionDto
            {
                VersionNumber = v.VersionNumber,
                Language = v.Language,
                Title = v.Title,
                Abstract = v.Abstract,
                Body = v.Body,
                CreatedAt = v.CreatedAt,
                Status = v.Submission.Status
            };
        }

        Task<Article> IArticleService.CreateArticleAsync(int userId, CreateArticleDto dto)
        {
            throw new NotImplementedException();
        }

        Task<ArticleVersion?> IArticleService.UpdateArticleAsync(int articleId, CreateArticleDto dto)
        {
            throw new NotImplementedException();
        }

        Task<ArticleVersion?> IArticleService.AddVersionAsync(int articleId, CreateArticleDto dto)
        {
            throw new NotImplementedException();
        }
    }
}

