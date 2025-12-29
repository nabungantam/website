"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const WHATSAPP_NUMBER = "6287783791588";
const WEIGHT_OPTIONS = ["1", "3", "5", "10", "25", "50"] as const;
const YEAR_OPTIONS = [
  "2020",
  "2021",
  "2022",
  "2023",
  "2024",
  "2025",
  "2026",
] as const;

const isValidOption = (value: string, options: readonly string[]) =>
  options.includes(value);

const formSchema = z.object({
  weight: z
    .string()
    .min(1, "Pilih produk yang tersedia.")
    .refine((value) => isValidOption(value, WEIGHT_OPTIONS), {
      message: "Pilih produk yang tersedia.",
    }),
  year: z
    .string()
    .min(1, "Pilih tahun.")
    .refine((value) => isValidOption(value, YEAR_OPTIONS), {
      message: "Pilih tahun.",
    }),
  quantity: z.number().min(1, "Jumlah minimal 1.").max(999, "Jumlah terlalu besar."),
});

export function NabungAntamOrderForm() {
  const [orderType, setOrderType] = React.useState<"jual" | "beli" | null>(
    null
  );
  const form = useForm({
    defaultValues: {
      weight: "3",
      year: "2024",
      quantity: 1,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      if (!orderType) {
        toast("Pilih Jual atau Beli dulu.");
        return;
      }

      toast("You submitted the following values:", {
        description: (
          <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
            <code>{JSON.stringify(value, null, 2)}</code>
          </pre>
        ),
        position: "bottom-right",
        classNames: {
          content: "flex flex-col gap-2",
        },
        style: {
          "--border-radius": "calc(var(--radius)  + 4px)",
        } as React.CSSProperties,
      });

      const message = [
        `Halo kak, Mau tanya stok & harga LM ANTAM hari ini ya \u{1F60A}`,
        "",
        `Transaksi: ${orderType === "jual" ? "Jual LM Antam" : "Beli LM Antam"}`,
        `Produk: ${value.weight} gram`,
        `Tahun: ${value.year}`,
        `Jumlah: ${value.quantity}`,
        "",
        "Terima kasih \u{1F64F}",
      ].join("\n");

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        message
      )}`;
      window.location.href = url;
    },
  });

  return (
    <Card className="w-full border-[#2A2A2A] bg-[#0B0B0B] text-[#F6F1E6] shadow-lg">
      <CardHeader>
        <CardTitle>Form cek Stok & Harga Buyback</CardTitle>
        {/* <CardDescription className="text-[#A1A1AA]">
          Pilih Jual atau Beli dulu. Setelah itu isi produk, tahun, dan jumlah.
        </CardDescription> */}
      </CardHeader>
      <CardContent>
        {!orderType ? (
          <div className="flex min-h-[220px] flex-col justify-center gap-4">
            <div className="mx-auto flex w-full max-w-[240px] flex-col gap-5">
              <Button
                type="button"
                onClick={() => setOrderType("beli")}
                className="w-full cursor-pointer bg-[#C8A848] text-black hover:bg-[#F0E078]"
              >
                Beli LM Antam
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setOrderType("jual")}
                className="w-full cursor-pointer border-[#C8A848] bg-transparent text-[#C8A848] hover:bg-[#1A1A1A] hover:text-[#F6F1E6]"
              >
                Jual LM Antam
              </Button>
            </div>
            <p className="text-center text-xs text-[#A1A1AA]">
              Pilih Jenis Transaksi untuk lanjut isi form.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between rounded-lg border border-[#2A2A2A] bg-[#101010] px-3 py-2 text-sm text-[#A1A1AA]">
              <span>
                Jenis Transaksi:{" "}
                <span className="font-semibold text-[#F6F1E6]">
                  {orderType === "jual" ? "Jual LM Antam" : "Beli LM Antam"}
                </span>
              </span>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOrderType(null)}
                className="h-auto cursor-pointer px-2 text-xs text-[#C8A848] hover:text-[#F0E078]"
              >
                Ganti
              </Button>
            </div>
            <form
              id="nabungantam-order-form"
              onSubmit={(event) => {
                event.preventDefault();
                form.handleSubmit();
              }}
            >
              <FieldGroup>
                <div className="grid gap-4 sm:grid-cols-2">
                  <form.Field
                    name="weight"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor="order-form-weight">
                            Produk
                          </FieldLabel>
                          <Select
                            name={field.name}
                            value={field.state.value}
                            onValueChange={field.handleChange}
                          >
                            <SelectTrigger
                              id="order-form-weight"
                              aria-invalid={isInvalid}
                              className="border-[#2A2A2A] bg-[#101010] text-[#F6F1E6]"
                            >
                              <SelectValue placeholder="Pilih produk" />
                            </SelectTrigger>
                            <SelectContent className="border-[#2A2A2A] bg-[#0B0B0B] text-[#F6F1E6]">
                              {WEIGHT_OPTIONS.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option} gram
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                  <form.Field
                    name="year"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor="order-form-year">
                            Tahun
                          </FieldLabel>
                          <Select
                            name={field.name}
                            value={field.state.value}
                            onValueChange={field.handleChange}
                          >
                            <SelectTrigger
                              id="order-form-year"
                              aria-invalid={isInvalid}
                              className="border-[#2A2A2A] bg-[#101010] text-[#F6F1E6]"
                            >
                              <SelectValue placeholder="Pilih tahun" />
                            </SelectTrigger>
                            <SelectContent className="border-[#2A2A2A] bg-[#0B0B0B] text-[#F6F1E6]">
                              {YEAR_OPTIONS.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                </div>
                <form.Field
                  name="quantity"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor="order-form-quantity">
                          Jumlah
                        </FieldLabel>
                        <Input
                          id="order-form-quantity"
                          name={field.name}
                          type="number"
                          min={1}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(Number(event.target.value || 0))
                          }
                          aria-invalid={isInvalid}
                          className="border-[#2A2A2A] bg-[#101010] text-[#F6F1E6]"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
              </FieldGroup>
            </form>
          </>
        )}
      </CardContent>
      {orderType ? (
        <CardFooter>
          <Field orientation="vertical">
            <Button
              type="submit"
              form="nabungantam-order-form"
              className="cursor-pointer bg-[#C8A848] text-black hover:bg-[#F0E078]"
            >
              Tanya Admin YUK
            </Button>
          </Field>
        </CardFooter>
      ) : null}
    </Card>
  );
}
