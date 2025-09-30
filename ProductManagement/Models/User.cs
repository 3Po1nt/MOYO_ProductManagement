namespace ProductManagement.Models
{
    public class User
    {
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = "Capturer";
        public string Token { get; set; } = string.Empty;
    }
}