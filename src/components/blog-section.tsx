import { ArticleCard } from "@/components/article-card";

export function BlogSection() {
  return (
    <section className="container flex flex-col items-center gap-6 py-24 sm:gap-7">
      <div className="flex flex-col gap-3">
        <span className="font-bold uppercase text-primary text-center">Articles</span>
        <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl text-balance text-center">
          Our Blog
        </h2>
      </div>
      <p className="text-lg text-muted-foreground text-balance max-w-2xl text-center">
        Learn how to build beautiful landing pages fast.
      </p>
      <div className="mt-6 grid auto-rows-fr grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
        <ArticleCard
          title="How to build a beautiful landing page in minutes"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nec ultrices orci. Vivamus ante arcu, hendrerit."
          category="Coding"
          date="Jul 16, 2024"
          
        />
        <ArticleCard
          title="How to generate the perfect theme for your website with AI"
          description="Mauris tincidunt porttitor risus, et posuere erat malesuada eu. Praesent volutpat ut ipsum ac congue."
          category="Design"
          date="May 10, 2024"
          
        />
        <ArticleCard
          title="How to build at the speed of no-code without customization limits"
          description="Curabitur at quam eget eros semper euismod vitae at neque. Ut ultrices ut."
          category="Coding"
          date="Apr 27, 2024"
          
        />
      </div>
    </section>
  );
}
