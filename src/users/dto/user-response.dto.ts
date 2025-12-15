export class UserResponseDto {
  id: string; // Changed from bigint to string for JSON serialization
  username: string;
  displayName: string;
  email?: string;
  createdAt: Date;
  followerCount: number;
  followingCount: number;
  isFollowing?: boolean; // Whether the current user is following this user
  murmurs?: Array<{
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    likeCount: number;
  }>;
}
