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
        public ProductController(AppDbContext context)
        {
            _context = context;
        }

        private string GetUserRoleFromToken(string token)
        {
            return token switch
            {
                "capturer-token" => "Capturer",
                "manager-token" => "Manager",
                _ => "Unknown"
            };
        }

        // GET /api/product
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products.ToListAsync();
        }

        // POST /api/product
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct(
            Product product,
            [FromHeader(Name = "Authorization")] string token)
        {
            var role = GetUserRoleFromToken(token);
            if (role != "Capturer")
                return Unauthorized("Only Capturer can create products.");

            product.Status = "PendingApproval";
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProducts), new { id = product.Id }, product);
        }

        // PUT /api/product/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(
            int id,
            Product product,
            [FromHeader(Name = "Authorization")] string token)
        {
            var role = GetUserRoleFromToken(token);
            if (role != "Capturer")
                return Unauthorized("Only Capturer can update products.");

            if (id != product.Id) return BadRequest();
            product.Status = "PendingApproval"; // updates must be approved again
            _context.Entry(product).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // POST /api/product/{id}/approve
        [HttpPost("{id}/approve")]
        public async Task<IActionResult> ApproveProduct(
            int id,
            [FromHeader(Name = "Authorization")] string token)
        {
            var role = GetUserRoleFromToken(token);
            if (role != "Manager")
                return Unauthorized("Only Manager can approve products.");

            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            product.Status = "Approved";
            await _context.SaveChangesAsync();

            // Export approved products to Data Lake (JSON file)
            var approvedProducts = await _context.Products
                .Where(p => p.Status == "Approved")
                .ToListAsync();

            var json = System.Text.Json.JsonSerializer.Serialize(approvedProducts,
                new System.Text.Json.JsonSerializerOptions { WriteIndented = true });

            await System.IO.File.WriteAllTextAsync("data_lake.json", json);
            
            return Ok(product);
        }

        // POST /api/product/{id}/reject
        [HttpPost("{id}/reject")]
        public async Task<IActionResult> RejectProduct(
            int id,
            [FromHeader(Name = "Authorization")] string token)
        {
            var role = GetUserRoleFromToken(token);
            if (role != "Manager")
                return Unauthorized("Only Manager can reject products.");

            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            product.Status = "Rejected";
            await _context.SaveChangesAsync();
            return Ok(product);
        }

        // DELETE /api/product/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(
            int id,
            [FromHeader(Name = "Authorization")] string token)
        {
            var role = GetUserRoleFromToken(token);
            if (role != "Manager")
                return Unauthorized("Only Manager can delete products.");

            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            product.Status = "SoftDeleted";
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}