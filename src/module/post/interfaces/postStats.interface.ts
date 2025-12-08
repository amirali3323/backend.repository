import { PostStatus } from 'src/common/enums';

export interface PostStats {
  status: PostStatus;
  count: number;
}
