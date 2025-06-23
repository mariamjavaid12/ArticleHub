namespace ArticleHub.Server.Models
{
    public class Article
    {
        public int Id { get; set; }
        public int AuthorId { get; set; }
        public User Author { get; set; }
        public ICollection<ArticleVersion> Versions { get; set; }
    }
}
