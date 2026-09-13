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



    //get all posts
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

    //get post by id
    [HttpGet("{id}")]
    public async Task<IActionResult> GetPostById(int id)
    {
        var post = await _context.Posts.FindAsync(id);

        if (post == null)
        {
            return NotFound();
        }

        return Ok(post);
    }

    //create posts
    [HttpPost]
    public async Task<IActionResult> CreatePosts([FromBody] Post newPost)
    {
        try
        {
            _context.Posts.Add(newPost);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Post created successfully", post = newPost });
        }
        catch(Exception ex)
        {
            return StatusCode(500, $"Something went wrong while creating posts -{ex}");
        }
    }

    //update post
    [HttpPut]
    public async Task<IActionResult> UpdatePost(int id)


}