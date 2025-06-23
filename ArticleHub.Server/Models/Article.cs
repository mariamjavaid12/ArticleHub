namespace ArticleHub.Server.Models
{
    public class Article
    {
        public int Id { get; set; }
        public int AuthorId { get; set; }
        public required User Author { get; set; }
        public required ICollection<ArticleVersion> Versions { get; set; }
    }
}
