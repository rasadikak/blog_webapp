public class Post
{
    public int id {get; set;}
    public required string Title { get; set; }
    public required string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public int UserId { get; set; }
    public int CategoryId { get; set; }

}