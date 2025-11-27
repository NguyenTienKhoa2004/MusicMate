using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MusicMate.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SpotifyGenreId",
                table: "MusicGenres");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SpotifyGenreId",
                table: "MusicGenres",
                type: "text",
                nullable: true);
        }
    }
}
