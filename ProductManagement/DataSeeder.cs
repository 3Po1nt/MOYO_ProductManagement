using System.Text.Json;
using ProductManagement.Data;
using ProductManagement.Models;

public static class DataSeeder
{
    public static void SeedFromJson(AppDbContext context)
    {
        if (context.Products.Any()) return; // don’t reseed if already populated

        var json = File.ReadAllText("data_lake.json");
        var products = JsonSerializer.Deserialize<List<Product>>(json);

        if (products != null)
        {
            context.Products.AddRange(products);
            context.SaveChanges();
        }
    }
}