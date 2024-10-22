import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { transactionCategoryStyles } from "@/constants";
import {
  cn,
  formatAmount,
  formatDateTime,
  removeSpecialCharacters,
} from "@/lib/utils";
import {
  CategoryBadgeProps,
  OnlineOrders,
  TransactionTableProps,
} from "@/types";
import { Button } from "../ui/button";
import Link from "next/link";
import LineItemsTable from "./LineItemsTable";

const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  const { borderColor, backgroundColor, textColor, chipBackgroundColor } =
    transactionCategoryStyles[
      category as keyof typeof transactionCategoryStyles
    ] || transactionCategoryStyles.default;

  return (
    <div className={cn("category-badge", borderColor, chipBackgroundColor)}>
      <div className={cn("size-2 rounded-full", backgroundColor)} />
      <p className={cn("text-[12px] font-medium", textColor)}>{category}</p>
    </div>
  );
};

const TransactionsTable = ({ onlineOrders }: TransactionTableProps) => {
  return (
    <Table>
      <TableHeader className="bg-[#f9fafb]">
        <TableRow>
          <TableHead className="px-2">Order Number</TableHead>
          <TableHead className="px-2">Customer</TableHead>
          <TableHead className="px-2">Status</TableHead>
          <TableHead className="px-2">Items</TableHead>
          <TableHead className="px-2">Order Date</TableHead>
          <TableHead className="px-2 max-md:hidden">Total Price</TableHead>
          <TableHead className="px-2"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {onlineOrders.map((t: OnlineOrders) => {
          const status = t.orderStatus;
          const amount = formatAmount(t.totalPrice);
          let quantity = 0;

          for (let i = 0; i < t.lineItems.length; i++) {
            quantity +=
              t.lineItems[i].quantity === 0 ? 1 : t.lineItems[i].quantity;
          }
          return (
            <TableRow key={t.objectId}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <h1 className="text-14 truncate font-semibold text-[#344054]">
                    {t.orderNumber}
                  </h1>
                </div>
              </TableCell>
              <TableCell className="max-w-[250px] pl-2 pr-10">
                <div className="flex items-center gap-3">
                  <h1 className="text-14 truncate font-semibold text-[#344054]">
                    {/* {removeSpecialCharacters(t?.customerName)} */}
                    {t?.customerName}
                  </h1>
                </div>
              </TableCell>

              <TableCell className="pl-2 pr-10">
                <CategoryBadge category={status} />
              </TableCell>

              <TableCell className="max-w-[250px] pl-2 pr-10">
                <div className="flex items-center gap-3">
                  <h1 className="text-14 truncate font-semibold text-[#344054]">
                    {quantity}
                  </h1>
                </div>
              </TableCell>

              <TableCell className="min-w-32 pl-2 pr-10">
                {formatDateTime(new Date(t.placedAt)).dateTime}
              </TableCell>

              <TableCell className="pl-2 pr-10 capitalize min-w-24">
                {amount}
              </TableCell>
              <TableCell className="pl-2 pr-10 capitalize min-w-24">
                <Link href={`/orders/${t.objectId}`}>
                  <Button>Add Package</Button>
                </Link>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default TransactionsTable;
