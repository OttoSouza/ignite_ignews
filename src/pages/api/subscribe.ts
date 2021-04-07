import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../services/stripe";
import { getSession } from "next-auth/client";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";

type User = {
  ref: {
    id: string;
  };
  data: {
    stripe_customer_id: string;
  };
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Precisa ser um metodo post para realizar um chechout
  if (req.method === "POST") {
    // obtendo a session (usuario atual)
    const session = await getSession({ req });

    const getUserFaunaDB = await fauna.query<User>(
      q.Get(q.Match(q.Index("user_by_email"), q.Casefold(session.user.email)))
    );
    

    // existe um vinculo entre o usuario atual cadatrado no banco com a api de pagamentos?
    // FAUNADB - STRIPE?
    let customerId = getUserFaunaDB.data.stripe_customer_id;

    if (!customerId) {
      // criando o cliente dentro do stirpe com o usuario logado
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
      });

      await fauna.query(
        q.Update(q.Ref(q.Collection("users"), getUserFaunaDB.ref.id), {
          data: {
            stripe_customer_id: stripeCustomer.id,
          },
        })
      );
      
      customerId = stripeCustomer.id
    }

    // informacoes que devem aparecer para a criacao do pagamento no caso checkout
    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [
        {
          price: "price_1IZLJiE7zeBVQQxBOJfOG1xF",
          quantity: 1,
        },
      ],
      mode: "subscription", // pagamento recorrente
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    // devolver a session do stripe
    return res.json({ sessionId: stripeCheckoutSession.id });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
  }
};
