using Xunit;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ArticleHub.Server.Data;
using ArticleHub.Server.Models;
using ArticleManagementSystem.Server.Services;
using static ArticleManagementSystem.Server.DTOs.DTOs;
using System.Collections.Generic;
using System.Linq;
using System;
using Microsoft.AspNetCore.Identity;

namespace APITestProject
{
    public class ArticleServiceTests
    {
        private AppDbContext GetDbContext(string dbName)
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: dbName)
                .Options;

            var context = new AppDbContext(options);

            // Hash the password
            var hasher = new PasswordHasher<User>();
            var user = new User
            {
                Id = 1,
                Username = "author1",
                Role = "Author"
            };
            user.PasswordHash = hasher.HashPassword(user, "Test@123");

            context.Users.Add(user);
            context.SaveChanges();

            return context;
        }
        [Fact]
        public async Task CreateArticleAsync_CreatesAndReturnsArticle()
        {
            var context = GetDbContext("CreateArticleDb");
            var service = new ArticleService(context);

            var dto = new CreateArticleDto
            {
                Language = "en",
                Title = "Title1",
                Abstract = "Abstract1",
                Body = "Body1"
            };

            var article = await service.CreateArticleAsync(1, dto);

            Assert.NotNull(article);
            Assert.Equal("Title1", article.Versions.First().Title);
        }

        [Fact]
        public async Task GetArticleByIdAsync_ReturnsArticleDto()
        {
            var context = GetDbContext("GetArticleByIdDb");
            var service = new ArticleService(context);

            var dto = new CreateArticleDto
            {
                Language = "en",
                Title = "Test Title",
                Abstract = "Test Abstract",
                Body = "Test Body"
            };

            var created = await service.CreateArticleAsync(1, dto);
            var result = await service.GetArticleByIdAsync(created.Id);

            Assert.NotNull(result);
            Assert.Equal("Test Title", result.Versions[0].Title);
        }

        [Fact]
        public async Task GetAllArticlesAsync_AsAuthor_ReturnsOnlyOwnArticles()
        {
            var context = GetDbContext("GetAllArticlesDb");
            var service = new ArticleService(context);

            var dto = new CreateArticleDto
            {
                Language = "en",
                Title = "My Article",
                Abstract = "Abstract",
                Body = "Body"
            };

            await service.CreateArticleAsync(1, dto);

            var result = await service.GetAllArticlesAsync(1, "Author");

            Assert.Single(result);
            Assert.Equal("author1", result[0].AuthorUsername);
        }

        [Fact]
        public async Task DeleteArticleAsync_RemovesArticle()
        {
            var context = GetDbContext("DeleteArticleDb");
            var service = new ArticleService(context);

            var dto = new CreateArticleDto
            {
                Language = "en",
                Title = "Delete Me",
                Abstract = "Abstract",
                Body = "Body"
            };

            var created = await service.CreateArticleAsync(1, dto);
            var deleted = await service.DeleteArticleAsync(created.Id);

            Assert.True(deleted);
            Assert.Empty(context.Articles.ToList());
        }

        [Fact]
        public async Task AddVersionAsync_AddsNewVersion()
        {
            var context = GetDbContext("AddVersionDb");
            var service = new ArticleService(context);

            var dto = new CreateArticleDto
            {
                Language = "en",
                Title = "Original",
                Abstract = "Original",
                Body = "Original"
            };

            var article = await service.CreateArticleAsync(1, dto);

            var versionDto = new CreateArticleDto
            {
                Language = "en",
                Title = "Updated Title",
                Abstract = "Updated",
                Body = "Updated"
            };

            var version = await service.AddVersionAsync(article.Id, versionDto);

            Assert.NotNull(version);
            Assert.Equal(2, version.VersionNumber);
        }

        [Fact]
        public async Task DeleteVersionAsync_WithDraftStatus_DeletesVersion()
        {
            var context = GetDbContext("DeleteVersionDb");
            var service = new ArticleService(context);

            var dto = new CreateArticleDto
            {
                Language = "en",
                Title = "Draft Title",
                Abstract = "Abstract",
                Body = "Body"
            };

            var article = await service.CreateArticleAsync(1, dto);
            var deleted = await service.DeleteVersionAsync(article.Id, "en", 1);

            Assert.True(deleted);
        }

        [Fact]
        public async Task GetPendingReviewsAsync_ReturnsSubmittedVersions()
        {
            var context = GetDbContext(nameof(GetPendingReviewsAsync_ReturnsSubmittedVersions));
            context.ArticleVersions.Add(new ArticleVersion
            {
                Id = 1,
                Article = new Article { AuthorId = 1, Author = context.Users.First() },
                Submission = new Submissions { Status = "Submitted" },
                Title = "Test",
                Abstract = "Some abstract",
                Body = "Some body content",
                Language = "en",
                VersionNumber = 1,
                CreatedAt = DateTime.UtcNow
            });
            await context.SaveChangesAsync();

            var service = new ArticleService(context);
            var result = await service.GetPendingReviewsAsync();
            Assert.Single(result);
        }

        [Fact]
        public async Task DeleteDraftArticleAsync_DeletesOnlyDrafts()
        {
            var context = GetDbContext(nameof(DeleteDraftArticleAsync_DeletesOnlyDrafts));
            var article = new Article
            {
                AuthorId = 1,
                Versions = new List<ArticleVersion>
            {
                new ArticleVersion
                {
                    Language = "en",
                    Title = "A",
                    Abstract = "A",
                    Body = "A",
                    VersionNumber = 1,
                    CreatedAt = DateTime.UtcNow,
                    Submission = new Submissions { Status = "Draft" }
                }
            }
            };
            context.Articles.Add(article);
            await context.SaveChangesAsync();

            var service = new ArticleService(context);
            var result = await service.DeleteDraftArticleAsync(article.Id);
            Assert.True(result);
        }

        [Fact]
        public async Task GetArticleVersionAsync_ReturnsVersionDetails()
        {
            var context = GetDbContext(nameof(GetArticleVersionAsync_ReturnsVersionDetails));
            var article = new Article { Id = 1, AuthorId = 1, Author = context.Users.First() };
            context.Articles.Add(article);
            var version = new ArticleVersion
            {
                ArticleId = 1,
                VersionNumber = 1,
                Title = "Test",
                Language = "en",
                Body = "Body",
                Abstract = "Abs",
                CreatedAt = DateTime.UtcNow,
                Article = article
            };
            context.ArticleVersions.Add(version);
            await context.SaveChangesAsync();

            var service = new ArticleService(context);
            var dto = await service.GetArticleVersionAsync(1, 1);
            Assert.Equal("Test", dto.Title);
        }

        [Fact]
        public async Task ReviewVersionAsync_ApprovesVersion()
        {
            var context = GetDbContext(nameof(ReviewVersionAsync_ApprovesVersion));
            var version = new ArticleVersion
            {
                ArticleId = 1,
                VersionNumber = 1,
                Title = "Test Title",
                Abstract = "Test Abstract",
                Body = "Test Body",
                Language = "en",
                CreatedAt = DateTime.UtcNow,
                Submission = new Submissions { Status = "Submitted" }
            };
            context.ArticleVersions.Add(version);
            await context.SaveChangesAsync();

            var service = new ArticleService(context);
            var result = await service.ReviewVersionAsync(1, 1, "approve", 99);
            Assert.True(result);
            Assert.Equal("Approved", context.ArticleVersions.First().Submission.Status);
        }

        [Fact]
        public async Task GetReviewedByEditorAsync_ReturnsReviewedList()
        {
            var context = GetDbContext(nameof(GetReviewedByEditorAsync_ReturnsReviewedList));
            var version = new ArticleVersion
            {
                Id = 1,
                ArticleId = 1,
                Submission = new Submissions { Status = "Approved", ReviewedById = 77 },
                Title = "T",
                Abstract = "Test abstract",
                Body = "Test body",
                Language = "en",
                VersionNumber = 1,
                CreatedAt = DateTime.UtcNow,
                Article = new Article { Author = context.Users.First() }
            };
            context.ArticleVersions.Add(version);
            await context.SaveChangesAsync();

            var service = new ArticleService(context);
            var result = await service.GetReviewedByEditorAsync(77);
            Assert.Single(result);
        }

        [Fact]
        public async Task SubmitVersionAsync_ChangesStatusToSubmitted()
        {
            var context = GetDbContext(nameof(SubmitVersionAsync_ChangesStatusToSubmitted));
            context.ArticleVersions.Add(new ArticleVersion
            {
                VersionNumber = 1,
                Title = "Sample Title",
                Abstract = "Sample Abstract",
                Body = "Sample Body",
                Language = "en",
                CreatedAt = DateTime.UtcNow,
                Submission = new Submissions { Status = "Draft" }
            });
            await context.SaveChangesAsync();

            var service = new ArticleService(context);
            var result = await service.SubmitVersionAsync(1);
            Assert.True(result);
            Assert.Equal("Submitted", context.ArticleVersions.First().Submission.Status);
        }
    }


}
