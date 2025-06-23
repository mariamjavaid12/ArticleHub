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
        }

        public class ArticleDto
        {
            public int Id { get; set; }
            public string AuthorUsername { get; set; }
            public List<ArticleVersionDto> Versions { get; set; }
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
            public int VersionNumber { get; set; }
            public string Language { get; set; }
            public string Title { get; set; }
            public string Abstract { get; set; }
            public string Body { get; set; }
            public DateTime CreatedAt { get; set; }
            public string Status { get; set; }
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

        public class AddLanguageDto
        {
            public string Language { get; set; }
        }

    }
}
