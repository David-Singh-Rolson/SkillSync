import { StudentDashboard } from "@/components/student-dashboard"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <StudentDashboard />
    </main>
  );
}
