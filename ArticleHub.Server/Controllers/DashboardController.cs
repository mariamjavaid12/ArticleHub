using ArticleManagementSystem.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ArticleManagementSystem.Server.Controllers
{
    [ApiController]
    [Route("api/dashboard")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [Authorize(Roles = "Author")]
        [HttpGet("author")]
        public async Task<IActionResult> AuthorDashboard()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var data = await _dashboardService.GetAuthorDashboardAsync(userId);
            return Ok(data);
        }

        [Authorize(Roles = "Editor")]
        [HttpGet("editor")]
        public async Task<IActionResult> EditorDashboard()
        {
            var pending = await _dashboardService.GetEditorDashboardAsync();
            return Ok(pending);
        }
    }
}
