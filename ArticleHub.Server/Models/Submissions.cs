namespace ArticleHub.Server.Models
{
    public class Submissions
    {
        public int Id { get; set; }
        public int ArticleVersionId { get; set; }
        public ArticleVersion ArticleVersion { get; set; }
        public string Status { get; set; } // Draft, Submitted, Approved, Rejected
        public int? ReviewedById { get; set; }
        public User ReviewedBy { get; set; }
        public DateTime? ReviewedAt { get; set; }
    }
}
