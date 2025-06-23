namespace ArticleHub.Server.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; } // "Author" or "Editor"
        public ICollection<Article> Articles { get; set; }
    }
}
