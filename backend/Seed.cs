public static class DbSeeder
{
    public static void Seed(AppDbContext context)
    {
        // Only seed if the Categories table is empty, to avoid duplicating data every time the app restarts
        if (!context.Categories.Any())
        {
            context.Categories.AddRange(
                new Category { Name = "Tech" },
                new Category { Name = "Travel" },
                new Category { Name = "Food" }
            );
            context.SaveChanges();
        }

        if (!context.Posts.Any())
        {
            var techCategory = context.Categories.First(c => c.Name == "Tech");
            var travelCategory = context.Categories.First(c => c.Name == "Travel");
            var foodCategory = context.Categories.First(c => c.Name == "Food");

            context.Posts.AddRange(
                new Post
                {
                    Title = "My First Blog Post",
                    Content = "This is some sample content for testing.",
                    CreatedAt = DateTime.Now,
                    UserId = 1,
                    CategoryId = techCategory.Id
                },
                new Post
                {
                    Title = "A Trip to the Mountains",
                    Content = "Sharing my travel experience here.",
                    CreatedAt = DateTime.Now,
                    UserId = 1,
                    CategoryId = travelCategory.Id
                },
                new Post
                {
                    Title = "Best Pasta Recipe",
                    Content = "Here's how I make my favorite pasta dish.",
                    CreatedAt = DateTime.Now,
                    UserId = 1,
                    CategoryId = foodCategory.Id
                }
            );
            context.SaveChanges();
        }

        if (!context.Comments.Any())
        {
            var firstPost = context.Posts.First();

            context.Comments.AddRange(
                new Comment
                {
                    Content = "Great post, thanks for sharing!",
                    CreatedAt = DateTime.Now,
                    PostId = firstPost.id,
                    CommenterName = "Alex"
                },
                new Comment
                {
                    Content = "Really enjoyed reading this.",
                    CreatedAt = DateTime.Now,
                    PostId = firstPost.id,
                    CommenterName = "Sam"
                }
            );
            context.SaveChanges();
        }
    }
}