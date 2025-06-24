using ArticleHub.Server.Models;
using static ArticleManagementSystem.Server.DTOs.DTOs;

namespace ArticleManagementSystem.Server.Services
{
    public interface IArticleService
    {
        Task<List<ArticleDto>> GetAllArticlesAsync(int userId, string role);
        Task<ArticleDto?> GetArticleByIdAsync(int id);
        Task<Article> CreateArticleAsync(int userId, CreateArticleDto dto);
        Task<ArticleVersion?> UpdateArticleAsync(int articleId, CreateArticleDto dto);
        Task<ArticleVersion?> AddVersionAsync(int articleId, CreateArticleDto dto);
        Task<List<ArticleVersionDto>> GetVersionsAsync(int articleId);
        Task<List<ArticleVersionDto>> GetLanguageVersionsAsync(int articleId, string language);
        Task<ArticleVersionDto?> GetSpecificVersionAsync(int articleId, string language, int version);
        Task<bool> DeleteDraftArticleAsync(int articleId);
        Task<bool> SubmitVersionAsync(int versionId);
        Task<bool> DeleteVersionAsync(int articleId, string language, int versionNumber);

    }
}
