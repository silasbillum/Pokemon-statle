using Microsoft.AspNetCore.Mvc;
using statle.Api.Services;
using statle.Api.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Text.Json;

namespace statle.Api.Controller;


[ApiController]
[Route("api/[controller]")]
public class GameController : ControllerBase
{
    private readonly GameEngine _gameEngine;
  
    private readonly AppDbContext _dbContext;
   

    public GameController(GameEngine gameEngine, AppDbContext dbContext)
    {
        _gameEngine = gameEngine;
        _dbContext = dbContext;
    }

    [HttpPost("start")]
    public IActionResult StartGame()
    {
        var currentGame = _gameEngine.StartGame();
        var currentPokemon = _gameEngine.GetRandomPokemon();

        if (currentPokemon == null)
        {
            return NotFound("Could not find a Pokémon to start the game.");
        }

        HttpContext.Session.SetString("CurrentGame", JsonSerializer.Serialize(currentGame));
        HttpContext.Session.SetString("CurrentPokemon", JsonSerializer.Serialize(currentPokemon));
        
        return Ok(new { message = "New game started. A mystery Pokémon has been chosen.", gameId = currentGame.GameId, pokemonName = currentPokemon.Name });
    }

    [HttpPost("guess/{stat}")]
    public IActionResult GuessStat(string stat)
    {
        var currentGameJson = HttpContext.Session.GetString("CurrentGame");
        var currentPokemonJson = HttpContext.Session.GetString("CurrentPokemon");

        if (string.IsNullOrEmpty(currentGameJson) || string.IsNullOrEmpty(currentPokemonJson))
        {
            return BadRequest("Game has not been started. Please call /api/game/start first.");
        }

        var currentGame = JsonSerializer.Deserialize<GameEngine.Game>(currentGameJson);
        var currentPokemon = JsonSerializer.Deserialize<PokemonDetails>(currentPokemonJson);

        var (updatedGame, message) = _gameEngine.PickStat(currentGame, currentPokemon, stat);

        int gained = 0;
        switch (stat.ToLower())
        {
            case "hp":
                gained = currentPokemon.Stats.Hp;
                break;
            case "attack":
                gained = currentPokemon.Stats.Attack;
                break;
            case "defense":
                gained = currentPokemon.Stats.Defense;
                break;
            case "sp_atk":
                gained = currentPokemon.Stats.special_attack;
                break;
            case "sp_def":
                gained = currentPokemon.Stats.special_defense;
                break;
            case "speed":
                gained = currentPokemon.Stats.Speed;
                break;
        }

        var nextPokemon = _gameEngine.GetRandomPokemon();
        HttpContext.Session.SetString("CurrentGame", JsonSerializer.Serialize(updatedGame));
        HttpContext.Session.SetString("CurrentPokemon", JsonSerializer.Serialize(nextPokemon));

        return Ok(new { message, updatedGame.Score, pokemonName = nextPokemon.Name, gained, usedStats = updatedGame.UsedStats });
    }

    [HttpPost("Save")]
    [Authorize]
    public async Task<IActionResult> SaveGame()
    {
        var currentGameJson = HttpContext.Session.GetString("CurrentGame");
        if (string.IsNullOrEmpty(currentGameJson))
            return BadRequest();

        var currentGame = JsonSerializer.Deserialize<GameEngine.Game>(currentGameJson);

        foreach (var claim in User.Claims)
            Console.WriteLine($"CLAIM: {claim.Type} = {claim.Value}");

        var userIdClaim = User.Claims.FirstOrDefault(c =>
            c.Type == System.Security.Claims.ClaimTypes.NameIdentifier && Guid.TryParse(c.Value, out _));
        if (userIdClaim == null)
            return Unauthorized("User ID not found in token.");
        var userId = Guid.Parse(userIdClaim.Value);

        var game = new Game
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Score = _currentGame.Score,
            UsedStatsJson = System.Text.Json.JsonSerializer.Serialize(_currentGame.UsedStats)
        };

        _dbContext.Games.Add(game);
        await _dbContext.SaveChangesAsync();

        return Ok();
    }
}