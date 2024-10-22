"use server";

import { shippoClient } from "../shippo";
import { parseStringify } from "../utils";

export const getOrders = async () => {
  let hasMore = true;
  let orders: any = [];
  let ordersList: any = [];
  let currentPage = 1;

  try {
    while (hasMore) {
      const response = await shippoClient.orders.list({
        // orderStatus: ["PAID"],
        shopApp: "Shopify",
        results: 100,
        page: currentPage,
      });
      const data = response;

      orders = response.results?.map((order) => ({
        objectId: order.objectId,
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        customerName: order.toAddress?.name,
        placedAt: order.placedAt,
        fromAddress: order.fromAddress,
        toAddress: order.toAddress,
        totalPrice: order.totalPrice,
        lineItems: order.lineItems?.map((lineItem) => ({
          currency: lineItem.currency,
          manufactureCountry: lineItem.manufactureCountry,
          totalPrice: lineItem.totalPrice,
          objectId: lineItem.objectId,
          sku: lineItem.sku,
          title: lineItem.title,
          quantity: lineItem.quantity,
          weight: lineItem.weight,
          weightUnit: lineItem.weightUnit,
        })),
      }));
      ordersList.push(...orders);
      hasMore = data.next ? true : false;
      currentPage++;
    }
    return parseStringify(ordersList);
  } catch (error) {
    console.error("An error occurred while getting the orders:", error);
  }
};
