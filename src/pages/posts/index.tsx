import styles from "./styles.module.scss";
import Head from "next/head";
import { GetStaticProps } from "next";
import { getPrimiscClient } from "../../services/prismic";
import Prismic from "@prismicio/client";
import { RichText } from "prismic-dom";
import Link from "next/link";

type Post = {
  slug: string;
  title: string;
  resume: string;
  updatedAt: string;
};

interface PostProps {
  posts: Post[];
}

export default function Posts({ posts }: PostProps) {
  return (
    <>
      <Head>
        <title>Posts | Ignews 2.0</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.postsList}>
          {posts.map((post) => (
            <Link href={`/posts/${post.slug}`} key={post.slug}>
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.resume}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrimiscClient();

  const response = await prismic.query(
    [Prismic.predicates.at("document.type", "post")],
    {
      fetch: ["post.title", "post.content"],
      pageSize: 10,
    }
  );

  const posts = response.results.map((post) => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      resume:
        post.data.content.find((content) => content.type === "paragraph")
          ?.text ?? " ",
      updatedAt: new Date(post.last_publication_date).toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      ),
    };
  });

  return {
    props: { posts },
  };
};
