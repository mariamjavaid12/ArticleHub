namespace ArticleManagementSystem.Server.Services
{
    public interface IDashboardService
    {
        Task<List<object>> GetAuthorDashboardAsync(int userId);
        Task<List<object>> GetEditorDashboardAsync();
    }
}
