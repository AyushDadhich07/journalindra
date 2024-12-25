import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EntryFilterProps {
  onFilterChange: (value: string) => void;
}

export const EntryFilter = ({ onFilterChange }: EntryFilterProps) => {
  return (
    <div className="mb-6">
      <Select onValueChange={onFilterChange} defaultValue="all">
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filter by date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Entries</SelectItem>
          <SelectItem value="week">This Week</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
          <SelectItem value="year">This Year</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};