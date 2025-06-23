using ArticleManagementSystem.Server.Services;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArticleManagementSystem.Server.Controllers
{
    [ApiController]
    [Route("api/languages")]
    public class LanguagesController : ControllerBase
    {
        private readonly ILanguageService _languageService;

        public LanguagesController(ILanguageService languageService)
        {
            _languageService = languageService;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetLanguages()
        {
            var langs = await _languageService.GetLanguagesAsync();
            return Ok(langs);
        }

        [Authorize(Roles = "Editor")]
        [HttpPost]
        public async Task<IActionResult> AddLanguage([FromBody] DTOs.DTOs.AddLanguageDto dto)
        {
            var message = await _languageService.AddLanguageAsync(dto.Language);
            return Ok(new { Message = message });
        }
    }
}
