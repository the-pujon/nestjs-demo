export class UserResponseDto {
  id: string; // Changed from bigint to string for JSON serialization
  username: string;
  displayName: string;
  email?: string;
  createdAt: Date;
  followerCount: number;
  followingCount: number;
}
