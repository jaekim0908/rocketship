"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  aspectRatioOptions,
  creditFee,
  defaultValues,
  transformationTypes,
} from "@/constants";
import { useEffect, useState, useTransition } from "react";
import { AspectRatioKey, debounce, deepMergeObjects } from "@/lib/utils";
import MediaUploader from "./MediaUploader";
import TransformedImage from "./TransformedImage";
import { updateCredits } from "@/lib/actions/user.actions";
import { getCldImageUrl } from "next-cloudinary";
import { addImage, updateImage } from "@/lib/actions/image.actions";
import { useRouter } from "next/navigation";
import { InsufficientCreditsModal } from "./InsufficientCreditsModal";
import { TransformationFormProps, Transformations } from "@/types";
import { CustomField2 } from "./CustomField2";
import Header from "./Header";
import { createUPSShipment, getUPSAuthToken, getUPSRate } from "@/lib/ups";
import { Order } from "shippo";
import { randomUUID } from "crypto";
import { Rotate3D } from "lucide-react";
import { BlockList } from "net";

export const formSchema = z.object({
  length: z.coerce.number().min(0.1),
  width: z.coerce.number().min(0.1),
  height: z.coerce.number().min(0.1),
  weight: z.coerce.number().min(0.1),
  serviceCode: z.string({
    required_error: "Please select a service for your package.",
  }),
});

const CreatePackageForm = ({ currentOrder }: { currentOrder: Order }) => {
  // const [newTransformation, setNewTransformation] =
  //   useState<Transformations | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rateData, setRateData] = useState(null);
  const [labelData, setLabelData] = useState(null);
  const [chargeData, setChargeData] = useState(null);
  const [negotiatdChargeData, setNegotiatedChargeData] = useState(null);
  const router = useRouter();

  const initialValues = {
    length: 1,
    width: 1,
    height: 1,
    weight: 1,
    serviceCode: "03"
  };

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  let rateResult: any = null;
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const quotationResult = await getUPSRate(
      currentOrder.toAddress,
      currentOrder.toAddress
    );

    const createShipment = await createUPSShipment(
      currentOrder.toAddress,
      currentOrder.toAddress,
      values
    );

    setIsSubmitting(false);
    // setRateData(quotationResult.RateResponse.RatedShipment);
    setLabelData(
      JSON.parse(JSON.stringify(createShipment)).ShipmentResponse
        .ShipmentResults.PackageResults[0].ShippingLabel.GraphicImage
    );
    setChargeData(
      JSON.parse(JSON.stringify(createShipment)).ShipmentResponse
        .ShipmentResults.ShipmentCharges
    );
    setNegotiatedChargeData(
      JSON.parse(JSON.stringify(createShipment)).ShipmentResponse
      .ShipmentResults.NegotiatedRateCharges
    )
    setTimeout( () => {
      console.log(JSON.stringify(createShipment, null, 2));
    }, 100)
  }
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div></div>
          <Header title="UPS Service" />
          <FormField
            control={form.control}
            name="serviceCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>UPS Service</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Select a service for your package" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Domestic Service</SelectLabel>
                      <SelectItem value="03">UPS Ground</SelectItem>
                      <SelectItem value="01">UPS Next Day Air</SelectItem>
                      <SelectItem value="02">UPS 2nd Day Air</SelectItem>
                      <SelectItem value="12">UPS 3 Day Select</SelectItem>
                      <SelectItem value="13">UPS Next Day Air Saver</SelectItem>
                      <SelectItem value="14">UPS Next Day Air Early</SelectItem>
                      <SelectItem value="59">UPS 2nd Day Air AM</SelectItem>
                      <SelectItem value="21">UPS Express Critical</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {/* <FormDescription>
                You can manage email addresses in your{" "}
                <Link href="/examples/forms">email settings</Link>.
              </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <Header title="Package Dimension" />
          <div className="grid grid-cols-3 gap-4">
            <CustomField2
              control={form.control}
              name="length"
              formLabel="Lengh"
              className="w-full"
              render={({ field }) => (
                <Input {...field} className="input-field" />
              )}
            />
            <CustomField2
              control={form.control}
              name="width"
              formLabel="Width"
              className="w-full"
              render={({ field }) => (
                <Input {...field} className="input-field" />
              )}
            />
            <CustomField2
              control={form.control}
              name="height"
              formLabel="Height"
              className="w-full"
              render={({ field }) => (
                <Input {...field} className="input-field" />
              )}
            />
          </div>
          <Header title="Package Weight" />
          <CustomField2
            control={form.control}
            name="weight"
            formLabel="Weight"
            className="w-full"
            render={({ field }) => <Input {...field} className="input-field" />}
          />
          <div className="flex flex-col gap-4">
            <Button
              type="submit"
              className="submit-button capitalize"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Buy Package"}
            </Button>
          </div>
        </form>
      </Form>
      {labelData && (
        <section
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3"
        >
          <div style={{ height: "220px" }}>Shipping Label</div>
          <img
            src={`data:image/gif;base64, ${labelData}`}
            style={{
              transform: "rotate(90deg)",
              display: "block",
              margin: "20px auto",
              maxWidth: "100%",
              height: "auto",
            }}
            className="h-auto w-full max-w-full rounded-lg object-cover object-center md:h-[480px]"
          />
        </section>
      )}
      {chargeData && (
        <section style={{ display: "flex", flexDirection: "column"}}>
        <div style={{ height: "150px" }}></div>
        <div className="flex flex-col mt-5">
          <h3>Shipment Charges</h3>
          <pre>{JSON.stringify(chargeData, null, 2)}</pre>
          <h3>Negotiated Rate Charges</h3>
          <pre>{JSON.stringify(negotiatdChargeData, null, 2)}</pre>
          </div>
        </section>
      )}
      {/* {rateData &&
        JSON.parse(JSON.stringify(rateData)).map((m: JSON, index: any) => {
          return (
            <section key={index}>
              <div className="flex flex-col mt-5">
                <pre>{JSON.stringify(m, null, 2)}</pre>
              </div>
              <Button>Buy This Package</Button>
            </section>
          );
        })} */}
    </>
  );
};

export default CreatePackageForm;
