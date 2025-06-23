namespace ArticleHub.Server.Models
{
    public class User
    {
        public int Id { get; set; }
        public required string Username { get; set; }
        public required string PasswordHash { get; set; }
        public required string Role { get; set; } // "Author" or "Editor"
        public ICollection<Article> Articles { get; set; }
    }
}
