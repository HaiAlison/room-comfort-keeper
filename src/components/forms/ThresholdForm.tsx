import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Threshold } from "@/lib/types";

const schema = z
  .object({
    min: z.coerce.number().min(-10, "Too low").max(50, "Too high"),
    max: z.coerce.number().min(-10, "Too low").max(60, "Too high"),
  })
  .refine((v) => v.min < v.max, {
    message: "Minimum must be lower than maximum",
    path: ["min"],
  });

export type ThresholdFormValues = z.infer<typeof schema>;

export function ThresholdForm({
  defaultValues,
  onSubmit,
  isSubmitting,
}: {
  defaultValues: Threshold;
  onSubmit: (values: Threshold) => void;
  isSubmitting: boolean;
}) {
  const form = useForm<ThresholdFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    form.reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues.min, defaultValues.max]);

  return (
    <Form {...form}>
      <form
        className="space-y-6"
        onSubmit={form.handleSubmit((values) => onSubmit({ min: values.min, max: values.max }))}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="min"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum temperature (°C)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.5" {...field} />
                </FormControl>
                <FormDescription>Alerts below this value.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="max"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum temperature (°C)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.5" {...field} />
                </FormControl>
                <FormDescription>Fan turns on above this value.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save threshold
        </Button>
      </form>
    </Form>
  );
}
