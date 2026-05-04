namespace CVBuilder.Application.DTOs;

public record RegisterDto(string Email, string Password, string FullName);

public record LoginDto(string Email, string Password);

public record AuthResponseDto(string AccessToken, string RefreshToken, DateTime ExpiresAt, UserDto User);

public record RefreshTokenDto(string AccessToken, string RefreshToken);

public record UserDto(Guid Id, string Email, string FullName);
