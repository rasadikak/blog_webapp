public class Comment
{
    public int id{get; set;}
    public required string content{get; set;}
    public DateTime createdAt{get; set;}
    public int PostId{get; set;}
    public required string CommenterName{get; set;}

}