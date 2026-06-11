import { Post, Ad, News } from '../../types';
import { FeedItem } from '../../components/cards/feed-card';

/**
 * Interleaves posts, ads, and news items based on the rules:
 * - Distribute 7 posts -> 1 ad, then 5-7 posts (randomized/deterministic) -> 1 news item, repeat.
 * - Maintains chronological order of posts and avoids clustering.
 */
export function interleaveContent(
  posts: Post[],
  ads: Ad[],
  news: News[]
): FeedItem[] {
  const result: FeedItem[] = [];
  
  // Clone to avoid mutation
  const postsQueue = [...posts];
  const adsQueue = [...ads];
  const newsQueue = [...news];

  let postCount = 0;
  let nextNewsThreshold = 6; // Initial threshold between 5 and 7
  let mode: 'ad' | 'news' = 'ad';

  // Seeded/stable threshold calculation to avoid reshuffling on scroll/render
  const getNextNewsThreshold = (index: number): number => {
    return 2 + (index % 2); // Alternates 2, 3 deterministically
  };

  while (postsQueue.length > 0) {
    const targetCount = mode === 'ad' ? 3 : nextNewsThreshold;
    
    // Add posts up to the target count
    while (postCount < targetCount && postsQueue.length > 0) {
      const post = postsQueue.shift()!;
      result.push({ type: 'post', data: post });
      postCount++;
    }

    // Insert ad or news if target count was reached
    if (postCount >= targetCount) {
      if (mode === 'ad') {
        if (adsQueue.length > 0) {
          result.push({ type: 'ad', data: adsQueue.shift()! });
        } else if (ads.length > 0) {
          // Recycle ads if we run out of fresh ones
          const recycledAd = ads[result.filter(x => x.type === 'ad').length % ads.length];
          result.push({ type: 'ad', data: recycledAd });
        }
        postCount = 0;
        mode = 'news';
        nextNewsThreshold = getNextNewsThreshold(result.length);
      } else {
        if (newsQueue.length > 0) {
          result.push({ type: 'news', data: newsQueue.shift()! });
        } else if (news.length > 0) {
          // Recycle news if we run out of fresh ones
          const recycledNews = news[result.filter(x => x.type === 'news').length % news.length];
          result.push({ type: 'news', data: recycledNews });
        }
        postCount = 0;
        mode = 'ad';
      }
    }
  }

  return result;
}
