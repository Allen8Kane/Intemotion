﻿using Microsoft.EntityFrameworkCore.Migrations;

namespace Intemotion.Migrations
{
    public partial class ChatMessage_DeleteBehavior2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatMessages_ConnectedUsers_ConnectedUserId",
                table: "ChatMessages");

            migrationBuilder.AddForeignKey(
                name: "FK_ChatMessages_ConnectedUsers_ConnectedUserId",
                table: "ChatMessages",
                column: "ConnectedUserId",
                principalTable: "ConnectedUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatMessages_ConnectedUsers_ConnectedUserId",
                table: "ChatMessages");

            migrationBuilder.AddForeignKey(
                name: "FK_ChatMessages_ConnectedUsers_ConnectedUserId",
                table: "ChatMessages",
                column: "ConnectedUserId",
                principalTable: "ConnectedUsers",
                principalColumn: "Id");
        }
    }
}
