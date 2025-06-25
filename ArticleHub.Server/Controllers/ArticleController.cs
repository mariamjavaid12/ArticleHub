using ArticleManagementSystem.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using static ArticleManagementSystem.Server.DTOs.DTOs;

namespace ArticleManagmentAPI.Controllers
{
    [ApiController]
    [Route("api/articles")]
    [Authorize]
    public class ArticlesController : ControllerBase
    {
        private readonly IArticleService _articleService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ArticlesController(IArticleService articleService, IHttpContextAccessor httpContextAccessor)
        {
            _articleService = articleService;
            _httpContextAccessor = httpContextAccessor;
        }

        //[HttpGet]
        //public async Task<IActionResult> GetAll()
        //{
        //    var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        //    var role = User.FindFirst(ClaimTypes.Role)?.Value;
        //    var articles = await _articleService.GetAllUserArticlesAsync(userId, role);
        //    return Ok(articles);
        //}
        [HttpGet("{articleId}/version/{versionNumber}")]
        [Authorize(Roles = "Editor,Author")]
        public async Task<IActionResult> GetArticleVersion(int articleId, int versionNumber)
        {
            var version = await _articleService.GetArticleVersionAsync(articleId, versionNumber);

            if (version == null)
                return NotFound("Article version not found");

            return Ok(version);
        }

        [HttpPost("{articleId}/versions/{versionNumber}/review/{decision}")]
        [Authorize(Roles = "Editor")]
        public async Task<IActionResult> ReviewVersion(int articleId, int versionNumber, string decision)
        {
            var reviewerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0"); // Or ClaimTypes.NameIdentifier if that's used

            if (decision != "approve" && decision != "reject")
                return BadRequest("Invalid decision");

            var result = await _articleService.ReviewVersionAsync(articleId, versionNumber, decision, reviewerId);

            if (!result)
                return NotFound("Article version not found or already reviewed");

            return Ok(new { message = $"Version {decision}d successfully." });
        }
        [HttpGet("versions/reviewed-by-me")]
        [Authorize(Roles = "Editor")]
        public async Task<IActionResult> GetReviewedByMe()
        {
            var reviewerIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(reviewerIdClaim))
                return Unauthorized("User ID not found in token.");

            if (!int.TryParse(reviewerIdClaim, out var reviewerId))
                return BadRequest("Invalid user ID.");

            var reviewed = await _articleService.GetReviewedByEditorAsync(reviewerId);
            return Ok(reviewed);
        }
        
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var result = await _articleService.GetArticleByIdAsync(id);
            return result == null ? NotFound() : Ok(result);
        }

        [Authorize(Roles = "Author")]
        [HttpPost]
        public async Task<IActionResult> Create(CreateArticleDto dto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var article = await _articleService.CreateArticleAsync(userId, dto);
              
                var latestVersion = article.Versions.LastOrDefault();

                var articleDto = new ArticlesDto
                {
                    Id = article.Id,
                    Title = latestVersion.Title,
                    Abstract = latestVersion.Abstract,
                    Body = latestVersion.Body,
                    Language = latestVersion.Language,
                    Status = ""
                };

                return CreatedAtAction(nameof(Get), new { id = article.Id }, articleDto);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest(ex.Message);
            }
        }
        
        [Authorize(Roles = "Author")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, CreateArticleDto dto)
        {
            var result = await _articleService.UpdateArticleAsync(id, dto);
            return result == null ? NotFound() : Ok(result);
        }

        [Authorize(Roles = "Author")]
        [HttpDelete("{articleId}")]
        public async Task<IActionResult> DeleteDraft(int articleId)
        {
            var result = await _articleService.DeleteDraftArticleAsync(articleId);
            return result ? Ok("Draft deleted") : BadRequest("Cannot delete non-draft article");
        }
        [Authorize(Roles = "Author")]
        [HttpDelete("{articleId}/version/{language}/{versionNumber}")]
        public async Task<IActionResult> DeleteVersion(int articleId, string language, int versionNumber)
        {
            var deleted = await _articleService.DeleteVersionAsync(articleId, language, versionNumber);

            if (!deleted)
                return BadRequest("Only draft versions can be deleted, or version not found.");

            return Ok("Draft version deleted.");
        }
        [Authorize(Roles = "Author")]
        [HttpPost("versions/{versionId}/submit")]
        public async Task<IActionResult> SubmitVersion(int versionId)
        {
            var success = await _articleService.SubmitVersionAsync(versionId);
            return success ? Ok(new { message = "Submitted successfully" }) : NotFound();
        }
        [HttpGet]
        [Authorize(Roles = "Editor,Author")]
        public async Task<IActionResult> GetAllArticles()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var role = User.FindFirst(ClaimTypes.Role)?.Value ?? "";

            var articles = await _articleService.GetAllArticlesAsync(userId, role);
            return Ok(articles);
        }

        [HttpGet("versions/pending")]
        [Authorize(Roles = "Editor")]
        public async Task<IActionResult> GetPendingArticles()
        {
            var pending = await _articleService.GetPendingReviewsAsync();
            return Ok(pending);
        }

        [Authorize(Roles = "Author")]
        [HttpPost("{id}/versions")]
        public async Task<IActionResult> AddVersion(int id, CreateArticleDto dto)
        {
            var result = await _articleService.AddVersionAsync(id, dto);

            if (result != null)
            {
                return Ok(new ArticleVersionDto
                {
                    VersionId = result.Id,
                    Language = result.Language,
                    VersionNumber = result.VersionNumber,
                    Title = result.Title,
                    Abstract = result.Abstract,
                    Body = result.Body,
                    Status = result.Submission?.Status,
                    CreatedAt = result.CreatedAt
                });
            }
            else
            {
                return BadRequest("No changes detected. Article was not updated.");

            }
            
        }

        [HttpGet("{id}/versions")]
        public async Task<IActionResult> GetVersions(int id)
        {
            var versions = await _articleService.GetVersionsAsync(id);
            return Ok(versions);
        }

        [HttpGet("{id}/versions/{language}")]
        public async Task<IActionResult> GetLanguageVersions(int id, string language)
        {
            var versions = await _articleService.GetLanguageVersionsAsync(id, language);
            return Ok(versions);
        }

        [HttpGet("{id}/versions/{language}/{version}")]
        public async Task<IActionResult> GetSpecificVersion(int id, string language, int version)
        {
            var versionDto = await _articleService.GetSpecificVersionAsync(id, language, version);
            return versionDto == null ? NotFound() : Ok(versionDto);
        }
    }
}
