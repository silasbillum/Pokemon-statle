namespace statle.Api.Models;

public enum PokedexStatus
{
    Seen,
    Caught
}

public class UserPokedexEntry
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public int PokemonId { get; set; }
    public string PokemonName { get; set; } = string.Empty;
    public PokedexStatus Status { get; set; }
    public User User { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}