namespace ArticleHub.Server.Models
{
    public class ArticleVersion
    {
        public int Id { get; set; }
        public int ArticleId { get; set; }
        public required Article Article { get; set; }
        public required string Language { get; set; }
        public required string Title { get; set; }
        public required string Abstract { get; set; }
        public required string Body { get; set; }
        public int VersionNumber { get; set; }
        public DateTime CreatedAt { get; set; }
        public Submissions Submission { get; set; }
    }
}
