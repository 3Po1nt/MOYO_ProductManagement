using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using ProductManagement.Data;


var builder = WebApplication.CreateBuilder(args);
builder.Services.AddScoped<DataLakeService>();
builder.WebHost.UseUrls("http://0.0.0.0:8080");

// ----------------------------
// 1. Entity Framework Core
// ----------------------------
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")
                      ?? "Data Source=products.db"));

// ----------------------------
// 2. Controllers
// ----------------------------
builder.Services.AddControllers();

// ----------------------------
// 3. CORS for React dev server
// ----------------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy.WithOrigins("http://localhost:3000")
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

// ----------------------------
// 4. Authentication (Auth0 JWT)
// ----------------------------
var authority = builder.Configuration["Auth0:Authority"]; // e.g. "https://<TENANT>/"
var audience  = builder.Configuration["Auth0:Audience"];  // e.g. "https://moyo-product-api"

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = authority;
        options.Audience  = audience;
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            NameClaimType = "name",
            RoleClaimType = "roles" // map Auth0 “roles” claim to .NET Role
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("capturer:basic",
        policy => policy.RequireClaim("permissions", "capturer:basic"));

    options.AddPolicy("manager:basic",
        policy => policy.RequireClaim("permissions", "manager:basic"));
});

// ----------------------------
// 5. Swagger + Bearer support
// ----------------------------
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "ProductManagement API",
        Version = "v1"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Paste JWT:  Bearer {token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.EnsureCreatedAsync();
    var lake = scope.ServiceProvider.GetRequiredService<DataLakeService>();
    await lake.SeedFromLakeAsync();
}

// ----------------------------
// 6. HTTP Pipeline
// ----------------------------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseCors("AllowFrontend");
app.UseRouting();
app.UseAuthentication();   // enable JWT validation
app.UseAuthorization();    // enforce [Authorize] on controllers

app.MapControllers();

app.Run();