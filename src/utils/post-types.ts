export type PostType = 'bible_study' | 'prayer_request' | 'testimony' | 'spiritual_question';

export function getTableName(postType: string): PostType {
  switch (postType) {
    case 'bible-study':
    case 'bible_study':
      return 'bible_study';
    case 'prayer-request':
    case 'prayer_request':
      return 'prayer_request';
    case 'testimony':
      return 'testimony';
    case 'spiritual-question':
    case 'spiritual_question':
      return 'spiritual_question';
    default:
      throw new Error(`Invalid post type: ${postType}`);
  }
}

export function formatPostType(postType: string): string {
  return postType.replace('-', '_');
}

export function slugifyPostType(postType: string): string {
  return postType.replace('_', '-');
} 