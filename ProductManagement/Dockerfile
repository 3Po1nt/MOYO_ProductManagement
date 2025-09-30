# =========================
# 1. Build React frontend
# =========================
FROM node:18 AS client-build
WORKDIR /src/client
COPY ProductManagement/client/package*.json ./
RUN npm install
COPY ProductManagement/client/ ./
RUN npm run build          # produces /src/client/build

# =========================
# 2. Build .NET backend
# =========================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY *.sln .
COPY ProductManagement/*.csproj ./ProductManagement/
RUN dotnet restore ProductManagement/ProductManagement.csproj
COPY ProductManagement/ ./ProductManagement/
RUN dotnet publish ProductManagement/ProductManagement.csproj -c Release -o /app/publish

# =========================
# 3. Runtime image
# =========================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
# Copy React build into API wwwroot so ASP.NET serves it
COPY --from=client-build /src/client/build ./wwwroot

# Set environment for ASP.NET
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "ProductManagement.dll"]