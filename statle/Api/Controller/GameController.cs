using Microsoft.AspNetCore.Mvc;
using statle.Api.Services;
using statle.Api.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace statle.Api.Controller;


[ApiController]
[Route("api/[controller]")]
public class GameController : ControllerBase
{
    private readonly GameEngine _gameEngine;

    private static GameEngine.Game? _currentGame;
    private static PokemonDetails? _currentPokemon;

    private readonly AppDbContext _dbContext;


    public GameController(GameEngine gameEngine, AppDbContext dbContext)
    {
        _gameEngine = gameEngine;
        _dbContext = dbContext;
    }

    [HttpPost("start")]
    public IActionResult StartGame()
    {
        try
        {
            _currentGame = _gameEngine.StartGame();
            _currentPokemon = _gameEngine.GetRandomPokemon();

            if (_currentPokemon == null)
            {
                Console.WriteLine("DEBUG: _currentPokemon is null");
                return NotFound("Could not find a Pokémon to start the game.");
            }

            Console.WriteLine($"DEBUG: Game started with Pokémon: {_currentPokemon.Name}");
            return Ok(new { message = "New game started. A mystery Pokémon has been chosen.", gameId = _currentGame.GameId, pokemonName = _currentPokemon.Name });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"DEBUG: An error occurred in StartGame: {ex.Message}");
            Console.WriteLine($"DEBUG: StackTrace: {ex.StackTrace}");
            return StatusCode(500, "An internal server error occurred.");
        }
    }

    [HttpPost("guess/{stat}")]
    public IActionResult GuessStat(string stat)
    {
        if (_currentGame == null || _currentPokemon == null)
        {
            return BadRequest("Game has not been started. Please call /api/game/start first.");
        }

        var guessedPokemon = _currentPokemon;
        var (updatedGame, message) = _gameEngine.PickStat(_currentGame, guessedPokemon, stat);

        _currentGame = updatedGame;
        _currentGame.EncounteredPokemon.Add(guessedPokemon);

        int gained = 0;
        switch (stat.ToLower())
        {
            case "hp":
                gained = guessedPokemon.Stats.Hp;
                break;
            case "attack":
                gained = guessedPokemon.Stats.Attack;
                break;
            case "defense":
                gained = guessedPokemon.Stats.Defense;
                break;
            case "sp_atk":
                gained = guessedPokemon.Stats.special_attack;
                break;
            case "sp_def":
                gained = guessedPokemon.Stats.special_defense;
                break;
            case "speed":
                gained = guessedPokemon.Stats.Speed;
                break;
        }

        _currentPokemon = _gameEngine.GetRandomPokemon();

        return Ok(new
        {
            message,
            score = updatedGame.Score,
            pokemonName = _currentPokemon.Name,
            gained,
            usedStats = _currentGame.UsedStats,
            revealedPokemon = new
            {
                name = guessedPokemon.Name,
                stats = guessedPokemon.Stats
            }
        });
    }

    [HttpPost("Save")]
    [Authorize]
    public async Task<IActionResult> SaveGame()
    {
        if (_currentGame == null || !_currentGame.EncounteredPokemon.Any())
            return BadRequest("No active game or encountered Pokemon to save.");

        var userIdClaim = User.Claims.FirstOrDefault(c =>
            c.Type == System.Security.Claims.ClaimTypes.NameIdentifier && Guid.TryParse(c.Value, out _));
        if (userIdClaim == null)
            return Unauthorized("User ID not found in token.");
        var userId = Guid.Parse(userIdClaim.Value);

        // Save the game score
        var game = new Game
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Score = _currentGame.Score,
            UsedStatsJson = System.Text.Json.JsonSerializer.Serialize(_currentGame.UsedStats)
        };
        _dbContext.Games.Add(game);

        
        bool isWin = _currentGame.Score >= 600;

        foreach (var pokemon in _currentGame.EncounteredPokemon)
        {
            var pokedexEntry = await _dbContext.UserPokedexEntries
                .FirstOrDefaultAsync(p => p.UserId == userId && p.PokemonId == pokemon.Id);

            if (pokedexEntry == null)
            {
                _dbContext.UserPokedexEntries.Add(new UserPokedexEntry
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    PokemonId = pokemon.Id,
                    PokemonName = pokemon.Name,
                    Status = isWin ? PokedexStatus.Caught : PokedexStatus.Seen
                });
            }
            else if (isWin && pokedexEntry.Status != PokedexStatus.Caught)
            {
                pokedexEntry.Status = PokedexStatus.Caught;
            }
        }

        await _dbContext.SaveChangesAsync();

        return Ok();
    }

    [Authorize]
    [HttpGet("/api/pokedex")]
    public async Task<IActionResult> GetPokedex()
    {
        var userIdClaim = User.Claims.FirstOrDefault(c =>
            c.Type == System.Security.Claims.ClaimTypes.NameIdentifier && Guid.TryParse(c.Value, out _));
        if (userIdClaim == null)
            return Unauthorized("User ID not found in token.");

        var userId = Guid.Parse(userIdClaim.Value);

        var pokedexEntries = await _dbContext.UserPokedexEntries
            .Where(p => p.UserId == userId)
            .Select(p => new
            {
                p.PokemonId,
                p.PokemonName,
                Status = p.Status == PokedexStatus.Caught ? "caught" : "seen"
            })
            .ToListAsync();

        return Ok(pokedexEntries);
    }
}