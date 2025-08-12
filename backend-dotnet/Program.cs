using JobManagementHub.Hubs;
using JobManagementHub;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddSignalR();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder
            .WithOrigins("http://localhost:3000") // React frontend
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddLogging();

// Add background service for job updates
builder.Services.AddHostedService<JobUpdateService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseRouting();
app.UseCors();

// Map SignalR hub
app.MapHub<JobSignalRHub>("/JobSignalRHub");

// Health check endpoint
app.MapGet("/health", () => new { 
    status = "OK", 
    timestamp = DateTime.UtcNow,
    server = "ASP.NET Core SignalR Backend",
    hub = "/JobSignalRHub"
});

app.Run();
