using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ProductManagement.Models;

namespace ProductManagement.Data
{
    public class DataLakeService
    {
        private readonly AppDbContext _context;
        private readonly string _lakePath;

        public DataLakeService(AppDbContext context)
        {
            _context = context;
            // Store data_lake.json in app root
            _lakePath = Path.Combine("data_lake.json");
        }

        /// <summary>
        /// Sync all products from DB to data_lake.json
        /// </summary>
        public async Task SyncAsync()
        {
            var allProducts = await _context.Products
                                            .AsNoTracking()
                                            .ToListAsync();

            var json = JsonSerializer.Serialize(allProducts,
                new JsonSerializerOptions { WriteIndented = true });

            await File.WriteAllTextAsync(_lakePath, json);
        }

        /// <summary>
        /// Seed database from data_lake.json if it exists and DB is empty
        /// </summary>
        public async Task SeedFromLakeAsync()
        {
            if (!File.Exists(_lakePath))
                return;

            if (await _context.Products.AnyAsync())
                return; // don’t seed if DB already has data

            var json = await File.ReadAllTextAsync(_lakePath);
            var products = JsonSerializer.Deserialize<List<Product>>(json) ?? new List<Product>();

            _context.Products.AddRange(products);
            await _context.SaveChangesAsync();
        }
    }
}