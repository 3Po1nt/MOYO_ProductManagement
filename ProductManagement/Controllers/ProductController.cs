using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductManagement.Data;
using ProductManagement.Models;

namespace ProductManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly DataLakeService _lake;

        public ProductController(AppDbContext context, DataLakeService lake)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _lake    = lake    ?? throw new ArgumentNullException(nameof(lake));
        }

        // --------------------------------------------------------
        // GET: /api/product
        // Accessible to any authenticated user
        // --------------------------------------------------------
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts(int id)
        {
            return await _context.Products.ToListAsync();
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();
            return product;
        }


        // --------------------------------------------------------
        // POST: /api/product
        // Capturer can create products
        // --------------------------------------------------------
        [Authorize(Policy = "capturer:basic")]
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct(Product product)
        {
            product.Status = "PendingApproval";
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            await _lake.SyncAsync();
            return CreatedAtAction(nameof(GetProducts), new { id = product.Id }, product);
        }

        // --------------------------------------------------------
        // PUT: /api/product/{id}
        // Capturer can update products
        // --------------------------------------------------------
        [Authorize(Policy = "capturer:basic")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, Product product)
        {
            if (id != product.Id) return BadRequest();

            product.Status = "PendingApproval"; // updates require re-approval
            _context.Entry(product).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            await _lake.SyncAsync();
            return NoContent();
        }

        // --------------------------------------------------------
        // POST: /api/product/{id}/approve
        // Manager can approve products
        // --------------------------------------------------------
        [Authorize(Policy = "manager:basic")]
        [HttpPost("{id}/approve")]
        public async Task<IActionResult> ApproveProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            product.Status = "Approved";
            await _context.SaveChangesAsync();
            await _lake.SyncAsync();
            // Export approved products to Data Lake JSON file
            var approvedProducts = await _context.Products
                                                 .Where(p => p.Status == "Approved")
                                                 .ToListAsync();

            var json = System.Text.Json.JsonSerializer.Serialize(
                approvedProducts,
                new System.Text.Json.JsonSerializerOptions { WriteIndented = true });

            await System.IO.File.WriteAllTextAsync("data_lake.json", json);

            return Ok(product);
        }

        // --------------------------------------------------------
        // POST: /api/product/{id}/reject
        // Manager can reject products
        // --------------------------------------------------------
        [Authorize(Policy = "manager:basic")]
        [HttpPost("{id}/reject")]
        public async Task<IActionResult> RejectProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            product.Status = "Rejected";
            await _context.SaveChangesAsync();
            await _lake.SyncAsync();
            return Ok(product);
        }

        // --------------------------------------------------------
        // DELETE: /api/product/{id}
        // Manager can soft-delete products
        // --------------------------------------------------------
        [Authorize(Policy = "manager:basic")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            product.Status = "SoftDeleted";
            await _context.SaveChangesAsync();
            await _lake.SyncAsync();
            return NoContent();
        }
    }
}