using ArticleHub.Server.Models;
using Microsoft.EntityFrameworkCore;


namespace ArticleHub.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Article> Articles { get; set; }
        public DbSet<ArticleVersion> ArticleVersions { get; set; }
        public DbSet<Submissions> Submissions { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ArticleVersion>()
                .HasOne(av => av.Article)
                .WithMany(a => a.Versions)
                .HasForeignKey(av => av.ArticleId);

            modelBuilder.Entity<Article>()
                .HasOne(a => a.Author)
            .WithMany(u => u.Articles)
                .HasForeignKey(a => a.AuthorId);

            modelBuilder.Entity<Submissions>()
            .HasOne(s => s.ArticleVersion)
                .WithOne(av => av.Submission)
                .HasForeignKey<Submissions>(s => s.ArticleVersionId);

            modelBuilder.Entity<Submissions>()
                .HasOne(s => s.ReviewedBy)
                .WithMany()
                .HasForeignKey(s => s.ReviewedById)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
