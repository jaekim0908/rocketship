import CreatePackageForm from "@/components/shared/CreatePackageForm";
import Header from "@/components/shared/Header";
import HeaderBox from "@/components/shared/HeaderBox";
import LineItemsTable from "@/components/shared/LineItemsTable";
import { shippoClient } from "@/lib/shippo";
import { getUPSRate } from "@/lib/ups";
import React from "react";

const OrderDetailPage = async ({
  params,
}: {
  params: { objectId: string };
}) => {
  const currentOrder = await shippoClient.orders.get(params.objectId);
  return (
    <div>
      <Header title="Order Detail Page" />
      <LineItemsTable lineItems={currentOrder.lineItems} />
      <Header title="Package Info" />
      <div className="grid grid-cols-3 gap-4">
      <section>
      <div className="text-dark-700 font-bold">From Address:</div>
        <div>{currentOrder.toAddress.name}</div>
        <div>
          {" "}
          {currentOrder.toAddress.street1} {currentOrder.toAddress.street2}{" "}
          {currentOrder.toAddress.street3}
        </div>
        <div>
          {" "}
          {currentOrder.toAddress.city}, {currentOrder.toAddress.state}{" "}
          {currentOrder.toAddress.zip}
        </div>
      </section>
      <section>
        <div className="text-dark-700 font-bold">To Address:</div>
        <div>{currentOrder.toAddress.name}</div>
        <div>
          {" "}
          {currentOrder.toAddress.street1} {currentOrder.toAddress.street2}{" "}
          {currentOrder.toAddress.street3}
        </div>
        <div>
          {" "}
          {currentOrder.toAddress.city}, {currentOrder.toAddress.state}{" "}
          {currentOrder.toAddress.zip}
        </div>
      </section>
      </div>
      <CreatePackageForm currentOrder={currentOrder}></CreatePackageForm>
    </div>
  );
};

export default OrderDetailPage;
