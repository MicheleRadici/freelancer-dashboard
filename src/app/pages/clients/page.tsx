import { RequireRole } from "@/components/auth/RequireRole";
import FreelancerClientsContent from "@/components/freelancer/FreelancerClientsContent";

export default function FreelancerClientsPage() {
  return (
    <RequireRole allowedRoles={["freelancer"]}>
      <FreelancerClientsContent />
    </RequireRole>
  );
}
