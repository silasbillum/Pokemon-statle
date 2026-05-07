using Microsoft.AspNetCore.Mvc;
using statle.Api.Services;
using statle.Api.Models;
using bcrypt = BCrypt.Net.BCrypt;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace statle.Api.Controller;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public UserController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [Authorize]
    [HttpGet("profile")]
    public async Task<IActionResult> GetUserProfile()
    {
        var userIdClaim = User.Claims.FirstOrDefault(c =>
            c.Type == System.Security.Claims.ClaimTypes.NameIdentifier && Guid.TryParse(c.Value, out _));
        if (userIdClaim == null)
            return Unauthorized("User ID not found in token.");

        var userId = Guid.Parse(userIdClaim.Value);

        var userGames = await _dbContext.Games
            .Where(g => g.UserId == userId)
            .ToListAsync();

        if (userGames == null || !userGames.Any())
        {
            return Ok(new
            {
                highestScore = 0,
                totalGamesPlayed = 0,
                averageScore = 0.0
            });
        }

        var highestScore = userGames.Max(g => g.Score);
        var totalGamesPlayed = userGames.Count;
        var averageScore = userGames.Average(g => g.Score);

        return Ok(new
        {
            highestScore,
            totalGamesPlayed,
            averageScore
        });
    }
}