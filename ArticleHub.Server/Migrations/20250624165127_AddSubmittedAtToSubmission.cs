using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArticleHub.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddSubmittedAtToSubmission : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "SubmittedAt",
                table: "Submissions",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SubmittedAt",
                table: "Submissions");
        }
    }
}
