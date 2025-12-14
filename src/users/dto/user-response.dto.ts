export class UserResponseDto {
  id: bigint;
  username: string;
  displayName: string;
  email?: string;
  createdAt: Date;
  followerCount: number;
  followingCount: number;
}
