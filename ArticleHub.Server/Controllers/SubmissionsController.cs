using ArticleManagementSystem.Server.Services;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using static ArticleManagementSystem.Server.DTOs.DTOs;

namespace ArticleManagementSystem.Server.Controllers
{
    [ApiController]
    [Route("api/submissions")]
    [Authorize]
    public class SubmissionsController : ControllerBase
    {
        private readonly ISubmissionService _submissionService;

        public SubmissionsController(ISubmissionService submissionService)
        {
            _submissionService = submissionService;
        }

        [Authorize(Roles = "Author")]
        [HttpPost("submit")]
        public async Task<IActionResult> SubmitArticle(SubmitArticleDto dto)
        {
            var success = await _submissionService.SubmitArticleAsync(dto);
            return success ? Ok() : NotFound();
        }

        [Authorize(Roles = "Editor")]
        [HttpPut("{id}/status")]
        public async Task<IActionResult> ReviewSubmission(int id, ReviewSubmissionDto dto)
        {
            var reviewerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var success = await _submissionService.ReviewSubmissionAsync(id, dto, reviewerId);
            return success ? Ok() : NotFound();
        }

        [Authorize(Roles = "Editor")]
        [HttpGet("pending")]
        public async Task<IActionResult> GetPendingSubmissions()
        {
            var result = await _submissionService.GetPendingSubmissionsAsync();
            return Ok(result);
        }

        [Authorize(Roles = "Author")]
        [HttpGet("mine")]
        public async Task<IActionResult> GetMySubmissions()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var result = await _submissionService.GetMySubmissionsAsync(userId);
            return Ok(result);
        }
    }

}
