import { fauna } from "../../../services/fauna";
import { query as q } from "faunadb";
import { stripe } from "../../../services/stripe";

export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false

) {
  // buscar o usuario no banco fauna
  //salvar os dados da subscription do faund

 
  const userRef = await fauna.query(
    q.Select(
      "ref",
      q.Get(q.Match(q.Index("user_by_stripe_customer_id"), customerId))
    )
  );

   const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const subData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    priceId: subscription.items.data[0].price.id,
  };

  // await fauna.query(
  //   q.Create(
  //     q.Collection("subscriptions"),
  //     {
  //       data: subData
  //     }
  //   )
  // )

  if (createAction) {
    await fauna.query(
      q.Create(q.Collection("subscriptions"), {
        data: subData,
      })
    );
  }else {
    await fauna.query(
      q.Replace(
        q.Select(
          "ref",
          q.Get(
            q.Match(
              q.Index("subscription_by_id"),
              subscriptionId
            )
          )
        ),
        {
          data: subData
        }
      )
    ) 
  }
}
