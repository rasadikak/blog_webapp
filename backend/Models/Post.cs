public class Post
{
    public int id {get; set;}
    public required string Title { get; set; }
    public required string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public int UserId { get; set; }
    public User User{get; set;}= null!;
    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;

}