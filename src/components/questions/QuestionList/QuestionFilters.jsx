import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function QuestionFilters({
  groups,
  selectedGroup,
  selectedType,
  onGroupChange,
  onTypeChange,
}) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <Select onValueChange={onGroupChange} value={selectedGroup}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Filter by Group" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Groups</SelectItem>
          {groups.map((group) => (
            <SelectItem key={group.id} value={group.id}>
              {group.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={onTypeChange} value={selectedType}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Filter by Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="MCQ">MCQ</SelectItem>
          <SelectItem value="TEXT">TEXT</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
