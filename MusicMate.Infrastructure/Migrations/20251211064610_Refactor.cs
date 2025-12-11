using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MusicMate.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Refactor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Matches_Users_User1Id",
                table: "Matches");

            migrationBuilder.DropForeignKey(
                name: "FK_Matches_Users_User2Id",
                table: "Matches");

            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Users_ReceiverId",
                table: "Messages");

            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Users_SenderId",
                table: "Messages");

            migrationBuilder.DropForeignKey(
                name: "FK_UserFavoriteGenres_MusicGenres_GenreId",
                table: "UserFavoriteGenres");

            migrationBuilder.DropForeignKey(
                name: "FK_UserFavoriteGenres_Users_UserId",
                table: "UserFavoriteGenres");

            migrationBuilder.RenameColumn(
                name: "Username",
                table: "Users",
                newName: "username");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Users",
                newName: "email");

            migrationBuilder.RenameColumn(
                name: "City",
                table: "Users",
                newName: "city");

            migrationBuilder.RenameColumn(
                name: "Bio",
                table: "Users",
                newName: "bio");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Users",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "UserAvatar",
                table: "Users",
                newName: "user_avatar");

            migrationBuilder.RenameColumn(
                name: "HashedPassword",
                table: "Users",
                newName: "hashed_password");

            migrationBuilder.RenameColumn(
                name: "DisplayName",
                table: "Users",
                newName: "display_name");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "Users",
                newName: "create_time");

            migrationBuilder.RenameIndex(
                name: "IX_Users_Username",
                table: "Users",
                newName: "IX_Users_username");

            migrationBuilder.RenameIndex(
                name: "IX_Users_Email",
                table: "Users",
                newName: "IX_Users_email");

            migrationBuilder.RenameColumn(
                name: "GenreId",
                table: "UserFavoriteGenres",
                newName: "genre_id");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "UserFavoriteGenres",
                newName: "user_id");

            migrationBuilder.RenameIndex(
                name: "IX_UserFavoriteGenres_GenreId",
                table: "UserFavoriteGenres",
                newName: "IX_UserFavoriteGenres_genre_id");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "MusicGenres",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "MusicGenres",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "Content",
                table: "Messages",
                newName: "content");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Messages",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "SenderId",
                table: "Messages",
                newName: "sender_id");

            migrationBuilder.RenameColumn(
                name: "ReceiverId",
                table: "Messages",
                newName: "receiver_id");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "Messages",
                newName: "create_time");

            migrationBuilder.RenameIndex(
                name: "IX_Messages_SenderId",
                table: "Messages",
                newName: "IX_Messages_sender_id");

            migrationBuilder.RenameIndex(
                name: "IX_Messages_ReceiverId",
                table: "Messages",
                newName: "IX_Messages_receiver_id");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Matches",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "User2Id",
                table: "Matches",
                newName: "second_user_id");

            migrationBuilder.RenameColumn(
                name: "User1Id",
                table: "Matches",
                newName: "first_user_id");

            migrationBuilder.RenameColumn(
                name: "MatchedAt",
                table: "Matches",
                newName: "matched_time");

            migrationBuilder.RenameIndex(
                name: "IX_Matches_User2Id",
                table: "Matches",
                newName: "IX_Matches_second_user_id");

            migrationBuilder.RenameIndex(
                name: "IX_Matches_User1Id",
                table: "Matches",
                newName: "IX_Matches_first_user_id");

            migrationBuilder.AddForeignKey(
                name: "FK_Matches_Users_first_user_id",
                table: "Matches",
                column: "first_user_id",
                principalTable: "Users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Matches_Users_second_user_id",
                table: "Matches",
                column: "second_user_id",
                principalTable: "Users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Users_receiver_id",
                table: "Messages",
                column: "receiver_id",
                principalTable: "Users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Users_sender_id",
                table: "Messages",
                column: "sender_id",
                principalTable: "Users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_UserFavoriteGenres_MusicGenres_genre_id",
                table: "UserFavoriteGenres",
                column: "genre_id",
                principalTable: "MusicGenres",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserFavoriteGenres_Users_user_id",
                table: "UserFavoriteGenres",
                column: "user_id",
                principalTable: "Users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Matches_Users_first_user_id",
                table: "Matches");

            migrationBuilder.DropForeignKey(
                name: "FK_Matches_Users_second_user_id",
                table: "Matches");

            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Users_receiver_id",
                table: "Messages");

            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Users_sender_id",
                table: "Messages");

            migrationBuilder.DropForeignKey(
                name: "FK_UserFavoriteGenres_MusicGenres_genre_id",
                table: "UserFavoriteGenres");

            migrationBuilder.DropForeignKey(
                name: "FK_UserFavoriteGenres_Users_user_id",
                table: "UserFavoriteGenres");

            migrationBuilder.RenameColumn(
                name: "username",
                table: "Users",
                newName: "Username");

            migrationBuilder.RenameColumn(
                name: "email",
                table: "Users",
                newName: "Email");

            migrationBuilder.RenameColumn(
                name: "city",
                table: "Users",
                newName: "City");

            migrationBuilder.RenameColumn(
                name: "bio",
                table: "Users",
                newName: "Bio");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Users",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "user_avatar",
                table: "Users",
                newName: "UserAvatar");

            migrationBuilder.RenameColumn(
                name: "hashed_password",
                table: "Users",
                newName: "HashedPassword");

            migrationBuilder.RenameColumn(
                name: "display_name",
                table: "Users",
                newName: "DisplayName");

            migrationBuilder.RenameColumn(
                name: "create_time",
                table: "Users",
                newName: "CreatedAt");

            migrationBuilder.RenameIndex(
                name: "IX_Users_username",
                table: "Users",
                newName: "IX_Users_Username");

            migrationBuilder.RenameIndex(
                name: "IX_Users_email",
                table: "Users",
                newName: "IX_Users_Email");

            migrationBuilder.RenameColumn(
                name: "genre_id",
                table: "UserFavoriteGenres",
                newName: "GenreId");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "UserFavoriteGenres",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_UserFavoriteGenres_genre_id",
                table: "UserFavoriteGenres",
                newName: "IX_UserFavoriteGenres_GenreId");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "MusicGenres",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "MusicGenres",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "content",
                table: "Messages",
                newName: "Content");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Messages",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "sender_id",
                table: "Messages",
                newName: "SenderId");

            migrationBuilder.RenameColumn(
                name: "receiver_id",
                table: "Messages",
                newName: "ReceiverId");

            migrationBuilder.RenameColumn(
                name: "create_time",
                table: "Messages",
                newName: "CreatedAt");

            migrationBuilder.RenameIndex(
                name: "IX_Messages_sender_id",
                table: "Messages",
                newName: "IX_Messages_SenderId");

            migrationBuilder.RenameIndex(
                name: "IX_Messages_receiver_id",
                table: "Messages",
                newName: "IX_Messages_ReceiverId");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Matches",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "second_user_id",
                table: "Matches",
                newName: "User2Id");

            migrationBuilder.RenameColumn(
                name: "matched_time",
                table: "Matches",
                newName: "MatchedAt");

            migrationBuilder.RenameColumn(
                name: "first_user_id",
                table: "Matches",
                newName: "User1Id");

            migrationBuilder.RenameIndex(
                name: "IX_Matches_second_user_id",
                table: "Matches",
                newName: "IX_Matches_User2Id");

            migrationBuilder.RenameIndex(
                name: "IX_Matches_first_user_id",
                table: "Matches",
                newName: "IX_Matches_User1Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Matches_Users_User1Id",
                table: "Matches",
                column: "User1Id",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Matches_Users_User2Id",
                table: "Matches",
                column: "User2Id",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Users_ReceiverId",
                table: "Messages",
                column: "ReceiverId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Users_SenderId",
                table: "Messages",
                column: "SenderId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_UserFavoriteGenres_MusicGenres_GenreId",
                table: "UserFavoriteGenres",
                column: "GenreId",
                principalTable: "MusicGenres",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserFavoriteGenres_Users_UserId",
                table: "UserFavoriteGenres",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
