using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class PostController : ControllerBase
{
    private readonly AppDbContext _context;

    public PostController(AppDbContext context)
    {
        _context= context;
    }



    //get posts
    [HttpGet]
    public async Task<IActionResult> GetPosts()
    {
        try
        {
            var posts= await _context.Posts.ToListAsync();
            return Ok(posts);
            
        }
        catch(Exception ex)
        {
            return StatusCode(500, $"Something went wrong while fetching posts -{ex}");
        }
    }

    //create posts
    
}