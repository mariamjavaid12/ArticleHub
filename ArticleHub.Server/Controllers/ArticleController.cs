using ArticleManagementSystem.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var articles = await _articleService.GetAllArticlesAsync(userId, role);
            return Ok(articles);
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
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var article = await _articleService.CreateArticleAsync(userId, dto);
            return CreatedAtAction(nameof(Get), new { id = article.Id }, article);
        }

        [Authorize(Roles = "Author")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, CreateArticleDto dto)
        {
            var result = await _articleService.UpdateArticleAsync(id, dto);
            return result == null ? NotFound() : Ok(result);
        }

        [Authorize(Roles = "Author")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _articleService.DeleteArticleAsync(id);
            return result ? NoContent() : NotFound();
        }

        [Authorize(Roles = "Author")]
        [HttpPost("{id}/versions")]
        public async Task<IActionResult> AddVersion(int id, CreateArticleDto dto)
        {
            var result = await _articleService.AddVersionAsync(id, dto);
            return result == null ? NotFound() : Ok(result);
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
