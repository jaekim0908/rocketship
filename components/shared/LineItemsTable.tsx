import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  cn,
  formatAmount,
  formatDateTime,
  removeSpecialCharacters,
} from "@/lib/utils";
import { Button } from "../ui/button";
import Link from "next/link";
import { LineItem, Shippo } from "shippo";
import { LineItemsTableProps } from "@/types";

const LineItemsTable = ({ lineItems }: LineItemsTableProps) => {
  return (
    <Table>
      <TableHeader className="bg-[#f9fafb]">
        <TableRow>
          <TableHead className="px-2">Item</TableHead>
          <TableHead className="px-2">SKU</TableHead>
          <TableHead className="px-2">Quantity</TableHead>
          <TableHead className="px-2">Weight</TableHead>
          <TableHead className="px-2">Value</TableHead>
          <TableHead className="px-2"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {lineItems.map((t: LineItem) => {
          const quantity = t.quantity === 0 ? 1 : t.quantity;
          const value = t.totalPrice ? 0 : t.totalPrice;
          return (
            <TableRow key={t.objectId}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <h1 className="text-14 truncate font-semibold text-[#344054]">
                    {t?.title}
                  </h1>
                </div>
              </TableCell>
              <TableCell className="max-w-[250px] pl-2 pr-10">
                <div className="flex items-center gap-3">
                  <h1 className="text-14 truncate font-semibold text-[#344054]">
                    {/* {removeSpecialCharacters(t?.customerName)} */}
                    {t?.sku}
                  </h1>
                </div>
              </TableCell>

              <TableCell className="max-w-[250px] pl-2 pr-10">
                <div className="flex items-center gap-3">
                  <h1 className="text-14 truncate font-semibold text-[#344054]">
                    {quantity}
                  </h1>
                </div>
              </TableCell>
              <TableCell className="max-w-[250px] pl-2 pr-10">
                <div className="flex items-center gap-3">
                  <h1 className="text-14 truncate font-semibold text-[#344054]">
                    {t?.weight} {t?.weightUnit}
                  </h1>
                </div>
              </TableCell>
              <TableCell className="max-w-[250px] pl-2 pr-10">
                <div className="flex items-center gap-3">
                  <h1 className="text-14 truncate font-semibold text-[#344054]">
                    {t?.currency} {t?.totalPrice}
                  </h1>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default LineItemsTable;
