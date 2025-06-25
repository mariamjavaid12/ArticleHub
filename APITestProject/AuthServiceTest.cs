using ArticleHub.Server.Data;
using ArticleHub.Server.Models;
using ArticleManagementSystem.Server.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using static ArticleManagementSystem.Server.DTOs.DTOs;

namespace APITestProject
{      
    public class AuthServiceTests
    {

        private AppDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) // ensures isolation
                .Options;

            return new AppDbContext(options);
        }

        private IConfiguration GetFakeJwtConfig()
        {
            var config = new Dictionary<string, string>
            {
                { "Jwt:Key", "ThisIsASecretKeyForJwt1234567890" },
                { "Jwt:Issuer", "TestIssuer" },
                { "Jwt:Audience", "TestAudience" }
            };

            return new ConfigurationBuilder()
                    .AddInMemoryCollection(config)
                    .Build();
        }

        [Fact]
        public async Task LoginAsync_WithCorrectCredentials_ReturnsToken()
        {
            // Arrange
            var dbContext = GetInMemoryDbContext(); // new clean DB
            var hasher = new PasswordHasher<User>();

            var user = new User
            {
                Username = "testuser",
                Role = "Author"
            };
            user.PasswordHash = hasher.HashPassword(user, "Test@123");

            dbContext.Users.Add(user);
            await dbContext.SaveChangesAsync();

            var config = GetFakeJwtConfig();
            var jwtService = new JwtService(config);
            var authService = new AuthService(dbContext, jwtService, hasher);

            var dto = new LoginDto
            {
                Username = "testuser",
                Password = "Test@123"
            };

            // Act
            var result = await authService.LoginAsync(dto);

            // Assert
            Assert.NotNull(result);
            Assert.False(string.IsNullOrEmpty(result.Token));
            Assert.Equal("testuser", result.Username);
        }


        [Fact]
        public async Task LoginAsync_WithWrongPassword_ThrowsUnauthorized()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var hasher = new PasswordHasher<User>();

            // Seed user with correct password
            var user = new User
            {
                Username = "testuser",
                Role = "Author"
            };
            user.PasswordHash = hasher.HashPassword(user, "CorrectPassword");
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var config = GetFakeJwtConfig();
            var jwtService = new JwtService(config);
            var authService = new AuthService(context, jwtService, hasher);

            var loginDto = new LoginDto
            {
                Username = "testuser",
                Password = "WrongPassword" // wrong password
            };

            // Act + Assert
            var ex = await Assert.ThrowsAsync<UnauthorizedAccessException>(() => authService.LoginAsync(loginDto));
            Assert.Equal("Incorrect password", ex.Message); // Now this should pass
        }

        [Fact]
        public async Task LoginAsync_WithInvalidUsername_ThrowsUnauthorized()
        {
            var dbContext = GetInMemoryDbContext();
            var config = GetFakeJwtConfig();
            var jwtService = new JwtService(config);
            var hasher = new PasswordHasher<User>();
            var authService = new AuthService(dbContext, jwtService, hasher);

            var dto = new LoginDto
            {
                Username = "nouser",
                Password = "Test@123"
            };

            await Assert.ThrowsAsync<UnauthorizedAccessException>(() => authService.LoginAsync(dto));
        }

        [Fact]
        public async Task RegisterAsync_WithNewUsername_ReturnsSuccessMessage()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var config = GetFakeJwtConfig();
            var jwtService = new JwtService(config);
            var hasher = new PasswordHasher<User>();
            var authService = new AuthService(context, jwtService, hasher);

            var registerDto = new RegisterDto
            {
                Username = "Author123",
                Password = "Test@123",
                Role = "Author"
            };

            // Act
            var result = await authService.RegisterAsync(registerDto);

            // Assert
            Assert.Equal("User registered successfully.", result);
            Assert.Single(context.Users);
            Assert.Equal("Author123", context.Users.First().Username);
        }

    }

}
