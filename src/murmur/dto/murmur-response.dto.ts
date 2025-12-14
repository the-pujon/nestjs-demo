export class MurmurAuthorDto {
  id: bigint;
  username: string;
  displayName: string;
}

export class MurmurResponseDto {
  id: bigint;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  likeCount: number;
  likedByMe: boolean;
  author: MurmurAuthorDto;
}
