import { GetStaticPaths, GetStaticProps } from "next";
import { RichText } from "prismic-dom";
import Head from "next/head";
import styles from "../post.module.scss";
import { getPrimiscClient } from "../../../services/prismic";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import { useSession } from "next-auth/client";
import { useEffect } from "react";
interface PostProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
}

export default function PostPreview({ post }: PostProps) {
  const [session] = useSession();

  const { push } = useRouter();
  useEffect(() => {
    if (session?.activeSubscription) {
      push(`/posts/${post.slug}`);
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>{post.title} | Ignews 2.0</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.postContainer}>
          <h1>{post.title} </h1>
          <time>{post.updatedAt}</time>
          <div
            dangerouslySetInnerHTML={{ __html: post.content }}
            className={`${styles.postContent} ${styles.previewContent}`}
          />

          <div className={styles.buttonContinue}>
            Wanna continue reading?
            <Link href="/">
              <a>Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking", // 
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrimiscClient();

  const response = await prismic.getByUID("post", String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  };
  return {
    props: { post },
    revalidate: 60 * 30, // 30 minutos
  };
};
