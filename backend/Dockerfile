FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["MusicMate.Api/MusicMate.Api.csproj", "MusicMate.Api/"]
COPY ["MusicMate.Application/MusicMate.Application.csproj", "MusicMate.Application/"]
COPY ["MusicMate.Domain/MusicMate.Domain.csproj", "MusicMate.Domain/"]
COPY ["MusicMate.Infrastructure/MusicMate.Infrastructure.csproj", "MusicMate.Infrastructure/"]

RUN dotnet restore "MusicMate.Api/MusicMate.Api.csproj"

COPY . .

WORKDIR "/src/MusicMate.Api"
RUN dotnet publish "MusicMate.Api.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
EXPOSE 8080

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "MusicMate.Api.dll"]