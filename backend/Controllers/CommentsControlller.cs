using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class CommentController : ControllerBase
{
    private readonly AppDbContext _context;

    public CommentController(AppDbContext context)
    {
        _context = context;
    }

    //get all comments for a specific post
    [HttpGet("post/{postId}")]
    public async Task<IActionResult> GetCommentsByPost(int postId)
    {
        try
        {
            var comments = await _context.Comments
                .Where(c => c.PostId == postId)
                .ToListAsync();

            return Ok(comments);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Something went wrong while fetching comments - {ex}");
        }
    }

    //add a new comment to a post
    [HttpPost]
    public async Task<IActionResult> CreateComment([FromBody] Comment newComment)
    {
        try
        {
            var post_id= newComment.PostId;
            var isPostExisting = await _context.Posts
                .AnyAsync(p => p.id == post_id);

            if (!isPostExisting)
            {
                return BadRequest(new { message = "post does not exists" });
            }
            _context.Comments.Add(newComment);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Comment added successfully", comment = newComment });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Something went wrong while adding comment - {ex}");
        }
    }
}