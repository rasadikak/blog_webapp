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
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePost(int id,  [FromBody] Post updatedPost)
    {
        try
        {
            var oldPost= await _context.Posts.FindAsync(id);
            if (oldPost == null)
            {
                return NotFound();
            }
            oldPost.Title= updatedPost.Title;
            oldPost.Content = updatedPost.Content;
            oldPost.CategoryId = updatedPost.CategoryId;

            await _context.SaveChangesAsync();

            return Ok(oldPost);

        }
        catch(Exception ex)
        {
            return StatusCode(500,$"Something went wrong while editing post -{ex}");
        }
    }

    //delete post
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePost(int id)
    {
        try
        {
            var post= await _context.Posts.FindAsync(id);
            if (post==null)
            {
                return NotFound();
            }
            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            return Ok (new{message="Post deleted successfully"});

        }
        catch(Exception ex)
        {
            return StatusCode(500,$"Something went wrong while deleting post -{ex}");
        }
    }

    //get posts by category
    [HttpGet("category/{categoryId}")]
    public async Task<IActionResult> GetPostsByCategory(int categoryId)
    {
        try
        {
            var posts= _context.Posts.Where(p=>p.CategoryId== categoryId).ToListAsync();
            return Ok(posts);
        }
        catch(Exception ex)
        {
            return StatusCode(500,$"Something went wrong while fetching posts by category - {ex}");
        }
    }

    //serach posts using title and keywords
    [HttpGet("search")]
    public async Task<IActionResult> SearchPosts(string query)
    {
        try
        {
            var posts = await _context.Posts
                .Where(p => p.Title.Contains(query) || p.Content.Contains(query))
                .ToListAsync();

            return Ok(posts);
        }
        catch(Exception ex)
        {
            return StatusCode(500,$"Something went wrong while serching posts  - {ex}");
        }
    }



}