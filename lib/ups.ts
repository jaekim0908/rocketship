"use server";

import { Address } from "shippo";
import { parseStringify } from "./utils";
import { z } from "zod";
import { formSchema } from "@/components/shared/CreatePackageForm";
export const getUPSAuthToken = async () => {
  try {
    const formData = {
      grant_type: "client_credentials",
    };

    const basicToken = Buffer.from(
      process.env.UPS_CLIENT_ID + ":" + process.env.UPS_CLIENT_SECRET
    ).toString("base64");
    console.log(basicToken);
    const response = await fetch(`${process.env.UPS_AUTH_TOKEN_URL}`, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + basicToken,
      },
      body: new URLSearchParams(formData).toString(),
    });

    const token = await response.text();
    return token;
  } catch (error) {
    console.error("An error occurred while getting the UPS auth token:", error);
  }
};

export const getUPSRate = async (fromAddress: Address, toAddress: Address) => {
  try {
    const token = await getUPSAuthToken();
    const query = new URLSearchParams({
      additionaladdressvalidation: "",
    }).toString();

    const version = "v2403";
    const requestoption = "Shop";
    const resp = await fetch(
      `https://wwwcie.ups.com/api/rating/${version}/${requestoption}?${query}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          transId: "string",
          transactionSrc: "testing",
          Authorization: `Bearer ${JSON.parse(token!).access_token}`,
        },
        body: JSON.stringify({
          RateRequest: {
            Request: {
              TransactionReference: {
                CustomerContext: "CustomerContext",
              },
            },
            Shipment: {
              TaxInformationIndicator: "",
              ShipmentRatingOptions: {
                NegotiatedRatesIndicator: "X",
              },
              Description: "1507 US shipment",
              Shipper: {
                Name: "Indon Chung",
                AttentionName: "Customer",
                CompanyDisplayableName: "ROM America",
                ShipperNumber: "K04212",
                Phone: { Number: "5555555555" },
                Address: {
                  AddressLine: ["9832 NE 26th Street"],
                  City: "Bellevue",
                  StateProvinceCode: "WA",
                  PostalCode: "98004",
                  CountryCode: "US",
                },
              },
              ShipTo: {
                Name: toAddress.name,
                AttentionName: toAddress.name,
                CompanyDisplayableName: "",
                Phone: { Number: toAddress.phone },
                Address: {
                  AddressLine: [
                    toAddress.street1,
                    toAddress.street2,
                    toAddress.street3,
                  ],
                  City: toAddress.city,
                  StateProvinceCode: toAddress.state,
                  PostalCode: toAddress.zip,
                  CountryCode: toAddress.country,
                },
              },
              ShipFrom: {
                Name: "Indon Chung",
                AttentionName: "Indon Chung",
                CompanyDisplayableName: "ROM America",
                Address: {
                  AddressLine: ["9832 NE 26th Street"],
                  City: "Bellevue",
                  StateProvinceCode: "WA",
                  PostalCode: "98004",
                  CountryCode: "US",
                },
              },
              PaymentInformation: {
                ShipmentCharge: {
                  Type: "01",
                  BillShipper: { AccountNumber: "K04212" },
                },
              },
              Service: {
                Code: "03",
                Description: "Ground",
              },
              NumOfPieces: "1",
              Package: {
                // SimpleRate: {
                //   Description: "SimpleRateDescription",
                //   Code: "XS",
                // },
                PackagingType: {
                  Code: "02",
                  Description: "Packaging",
                },
                Dimensions: {
                  UnitOfMeasurement: {
                    Code: "IN",
                    Description: "Inches",
                  },
                  Length: "5",
                  Width: "5",
                  Height: "5",
                },
                PackageWeight: {
                  UnitOfMeasurement: {
                    Code: "LBS",
                    Description: "Pounds",
                  },
                  Weight: "1",
                },
              },
            },
          },
        }),
      }
    );

    const data = await resp.json();
    return data;
  } catch (error) {
    console.error(
      "An error occurred while getting the UPS Shipment Rate:",
      error
    );
  }
};

export const createUPSShipment = async (
  fromAddress: Address,
  toAddress: Address,
  values: z.infer<typeof formSchema>
) => {
  try {
    const token = await getUPSAuthToken();
    const query = new URLSearchParams({
      additionaladdressvalidation: "",
    }).toString();

    const version = "v2403";
    const resp = await fetch(
      `https://wwwcie.ups.com/api/shipments/${version}/ship?${query}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          transId: "string",
          transactionSrc: "testing",
          Authorization: `Bearer ${JSON.parse(token!).access_token}`,
        },
        body: JSON.stringify({
          ShipmentRequest: {
            Request: {
              SubVersion: "1801",
              RequestOption: "nonvalidate",
              TransactionReference: { CustomerContext: "" },
            },
            Shipment: {
              TaxInformationIndicator: "",
              ShipmentRatingOptions: {
                NegotiatedRatesIndicator: "X",
              },
              Description: "Ship WS test",
              Shipper: {
                Name: "Indon Chung",
                AttentionName: "Customer",
                CompanyDisplayableName: "ROM America",
                ShipperNumber: "K04212",
                Phone: { Number: "5555555555" },
                Address: {
                  AddressLine: ["9832 NE 26th Street"],
                  City: "Bellevue",
                  StateProvinceCode: "WA",
                  PostalCode: "98004",
                  CountryCode: "US",
                },
              },
              ShipTo: {
                Name: toAddress.name,
                AttentionName: toAddress.name,
                CompanyDisplayableName: "",
                Phone: { Number: toAddress.phone },
                Address: {
                  AddressLine: [
                    toAddress.street1,
                    toAddress.street2,
                    toAddress.street3,
                  ],
                  City: toAddress.city,
                  StateProvinceCode: toAddress.state,
                  PostalCode: toAddress.zip,
                  CountryCode: toAddress.country,
                },
              },
              ShipFrom: {
                Name: "Indon Chung",
                AttentionName: "Indon Chung",
                CompanyDisplayableName: "ROM America",
                Address: {
                  AddressLine: ["9832 NE 26th Street"],
                  City: "Bellevue",
                  StateProvinceCode: "WA",
                  PostalCode: "98004",
                  CountryCode: "US",
                },
              },
              PaymentInformation: {
                ShipmentCharge: {
                  Type: "01",
                  BillShipper: { AccountNumber: "K04212" },
                },
              },
              Service: {
                Code: values.serviceCode,
                Description: "Ground",
              },
              Package: {
                Description: " ",
                Packaging: {
                  Code: "02",
                  Description: "",
                },
                Dimensions: {
                  UnitOfMeasurement: {
                    Code: "IN",
                    Description: "Inches",
                  },
                  Length: values.length.toString(),
                  Width: values.width.toString(),
                  Height: values.height.toString(),
                },
                PackageWeight: {
                  UnitOfMeasurement: {
                    Code: "LBS",
                    Description: "Pounds",
                  },
                  Weight: values.weight.toString(),
                },
              },
              LabelSpecification: {
                LabelImageFormat: {
                  Code: "GIF",
                  Description: "GIF",
                },
                // HTTPUserAgent: "Mozilla/4.5",
              },
            },
          },
        }),
      }
    );

    const data = await resp.json();
    return data;
  } catch (error) {
    console.error(
      "An error occurred while getting the UPS Shipment Rate:",
      error
    );
  }
};
