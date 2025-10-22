import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { mockGetMenu, mockPlaceOrder } from "../../api/mockServer";
import { MenuResponse, PlaceOrderRequest, PlaceOrderResponse } from "../../api/schemas";
import { generateIdempotencyKey } from "../utils/idempotency";

// Switch to a real API later
export async function getMenu(): Promise<z.infer<typeof MenuResponse>> {
  return mockGetMenu();
}

export async function placeOrder(req: z.infer<typeof PlaceOrderRequest>): Promise<z.infer<typeof PlaceOrderResponse>> {
  return mockPlaceOrder(req);
}

export function useMenu() {
  const qc = useQueryClient();

  const menuQuery = useQuery({ queryKey: ["menu"], queryFn: getMenu });

  const orderMutation = useMutation({
    mutationFn: async (itemIds: string[]) => {
      // @ts-ignore
      const req: z.infer<typeof PlaceOrderRequest> = { idempotencyKey: generateIdempotencyKey(), itemIds };
      return placeOrder(req);
    },
    onSuccess: () => {
      // Invalidate dependent queries so the UI reflects the latest
      qc.invalidateQueries({ queryKey: ["lastOrder"] });
    },
  });

  return { menuQuery, orderMutation };
}