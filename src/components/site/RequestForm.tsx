import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { FormField } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const COLUMN_FIELDS = new Set(["contact_name", "contact_email", "contact_phone", "company_name", "location"]);

type Props = {
  requestType: string;
  serviceName: string;
  title: string;
  description?: string | undefined;
  note?: string | undefined;
  fields: FormField[];
  submitLabel?: string | undefined;
};

function labelOf(fields: FormField[], name: string) {
  return fields.find((f) => f.name === name)?.label ?? name;
}

export function RequestForm({
  requestType,
  serviceName,
  title,
  description,
  note,
  fields,
  submitLabel = "Submit request",
}: Props) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  const set = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const validate = () => {
    const next: Record<string, string> = {};
    for (const field of fields) {
      const raw = (values[field.name] ?? "").trim();
      if (field.required && !raw) {
        next[field.name] = `${field.label} is required`;
        continue;
      }
      if (!raw) continue;
      if (raw.length > 2000) next[field.name] = `${field.label} is too long`;
      if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(raw)) {
        next[field.name] = "Enter a valid email address";
      }
      if (field.type === "tel" && raw.replace(/[^\d]/g, "").length < 7) {
        next[field.name] = "Enter a valid phone number";
      }
      if (field.type === "number" && Number.isNaN(Number(raw))) {
        next[field.name] = "Enter a number";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      toast.error("Please check the highlighted fields.");
      return;
    }
    setSubmitting(true);
    try {
      const details: Record<string, string> = {};
      for (const field of fields) {
        if (COLUMN_FIELDS.has(field.name)) continue;
        const raw = (values[field.name] ?? "").trim();
        if (raw) details[field.label] = raw;
      }

      const optional: Record<string, string> = {};
      const phone = (values["contact_phone"] ?? "").trim();
      const company = (values["company_name"] ?? "").trim();
      const location = (values["location"] ?? "").trim();
      if (phone) optional["p_contact_phone"] = phone;
      if (company) optional["p_company_name"] = company;
      if (location) optional["p_location"] = location;

      const { data, error } = await supabase.rpc("submit_service_request", {
        p_request_type: requestType,
        p_service_name: serviceName,
        p_contact_name: (values["contact_name"] ?? "").trim(),
        p_contact_email: (values["contact_email"] ?? "").trim(),
        p_details: details,
        ...optional,
      });


      if (error) throw error;
      setReference(data as string);
      toast.success(`Request submitted — reference ${data as string}`);

    } catch (error) {
      console.error(error);
      toast.error("We could not submit your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (reference) {
    return (
      <Card className="border-brand-green/40 card-elevated">
        <CardHeader>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-6 text-brand-green" />
            <CardTitle className="text-xl">Request received</CardTitle>
          </div>
          <CardDescription>
            Thank you. Your {serviceName} request has been recorded and our team will be in touch.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-surface p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your request ID</p>
            <div className="mt-1 flex items-center gap-3">
              <p className="font-display text-2xl font-bold text-brand">{reference}</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  void navigator.clipboard?.writeText(reference);
                  toast.success("Reference copied");
                }}
              >
                <Copy className="size-4" />
                Copy
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Keep this reference for follow-up. Sign in to track the status of all your requests in your account
            dashboard.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/account">Go to my dashboard</Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setReference(null);
                setValues({});
              }}
            >
              Submit another request
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        {note ? (
          <p className="mb-6 rounded-lg border border-brand-green/30 bg-brand-green-soft/60 p-4 text-sm leading-relaxed text-foreground">
            {note}
          </p>
        ) : null}
        <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2" noValidate>
          {fields.map((field) => {
            const isWide = field.type === "textarea";
            const id = `${requestType}-${field.name}`;
            return (
              <div key={field.name} className={isWide ? "sm:col-span-2" : undefined}>
                <Label htmlFor={id} className="mb-2 block">
                  {field.label}
                  {field.required ? <span className="ml-1 text-destructive">*</span> : null}
                </Label>

                {field.type === "select" ? (
                  <Select value={values[field.name] ?? ""} onValueChange={(v) => set(field.name, v)}>
                    <SelectTrigger id={id}>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {(field.options ?? []).map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : field.type === "textarea" ? (
                  <Textarea
                    id={id}
                    rows={4}
                    maxLength={2000}
                    value={values[field.name] ?? ""}
                    onChange={(e) => set(field.name, e.target.value)}
                    placeholder={field.placeholder}
                  />
                ) : (
                  <Input
                    id={id}
                    type={field.type}
                    maxLength={field.type === "number" ? undefined : 255}
                    value={values[field.name] ?? ""}
                    onChange={(e) => set(field.name, e.target.value)}
                    placeholder={field.placeholder}
                  />
                )}

                {errors[field.name] ? (
                  <p className="mt-1.5 text-xs font-medium text-destructive">{errors[field.name]}</p>
                ) : field.help ? (
                  <p className="mt-1.5 text-xs text-muted-foreground">{field.help}</p>
                ) : null}
              </div>
            );
          })}

          <div className="sm:col-span-2">
            <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
              {submitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              {submitting ? "Submitting…" : submitLabel}
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              We use your {labelOf(fields, "contact_email").toLowerCase()} and phone number only to respond to this
              request. No payment is taken on this website.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
