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
            var isEditor = role.Equals("Editor", StringComparison.OrdinalIgnoreCase);

            return await _context.Articles
            .Include(a => a.Author)
            .Include(a => a.Versions)
                .ThenInclude(v => v.Submission)
            .Where(a => isEditor || a.AuthorId == userId)
            .Select(a => new ArticleDto
            {
                Id = a.Id,
                AuthorUsername = a.Author.Username,
                Versions = a.Versions
                    .Where(v => v.Submission != null)
                    .Select(v => new ArticleVersionDto
                    {
                        VersionNumber = v.VersionNumber,
                        Language = v.Language,
                        Title = v.Title,
                        Abstract = v.Abstract,
                        Body = v.Body,
                        CreatedAt = v.CreatedAt,
                        Status = v.Submission.Status
                    }).ToList()
            })
            .ToListAsync();
        }

        //public async Task<List<ArticleDto>> GetAllUserArticlesAsync(int userId, string role)
        //{
        //    return await _context.Articles
        //        .Include(a => a.Author)
        //        .Include(a => a.Versions)
        //        .Where(a => role == "Editor" || a.AuthorId == userId)
        //        .Select(a => new ArticleDto
        //        {
        //            Id = a.Id,
        //            AuthorUsername = a.Author.Username,
        //            Versions = a.Versions.Select(v => new ArticleVersionDto
        //            {
        //                VersionNumber = v.VersionNumber,
        //                Language = v.Language,
        //                Title = v.Title,
        //                Abstract = v.Abstract,
        //                Body = v.Body,
        //                CreatedAt = v.CreatedAt,
        //                Status = v.Submission.Status
        //            }).ToList()
        //        }).ToListAsync();
        //}

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
            try
            {
                _context.Articles.Add(article);
                await _context.SaveChangesAsync();
                return article;
            }
            catch (DbUpdateException ex)
            {
                var innerMessage = ex.InnerException?.Message;
                Console.WriteLine("DB Update Error: " + innerMessage);
                throw; // Optional: rethrow to see stack trace
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
                throw;
            }

            //_context.Articles.Add(article);
            //await _context.SaveChangesAsync();
            //return article;
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
            var latestVersion = await _context.ArticleVersions
                .Where(v => v.ArticleId == articleId && v.Language == dto.Language)
                .OrderByDescending(v => v.VersionNumber)
                .FirstOrDefaultAsync();

            if (latestVersion != null &&
                latestVersion.Title == dto.Title &&
                latestVersion.Abstract == dto.Abstract &&
                latestVersion.Body == dto.Body &&
                latestVersion.Language == dto.Language)
            {
                return null;
            }

            var newVersion = new ArticleVersion
            {
                ArticleId = articleId,
                VersionNumber = (latestVersion?.VersionNumber ?? 0) + 1,
                Title = dto.Title,
                Abstract = dto.Abstract,
                Body = dto.Body,
                Language = dto.Language,
                CreatedAt = DateTime.UtcNow,
                Submission = new Submissions
                {
                    Status = "Draft",
                    SubmittedAt = null
                }
            };

            _context.ArticleVersions.Add(newVersion);
            await _context.SaveChangesAsync();

            return new ArticleVersion
            {
                VersionNumber = newVersion.VersionNumber,
                Title = newVersion.Title,
                Abstract = newVersion.Abstract,
                Body = newVersion.Body,
                Language = newVersion.Language,
                CreatedAt = newVersion.CreatedAt,
                Submission = new Submissions { Status = newVersion.Submission.Status }
            };
        }
        public async Task<bool> DeleteVersionAsync(int articleId, string language, int versionNumber)
        {
            var version = await _context.ArticleVersions
                .Include(v => v.Submission)
                .FirstOrDefaultAsync(v =>
                    v.ArticleId == articleId &&
                    v.Language == language &&
                    v.VersionNumber == versionNumber);

            // Only allow deleting versions that exist AND are in Draft status
            if (version == null || version.Submission == null || version.Submission.Status != "Draft")
                return false;

            // Remove dependent submission first if cascade delete is not configured
            _context.Submissions.Remove(version.Submission);
            _context.ArticleVersions.Remove(version);

            await _context.SaveChangesAsync();
            return true;
        }

        //public async Task<ArticleVersion?> AddVersionAsync(int articleId, CreateArticleDto dto)
        //{
        //    var article = await _context.Articles.Include(a => a.Versions).FirstOrDefaultAsync(a => a.Id == articleId);
        //    if (article == null) return null;

        //    var newVersion = new ArticleVersion
        //    {
        //        ArticleId = articleId,
        //        Language = dto.Language,
        //        Title = dto.Title,
        //        Abstract = dto.Abstract,
        //        Body = dto.Body,
        //        VersionNumber = article.Versions.Count + 1,
        //        CreatedAt = DateTime.UtcNow,
        //        Submission = new Submissions { Status = "Draft" }
        //    };

        //    _context.ArticleVersions.Add(newVersion);
        //    await _context.SaveChangesAsync();
        //    return newVersion;
        //}
        public async Task<List<PendingReviewDto>> GetPendingReviewsAsync()
        {
            return await _context.ArticleVersions
                .Where(v => v.Submission != null && v.Submission.Status == "Submitted")
                .Include(v => v.Article)
                    .ThenInclude(a => a.Author)
                .Select(v => new PendingReviewDto
                {
                    ArticleId = v.ArticleId,
                    VersionId = v.Id,
                    VersionNumber = v.VersionNumber,
                    Title = v.Title,
                    Language = v.Language,
                    AuthorUsername = v.Article.Author.Username,
                    CreatedAt = v.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<bool> DeleteDraftArticleAsync(int articleId)
        {
            var article = await _context.Articles
                .Include(a => a.Versions)
                .ThenInclude(v => v.Submission)
                .FirstOrDefaultAsync(a => a.Id == articleId);

            if (article == null) return false;

            // Ensure all versions are drafts
            bool allDraft = article.Versions.All(v => v.Submission?.Status == "Draft");

            if (!allDraft) return false;

            _context.Articles.Remove(article);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<ArticleVersionDto> GetArticleVersionAsync(int articleId, int versionNumber)
        {
            var version = await _context.ArticleVersions
                .Include(v => v.Article)
                    .ThenInclude(a => a.Author)
                .FirstOrDefaultAsync(v => v.ArticleId == articleId && v.VersionNumber == versionNumber);

            if (version == null)
                return null;

            return new ArticleVersionDto
            {
                ArticleId = version.ArticleId,
                VersionId = version.Id,
                VersionNumber = version.VersionNumber,
                Title = version.Title,
                Abstract = version.Abstract,
                Body = version.Body,
                Language = version.Language,
                CreatedAt = version.CreatedAt,
                AuthorUsername = version.Article.Author.Username
            };
        }

        public async Task<bool> ReviewVersionAsync(int articleId, int versionNumber, string action, int reviewerId)
        {
            var version = await _context.ArticleVersions
                .Include(v => v.Submission)
                .FirstOrDefaultAsync(v =>
                    v.ArticleId == articleId &&
                    v.VersionNumber == versionNumber &&
                    v.Submission != null &&
                    v.Submission.Status == "Submitted");

            if (version == null)
                return false;

            version.Submission.Status = action == "approve" ? "Approved" : "Rejected";
            version.Submission.ReviewedById = reviewerId;
            version.Submission.ReviewedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<List<ReviewedArticleVersionDto>> GetReviewedByEditorAsync(int reviewerId)
        {
            var versions = await _context.ArticleVersions
                .Include(v => v.Submission)
                .Include(v => v.Article)
                .ThenInclude(a => a.Author)
                .Where(v => v.Submission != null && v.Submission.ReviewedById == reviewerId)
                .Select(v => new ReviewedArticleVersionDto
                {
                    VersionId = v.Id,
                    ArticleId = v.ArticleId,
                    Title = v.Title,
                    Language = v.Language,
                    VersionNumber = v.VersionNumber,
                    CreatedAt = v.CreatedAt,
                    Status = v.Submission.Status,
                    AuthorUsername = v.Article.Author.Username,
                    ReviewedAt = v.Submission.ReviewedAt
                })
                .ToListAsync();

            return versions;
        }


        public async Task<bool> SubmitVersionAsync(int versionNumber)
        {
            var version = await _context.ArticleVersions
                .Include(v => v.Submission)
                .FirstOrDefaultAsync(v => v.VersionNumber == versionNumber);

            if (version == null) return false;

            if (version.Submission == null)
            {
                version.Submission = new Submissions();
                _context.Submissions.Add(version.Submission); // ensure EF tracks it
            }

            version.Submission.Status = "Submitted";
            version.Submission.SubmittedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
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

    }
}

