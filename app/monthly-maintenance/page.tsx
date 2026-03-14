import MonthlyMaintenanceForm from '@/components/forms/MonthlyMaintenanceForm';

export const metadata = {
  title: "Keep Your Site Running — I'll Handle It | Alex Web Xprt",
  description: "Quick setup form. Takes about 5 minutes.",
};

export default function MonthlyMaintenancePage() {
  return (
    <main>
      <MonthlyMaintenanceForm />
    </main>
  );
}
