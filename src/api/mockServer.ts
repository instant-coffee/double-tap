import { z } from "zod";
import { MenuResponse, Order, PlaceOrderResponse } from "./schemas";

const sleep = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms));

let DB = {
  menu: [
    { id: "1", name: "Long Black", priceCents: 350, category: "Coffee", isFavorite: true },
    { id: "2", name: "Flat White", priceCents: 475, category: "Coffee", isFavorite: false },
    { id: "3", name: "Peppermint Tea", priceCents: 450, category: "Tea", isFavorite: false },
    { id: "4", name: "Crossant", priceCents: 625, category: "Bakery", isFavorite: false },
  ],
  idempotency: new Map<string, z.infer<typeof PlaceOrderResponse>>(),
  lastOrder: null as null | z.infer<typeof Order>,
}

export const mockGetMenu = async (): Promise<z.infer<typeof MenuResponse>> => {
  await sleep(); // simulate network latency
  return {
    items: DB.menu,
  };
};

export async function mockPlaceOrder(input: unknown): Promise<z.infer<typeof PlaceOrderResponse>> {
  await sleep();
  const parsed = z.object({ idempotencyKey: z.string(), itemIds: z.array(z.string()).nonempty() }).parse(input);

  // Idempotency: return same result if the key was already used
  const existing = DB.idempotency.get(parsed.idempotencyKey);
  if (existing) return existing;

  // Simulate a random intermittent failure to demonstrate retry/rollback
  if (Math.random() < 0.15) throw new Error("Temporary gateway error. Please try again.");

  const totalCents = parsed.itemIds
    .map((id) => DB.menu.find((m) => m.id === id)?.priceCents ?? 0)
    .reduce((a, b) => a + b, 0);

  const res: z.infer<typeof PlaceOrderResponse> = {
    order: {
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      totalCents,
      itemIds: parsed.itemIds,
      loyaltyAwarded: Math.floor(totalCents / 100), // 1pt per $1
    },
  };
  DB.lastOrder = res.order;
  DB.idempotency.set(parsed.idempotencyKey, res);
  return res;
};