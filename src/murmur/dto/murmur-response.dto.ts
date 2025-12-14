export class MurmurAuthorDto {
  id: string; // Changed from bigint to string for JSON serialization
  username: string;
  displayName: string;
}

export class MurmurResponseDto {
  id: string; // Changed from bigint to string for JSON serialization
  content: string;
  createdAt: Date;
  updatedAt: Date;
  likeCount: number;
  likedByMe: boolean;
  author: MurmurAuthorDto;
}
