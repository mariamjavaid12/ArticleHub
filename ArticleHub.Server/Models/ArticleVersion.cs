namespace ArticleHub.Server.Models
{
    public class ArticleVersion
    {
        public int Id { get; set; }
        public int ArticleId { get; set; }
        public  Article Article { get; set; }
        public  string Language { get; set; }
        public  string Title { get; set; }
        public  string Abstract { get; set; }
        public  string Body { get; set; }
        public int VersionNumber { get; set; }
        public DateTime CreatedAt { get; set; }
        public Submissions Submission { get; set; }
    }
}
