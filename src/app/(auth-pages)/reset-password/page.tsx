import { resetPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: Promise<Message>;
}) {
  const message = await searchParams;

  return (
    <form className="flex-1 flex flex-col w-full gap-2 text-foreground [&>input]:mb-6 min-w-64 max-w-64 mx-auto">
      <div>
        <h1 className="text-2xl font-medium">Set New Password</h1>
        <p className="text-sm text-secondary-foreground">
          Enter your new password below.
        </p>
      </div>
      
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="password">New Password</Label>
        <Input
          name="password"
          type="password"
          placeholder="••••••••"
          required
          minLength={6}
        />
        
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          required
          minLength={6}
        />
        
        <SubmitButton formAction={resetPasswordAction}>
          Update Password
        </SubmitButton>
        
        <FormMessage message={message} />
      </div>
    </form>
  );
} 