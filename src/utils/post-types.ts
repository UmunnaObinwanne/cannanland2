export type PostType = 'bible_study' | 'prayer_request' | 'testimony' | 'spiritual_question';

export function getTableName(postType: string): string {
  switch (postType) {
    case 'bible-study':
      return 'bible_studies';
    case 'prayer-request':
      return 'prayer_requests';
    case 'testimony':
      return 'testimonies';
    case 'spiritual-question':
      return 'spiritual_questions';
      
    // Handle the underscore versions as well
    case 'bible_study':
      return 'bible_studies';
    case 'prayer_request':
      return 'prayer_requests';
    case 'spiritual_question':
      return 'spiritual_questions';
    default:
      throw new Error(`Invalid post type: ${postType}`);
  }
}


export function getPageConfig(urlParam: string): { table: string, type: PostType } {
 const postType = urlParam.replace('-', '_') as PostType;
 return {
   table: getTableName(postType),
   type: postType
 };
}

export function formatPostType(postType: string): string {
  return postType.replace('-', '_');
}

export function slugifyPostType(postType: string): string {
  return postType.replace('_', '-');
} 