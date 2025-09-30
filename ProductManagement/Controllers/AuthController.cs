using Microsoft.AspNetCore.Mvc;
using ProductManagement.Models;

namespace ProductManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        // Fake login endpoint
        [HttpPost("login")]
        public ActionResult<User> Login([FromBody] User loginRequest)
        {
            // Hardcoded demo users
            if (loginRequest.Email == "capturer@test.com")
            {
                return new User
                {
                    Email = loginRequest.Email,
                    Role = "Capturer",
                    Token = "capturer-token"
                };
            }
            if (loginRequest.Email == "manager@test.com")
            {
                return new User
                {
                    Email = loginRequest.Email,
                    Role = "Manager",
                    Token = "manager-token"
                };
            }

            return Unauthorized("Invalid credentials");
        }
    }
}