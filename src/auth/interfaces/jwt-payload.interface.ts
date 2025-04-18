export interface JwtPayload {
    username: string;
    sub: string;  // User ID
    role: string;
    iat?: number; // Issued at (auto-added by JWT)
    exp?: number; // Expiration time (auto-added by JWT)
  }