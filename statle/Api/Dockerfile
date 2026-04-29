FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build
WORKDIR /src

COPY Api/Api.csproj ./Api/
RUN dotnet restore ./Api/Api.csproj

COPY Api/. ./Api/
COPY public ./public
RUN dotnet publish ./Api/Api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview
WORKDIR /app

ENV ASPNETCORE_URLS=http://0.0.0.0:5055

COPY --from=build /app/publish ./
COPY --from=build /src/public ./public

EXPOSE 5055

ENTRYPOINT ["dotnet", "Api.dll"]