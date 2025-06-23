namespace ArticleManagementSystem.Server.Services
{
    public interface ILanguageService
    {
        Task<List<string>> GetLanguagesAsync();
        Task<string> AddLanguageAsync(string language);
    }
}
