import styles from "../styles/home.module.scss";
import Head from "next/head";
import { SubscribeButton } from "../components/SubscribeButton";
import { GetStaticProps } from "next";
import { stripe } from "../services/stripe";
import { formatAmount } from "../util/format";

interface HomeProps {
  product : {
    id: string;
    amount: number;
  }
}

export default function Home({product}: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | IgNews 2.0</title>
      </Head>
      <main className={styles.maincontainer}>
        <section className={styles.sectionContainer}>
          <span>👏 Hey, welcome</span>
          <h1>
            News about the <span>React</span> world
          </h1>

          <p>
            Get acces to all the publication <br />
            <span>for {product.amount} month</span>
          </p>

          <SubscribeButton priceId={product.id}/>
        </section>
        <img src="/images/avatar.svg" alt="Avatar" />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve("price_1IZLJiE7zeBVQQxBOJfOG1xF", {
    expand: ["product"],
  });

  const product = {
    priceId: price.id,
    amount: formatAmount(price.unit_amount),
  };

  return {
    props: {
      product
    },
    // Em quanto tempo em segundos essa pagina nao precisa ser revalidada (reconstruida)
    revalidate: 60 * 60 * 24, // sera reconstruida em 1 dia
  };
};
