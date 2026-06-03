import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage roles, authentication, and company settings."
      />
      <Card className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Roles are managed in Supabase. Assign Owner or Staff roles in the
          profiles table for each user.
        </p>
      </Card>
    </div>
  );
}
