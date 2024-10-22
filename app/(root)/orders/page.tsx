import HeaderBox from "@/components/shared/HeaderBox";
import TransactionsTable from "@/components/shared/TransactionsTable";
import { getOrders } from "@/lib/actions/order.actions";
import { shippoClient } from "@/lib/shippo";
import React from "react";

const OnlineOrderPage = async () => {
  const orders = await getOrders();
  return (
    <div className="online-orders">
      <div className="online-orders-header">
        <HeaderBox
          title="Online Orders"
          subtext="See your online orders and its details"
        />
      </div>

      <div className="space-y-6">
        {/* <div className="transactions-account">
          <div className="flex flex-col gap-2">
            <h2 className="text-18 font-bold text-white">Online Store</h2>
          </div>
        </div> */}
        <section className="flex w-full flex-col gap-6">
          <TransactionsTable onlineOrders={orders} />
        </section>
      </div>
    </div>
  );
};

export default OnlineOrderPage;
