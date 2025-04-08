
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function NotesSection() {
  return (
    <div className="space-y-3">
      <Label htmlFor="notes">Notes</Label>
      <Input
        id="notes"
        placeholder="Ajouter des notes ou des conditions particulières"
      />
    </div>
  );
}
