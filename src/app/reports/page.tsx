import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";

const reports = [
  { type: "shop", label: "Shop Wise Report" },
  { type: "invoice", label: "Invoice Report" },
  { type: "payment", label: "Payment Report" },
  { type: "outstanding", label: "Outstanding Report" },
  { type: "garment", label: "Garment Report" },
  { type: "daily-closing", label: "Daily Closing Report" },
  { type: "monthly-closing", label: "Monthly Closing Report" }
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Generate PDF reports for operations and accounting."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {reports.map((report) => (
          <Card key={report.type} className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{report.label}</p>
              <p className="text-sm text-muted-foreground">
                Export the latest {report.label.toLowerCase()}.
              </p>
            </div>
            <a
              className="text-sm font-semibold text-primary"
              href={`/api/reports/${report.type}`}
            >
              Download
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
}
