using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class CategoryController : ControllerBase
{
    private readonly AppDbContext _context;

    public CategoryController(AppDbContext context)
    {
        _context= context;
    }

    //get all categories
    [HttpGet]
    public async Task<IActionResult> GetCategories()
    {
        try
        {
            var categories= await _context.Categories.ToListAsync();
            return Ok(categories);
        }
        catch(Exception ex)
        {
            return StatusCode(500, $"Something went wrong while fetching categories -{ex}");
        }

    }


    //create category
    [HttpPost]
    public async Task<IActionResult> CreateCategory([FromBody] Category newCategory)
    {
        try
        {
            _context.Categories.Add(newCategory);
            await _context.SaveChangesAsync();
            return Ok(new { message = "category created successfully", category = newCategory });
        }
        catch(Exception ex)
        {
            return StatusCode(500, $"Something went wrong while creating category -{ex}");
        }
    }

}