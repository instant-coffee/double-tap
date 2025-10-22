import { z } from "zod";

// zod schemas provide a runtime validation layer for incoming data
export const MenuItem = z.object({
  id: z.string(),
  name: z.string(),
  priceCents: z.number().int().nonnegative(),
  category: z.string(),
  isFavorite: z.boolean().optional().default(false),
});
export type TMenuItem = z.infer<typeof MenuItem>;

export const MenuResponse = z.object({
  items: z.array(MenuItem),
});

export const Order = z.object({
  id: z.string(),
  createdAt: z.string(),
  totalCents: z.number().int().nonnegative(),
  itemIds: z.array(z.string()),
  loyaltyAwarded: z.number().int().nonnegative().default(0),
})

export const PlaceOrderRequest = z.object({
  idempotencyKey: z.string(), // required for safe retries
  itemIds: z.array(z.string()).nonempty(),
});

export const PlaceOrderResponse = z.object({
  order: Order,
});