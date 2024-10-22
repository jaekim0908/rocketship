"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Select,
  SelectContent,
  SelectItem,
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
});

const CreatePackageForm = ({ currentOrder }: { currentOrder: Order }) => {
  // const [newTransformation, setNewTransformation] =
  //   useState<Transformations | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rateData, setRateData] = useState(null);
  const [labelData, setLabelData] = useState(null);
  const router = useRouter();

  const initialValues = {
    length: 1,
    width: 1,
    height: 1,
    weight: 1,
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

    setTimeout(() => {
      setIsSubmitting(false);
      // setRateData(quotationResult.RateResponse.RatedShipment);
      setLabelData(
        JSON.parse(JSON.stringify(createShipment)).ShipmentResponse
          .ShipmentResults.PackageResults[0].ShippingLabel.GraphicImage
      );
      console.log(JSON.stringify(createShipment, null, 2));
    }, 500);
  }
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              {isSubmitting ? "Submitting..." : "Submit Quote"}
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
