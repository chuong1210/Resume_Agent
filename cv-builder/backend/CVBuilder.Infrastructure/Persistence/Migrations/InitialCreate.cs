using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CVBuilder.Infrastructure.Persistence.Migrations;

/// <summary>
/// Initial migration: Users, CVs, CVVersions, Templates tables.
/// Run with: dotnet ef migrations add InitialCreate --startup-project CVBuilder.API --project CVBuilder.Infrastructure
/// </summary>
public partial class InitialCreate : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // Users
        migrationBuilder.CreateTable(
            name: "Users",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                FullName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                PasswordHash = table.Column<string>(type: "text", nullable: false),
                RefreshToken = table.Column<string>(type: "text", nullable: true),
                RefreshTokenExpiry = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Users", x => x.Id);
            });

        migrationBuilder.CreateIndex(
            name: "IX_Users_Email",
            table: "Users",
            column: "Email",
            unique: true);

        // CVs
        migrationBuilder.CreateTable(
            name: "CVs",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                UserId = table.Column<Guid>(type: "uuid", nullable: false),
                Title = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                TemplateId = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                ContentJson = table.Column<string>(type: "jsonb", nullable: false, defaultValue: "{}"),
                CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_CVs", x => x.Id);
                table.ForeignKey(
                    name: "FK_CVs_Users_UserId",
                    column: x => x.UserId,
                    principalTable: "Users",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateIndex(
            name: "IX_CVs_UserId",
            table: "CVs",
            column: "UserId");

        // CVVersions
        migrationBuilder.CreateTable(
            name: "CVVersions",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                CVId = table.Column<Guid>(type: "uuid", nullable: false),
                ContentJson = table.Column<string>(type: "jsonb", nullable: false, defaultValue: "{}"),
                ChangeDescription = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_CVVersions", x => x.Id);
                table.ForeignKey(
                    name: "FK_CVVersions_CVs_CVId",
                    column: x => x.CVId,
                    principalTable: "CVs",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateIndex(
            name: "IX_CVVersions_CVId",
            table: "CVVersions",
            column: "CVId");

        // Templates
        migrationBuilder.CreateTable(
            name: "Templates",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                Name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                Description = table.Column<string>(type: "text", nullable: false),
                ThumbnailUrl = table.Column<string>(type: "text", nullable: false),
                DefaultContentJson = table.Column<string>(type: "jsonb", nullable: false, defaultValue: "{}"),
                IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Templates", x => x.Id);
            });
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "CVVersions");
        migrationBuilder.DropTable(name: "Templates");
        migrationBuilder.DropTable(name: "CVs");
        migrationBuilder.DropTable(name: "Users");
    }
}
