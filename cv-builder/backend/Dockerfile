FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY CVBuilder.sln .
COPY CVBuilder.API/CVBuilder.API.csproj CVBuilder.API/
COPY CVBuilder.Application/CVBuilder.Application.csproj CVBuilder.Application/
COPY CVBuilder.Domain/CVBuilder.Domain.csproj CVBuilder.Domain/
COPY CVBuilder.Infrastructure/CVBuilder.Infrastructure.csproj CVBuilder.Infrastructure/

RUN dotnet restore

COPY . .
RUN dotnet publish CVBuilder.API/CVBuilder.API.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "CVBuilder.API.dll"]
