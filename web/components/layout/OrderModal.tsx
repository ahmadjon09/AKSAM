// Shared order modal.
// Opens from the header CTA or any "Order" button on the site.
// Supports optional product context and submits the order to the API.

"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
  FieldWrap,
  TextArea,
  TextInput,
} from "@/components/ui/Field";

import { submitOrder } from "@/lib/api";
import { useUiStore } from "@/lib/store/ui";
import {
  isValidPhone,
  normalizePhone,
} from "@/lib/utils";

import type { Lang } from "@/lib/types";

export function OrderModal({ lang }: { lang: Lang }) {
  const { t } = useTranslation();

  const open = useUiStore((state) => state.orderModalOpen);
  const product = useUiStore((state) => state.orderProduct);
  const closeOrder = useUiStore((state) => state.closeOrder);
  const pushToast = useUiStore((state) => state.pushToast);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
  }>({});

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const reset = useCallback(() => {
    setName("");
    setPhone("");
    setMessage("");
    setErrors({});
    setSubmitting(false);
    setDone(false);
  }, []);

  // Reset success state whenever modal closes.
  useEffect(() => {
    if (!open) {
      setDone(false);
    }
  }, [open]);

  const close = useCallback(() => {
    if (submitting) return;

    closeOrder();

    setTimeout(() => {
      reset();
    }, 250);
  }, [submitting, closeOrder, reset]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: {
      name?: string;
      phone?: string;
    } = {};

    if (name.trim().length < 2) {
      nextErrors.name = t("orderForm.nameError");
    }

    if (!isValidPhone(phone)) {
      nextErrors.phone = t("orderForm.phoneError");
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      await submitOrder({
        fullName: name.trim(),
        phone: normalizePhone(phone),
        message: message.trim() || undefined,

        // Optional product context
        productSlug: product?.slug,
        productName: product?.name,

        lang,
      });

      setDone(true);

      pushToast({
        kind: "success",
        title: t("orderForm.successTitle"),
        description: t("orderForm.successText"),
      });

      // Close after success.
      setTimeout(() => {
        close();
      }, 2600);
    } catch (error) {
      const apiError = error as {
        status?: number;
      };

      const errorMessage =
        apiError.status === 429
          ? t("errors.rateLimited")
          : t("errors.network");

      pushToast({
        kind: "error",
        title: t("errors.generic"),
        description: errorMessage,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      labelledBy="order-modal-title"
    >
      {done ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-5 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-emerald-100">
            <SuccessMark />
          </span>

          <div>
            <h2
              id="order-modal-title"
              className="text-2xl font-bold tracking-tight text-ink"
            >
              {t("orderForm.successTitle")}
            </h2>

            <p className="mt-2 text-sm text-ink/60">
              {t("orderForm.successText")}
            </p>
          </div>
        </div>
      ) : (
        <div>
          <h2
            id="order-modal-title"
            className="text-2xl font-bold tracking-tight text-ink"
          >
            {t("orderForm.title")}
          </h2>

          <p className="mt-1.5 text-sm text-ink/60">
            {t("orderForm.subtitle")}
          </p>

          {/* Product context */}
          {product && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink/5 px-4 py-1.5 text-[13px] font-medium text-ink">
              <span className="size-1.5 rounded-full bg-brand" />

              {t("orderForm.productLabel")}:{" "}
              {product.name}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-6 space-y-4"
          >
            <FieldWrap
              label={t("orderForm.name")}
              required
              error={errors.name}
            >
              <TextInput
                value={name}
                onChange={(event) => {
                  setName(event.target.value);

                  if (errors.name) {
                    setErrors((current) => ({
                      ...current,
                      name: undefined,
                    }));
                  }
                }}
                placeholder={t("orderForm.namePlaceholder")}
                autoComplete="name"
                invalid={!!errors.name}
                disabled={submitting}
              />
            </FieldWrap>

            <FieldWrap
              label={t("orderForm.phone")}
              required
              error={errors.phone}
            >
              <TextInput
                value={phone}
                onChange={(event) => {
                  setPhone(event.target.value);

                  if (errors.phone) {
                    setErrors((current) => ({
                      ...current,
                      phone: undefined,
                    }));
                  }
                }}
                placeholder={t("orderForm.phonePlaceholder")}
                inputMode="tel"
                autoComplete="tel"
                invalid={!!errors.phone}
                disabled={submitting}
              />
            </FieldWrap>

            <FieldWrap label={t("orderForm.message")}>
              <TextArea
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value);
                }}
                placeholder={t("orderForm.messagePlaceholder")}
                disabled={submitting}
              />
            </FieldWrap>

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={submitting}
            >
              {t("orderForm.submit")}
            </Button>

            <p className="text-center text-[12px] leading-relaxed text-ink/45">
              {t("orderForm.privacy")}
            </p>
          </form>
        </div>
      )}
    </Modal>
  );
}

function SuccessMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-7 text-emerald-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}