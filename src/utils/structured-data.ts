import { Post } from "@/types"

export function generatePostStructuredData({
  post,
  url,
  type,
}: {
  post: Post
  url: string
  type: string
}) {
  const articleStructured = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.content.substring(0, 155) + '...',
    author: {
      "@type": "Person",
      name: post.is_anonymous ? "Anonymous" : post.profiles.username,
    },
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    publisher: {
      "@type": "Organization",
      name: "Cannanland",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
      },
    },
    // Add specific article type based on post type
    articleSection: type === 'bible-study' ? 'Bible Study' :
                   type === 'prayer-request' ? 'Prayer Request' :
                   type === 'testimony' ? 'Testimony' : 
                   'Spiritual Question',
    // Add interaction statistics
    interactionStatistic: [
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/LikeAction",
        userInteractionCount: post.likes_count || 0,
      },
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/CommentAction",
        userInteractionCount: post.responses?.length || 0,
      },
    ],
  };

  // Add breadcrumbs structured data
  const breadcrumbStructured = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: process.env.NEXT_PUBLIC_APP_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        item: `${process.env.NEXT_PUBLIC_APP_URL}/${type}s`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: url,
      },
    ],
  };

  return [articleStructured, breadcrumbStructured];
}