using static ArticleManagementSystem.Server.DTOs.DTOs;

namespace ArticleManagementSystem.Server.Services
{
    public interface ISubmissionService
    {
        Task<bool> SubmitArticleAsync(SubmitArticleDto dto);
        Task<bool> ReviewSubmissionAsync(int id, ReviewSubmissionDto dto, int reviewerId);
        Task<List<object>> GetPendingSubmissionsAsync();
        Task<List<object>> GetMySubmissionsAsync(int userId);
    }
}
