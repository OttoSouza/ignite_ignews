export function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency"
  }).format(amount / 100)
}