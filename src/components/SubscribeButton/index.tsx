import styles from "./styles.module.scss";
import { useSession, signIn } from "next-auth/client";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import { useRouter } from 'next/dist/client/router';

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const [session] = useSession();
  const {push} = useRouter();
  async function handleSubscribe() {
    if (!session) {
      signIn("github");
      return;
    }

    if(session.activeSubscription) {
      push("/posts")
      return;
    }
    try {
      const response = await api.post("/subscribe");

      const { sessionId } = response.data;

      const stripeJs = await getStripeJs();

      await stripeJs.redirectToCheckout({sessionId});
    } catch (error) {
      alert(error.message)
    }
  }
  return (
    <button
      type="button"
      className={styles.container}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}
