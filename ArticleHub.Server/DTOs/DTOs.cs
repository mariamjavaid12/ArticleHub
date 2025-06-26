using ArticleHub.Server.Models;

namespace ArticleManagementSystem.Server.DTOs
{
    public class DTOs
    {
        // DTOs
        public class RegisterDto
        {
            public string Username { get; set; }
            public string Password { get; set; }
            public string Role { get; set; } // "Author" or "Editor"
            public string LanguagePreference { get; set; } = "en";

        }
        public class LoginDto
        {
            public string Username { get; set; }
            public string Password { get; set; }
        }

        public class AuthResponseDto
        {
            public string Token { get; set; }
            public string Username { get; set; }
            public string Role { get; set; }
            public string LanguagePreference { get; set; } = "en";
        }

        public class ArticleDto
        {
            public int Id { get; set; }
            public string AuthorUsername { get; set; }
            public List<ArticleVersionDto> Versions { get; set; }
        }
        public class ArticlesDto
        {
            public int Id { get; set; }
            public string Title { get; set; }
            public string Abstract { get; set; }
            public string Body { get; set; }
            public string Language { get; set; }
            public string Status { get; set; }  // optional
        }

        public class PendingReviewDto
        {
            public int ArticleId { get; set; }
            public int VersionId { get; set; }
            public int VersionNumber { get; set; }
            public string Title { get; set; }
            public string Language { get; set; }
            public string AuthorUsername { get; set; }
            public DateTime CreatedAt { get; set; }
        }
        public class CreateArticleDto
        {
            public string Title { get; set; }
            public string Abstract { get; set; }
            public string Body { get; set; }
            public string Language { get; set; }
        }
        
        public class ArticleVersionDto
        {
            public int ArticleId { get; set; }
            public int VersionId { get; set; }
            public int VersionNumber { get; set; }
            public string Language { get; set; }
            public string Title { get; set; }
            public string Abstract { get; set; }
            public string Body { get; set; }
            public DateTime CreatedAt { get; set; }
            public string Status { get; set; }
            public string AuthorUsername { get; internal set; }
        }

        public class SubmitArticleDto
        {
            public int ArticleId { get; set; }
            public string Language { get; set; }
            public int VersionNumber { get; set; }
        }

        public class ReviewSubmissionDto
        {
            public int SubmissionId { get; set; }
            public string Status { get; set; } // Approved or Rejected
        }
        public class ReviewedArticleVersionDto
        {
            public int VersionId { get; set; }
            public int ArticleId { get; set; }
            public string Title { get; set; }
            public string Language { get; set; }
            public int VersionNumber { get; set; }
            public string Status { get; set; }
            public string AuthorUsername { get; set; }
            public DateTime CreatedAt { get; set; }
            public DateTime? ReviewedAt { get; set; }
        }
        public class AddLanguageDto
        {
            public string Language { get; set; }
        }
        public class VersionCreationResultDto
        {
            public bool IsCreated { get; set; }
        }
    }
}
