using Microsoft.AspNetCore.Mvc;
using statle.Api.Services;
using statle.Api.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using System.Collections.Concurrent;

namespace statle.Api.Controller;


[ApiController]
[Route("api/[controller]")]
public class GameController : ControllerBase
{
    private readonly GameEngine _gameEngine;
    private static readonly ConcurrentDictionary<string, PlayerGameState> _playerGames = new();

    private readonly AppDbContext _dbContext;

    private class PlayerGameState
    {
        public GameEngine.Game CurrentGame { get; set; } = new();
        public PokemonDetails? CurrentPokemon { get; set; }
    }


    public GameController(GameEngine gameEngine, AppDbContext dbContext)
    {
        _gameEngine = gameEngine;
        _dbContext = dbContext;
    }

    private string GetPlayerKey()
    {
        var playerId = Request.Headers["X-Player-Id"].FirstOrDefault();
        if (!string.IsNullOrWhiteSpace(playerId))
        {
            return playerId;
        }

        return HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown-player";
    }

    [HttpPost("start")]
    public IActionResult StartGame()
    {
        try
        {
            var playerKey = GetPlayerKey();
            var currentGame = _gameEngine.StartGame();
            var currentPokemon = _gameEngine.GetRandomPokemon();

            if (currentPokemon == null)
            {
                Console.WriteLine("DEBUG: _currentPokemon is null");
                return NotFound("Could not find a Pokémon to start the game.");
            }

            _playerGames[playerKey] = new PlayerGameState
            {
                CurrentGame = currentGame,
                CurrentPokemon = currentPokemon
            };

            Console.WriteLine($"DEBUG: Game started with Pokémon: {currentPokemon.Name} for player {playerKey}");
            return Ok(new { message = "New game started. A mystery Pokémon has been chosen.", gameId = currentGame.GameId, pokemonName = currentPokemon.Name });
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
        var playerKey = GetPlayerKey();
        if (!_playerGames.TryGetValue(playerKey, out var playerState) || playerState.CurrentPokemon == null)
        {
            return BadRequest("Game has not been started. Please call /api/game/start first.");
        }

        var guessedPokemon = playerState.CurrentPokemon;
        var (updatedGame, message) = _gameEngine.PickStat(playerState.CurrentGame, guessedPokemon, stat);

        playerState.CurrentGame = updatedGame;
        playerState.CurrentGame.EncounteredPokemon.Add(guessedPokemon);

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

        playerState.CurrentPokemon = _gameEngine.GetRandomPokemon();

        if (playerState.CurrentPokemon == null)
        {
            return NotFound("Could not load next Pokémon.");
        }

        return Ok(new
        {
            message,
            score = updatedGame.Score,
            pokemonName = playerState.CurrentPokemon.Name,
            gained,
            usedStats = playerState.CurrentGame.UsedStats,
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
        var playerKey = GetPlayerKey();
        if (!_playerGames.TryGetValue(playerKey, out var playerState) || !playerState.CurrentGame.EncounteredPokemon.Any())
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
            Score = playerState.CurrentGame.Score,
            UsedStatsJson = System.Text.Json.JsonSerializer.Serialize(playerState.CurrentGame.UsedStats),
            PokemonNamesJson = System.Text.Json.JsonSerializer.Serialize(playerState.CurrentGame.EncounteredPokemon.Select(p => p.Name).ToList())
        };
        _dbContext.Games.Add(game);

        
        bool isWin = playerState.CurrentGame.Score >= 600;

        foreach (var pokemon in playerState.CurrentGame.EncounteredPokemon)
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