public class Comment
{
    public int Id { get; set; }
    public required string Content { get; set; }
    public DateTime CreatedAt { get; set; }

    public int PostId { get; set; }
    public Post? Post { get; set; }

    public required string CommenterName { get; set; }
}