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
      <div>{params.objectId}</div>
      <LineItemsTable lineItems={currentOrder.lineItems} />
      <section>
        <div>Recipient: {currentOrder.toAddress.name}</div>
        <div>Address: </div>
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
      <CreatePackageForm currentOrder={currentOrder}></CreatePackageForm>
    </div>
  );
};

export default OrderDetailPage;
