public class Comment
{
    public int Id { get; set; }
    public required string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public int PostId { get; set; }
    public required string CommenterName { get; set; }
}