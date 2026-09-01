import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Gauge, Loader2, ShieldCheck, Thermometer, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { APP_NAME } from "@/lib/constants";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — ThermaGuard IoT Temperature Monitoring" },
      {
        name: "description",
        content:
          "Sign in to ThermaGuard to monitor room temperature and control cooling fans for vulnerable residents.",
      },
      { property: "og:title", content: "Sign in — ThermaGuard IoT Temperature Monitoring" },
      { property: "og:description", content: "Sign in to ThermaGuard to monitor room temperature and control cooling fans for vulnerable residents." },
    ],
  }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean(),
});

function LoginPage() {
  const { loginMutation, isAuthenticated } = useAuth();
  const hydrated = true;
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated && isAuthenticated) navigate({ to: "/dashboard", replace: true });
  }, [hydrated, isAuthenticated, navigate]);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", remember: true },
  });

  return (
    <div className="grid min-h-svh bg-background lg:grid-cols-2">
      <section className="relative hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <div className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-foreground/15">
            <Gauge className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold">{APP_NAME}</span>
        </div>
        <div className="space-y-5">
          <h2 className="max-w-md text-3xl font-semibold leading-tight">
            Keep every room safe for children and elderly residents.
          </h2>
          <p className="max-w-md text-sm text-primary-foreground/80">
            Live sensor readings, automatic fan control and instant alerts when a room gets too hot or too cold.
          </p>
          <ul className="space-y-3 text-sm text-primary-foreground/90">
            <li className="flex items-center gap-2">
              <Thermometer className="h-4 w-4" /> Real-time temperature monitoring
            </li>
            <li className="flex items-center gap-2">
              <Wifi className="h-4 w-4" /> Device health & connectivity checks
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Threshold-based automatic cooling
            </li>
          </ul>
        </div>
        <p className="text-xs text-primary-foreground/70">© {new Date().getFullYear()} ThermaGuard IoT</p>
      </section>

      <section className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md rounded-2xl shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="text-2xl">Sign in</CardTitle>
            <CardDescription>Caregiver access to the monitoring dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                className="space-y-5"
                onSubmit={form.handleSubmit((values) => loginMutation.mutate(values))}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" autoComplete="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" autoComplete="current-password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="remember"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-2 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={(v) => field.onChange(Boolean(v))} />
                      </FormControl>
                      <FormLabel className="font-normal">Remember this device</FormLabel>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                  {loginMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Sign in
                </Button>

              </form>
            </Form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
