/* src/app/articles/[slug]/page.tsx */ 
import { createClient } from "contentful";
import { BlogItem } from "../../types";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

const client = createClient({
  space: process.env.SPACE_ID,
  accessToken: process.env.ACCESS_TOKEN,
});


type BlogPageProps = {
  params: {
    slug: string;
  };
};

const fetchBlogPost = async (slug: string): Promise<BlogItem> => {
  const queryOptions = {
    content_type: "blog",
    "fields.slug[match]": slug,
  };
  const queryResult = await client.getEntries(queryOptions);
  return queryResult.items[0];
};


export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } =  await params;

  const article = await fetchBlogPost(slug);

  const { title, date, content } = article.fields;

  return (
    <main className="min-h-screen p-24 flex justify-center">
      <div className="max-w-2xl">
        <h1>{title}</h1>
        <p className="mb-6 text-slate-400 ">
          Posted on{" "}
          {new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <div className="[&>p]:mb-8 [&>h2]:font-extrabold">
          { documentToReactComponents(content) }
        </div>
      </div>
    </main>
  );
}