public class User
{
    public int id{get; set;}
    public required string username{get; set;}
    
    public required string PasswordHash{get; set;}
    public DateTime createdAt{get; set;}

}