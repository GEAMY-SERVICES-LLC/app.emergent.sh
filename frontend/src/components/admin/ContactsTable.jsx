import { Envelope, Eye, Trash } from "@phosphor-icons/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUS_COLORS = {
  new: "text-[#00d4ff] bg-[#00d4ff]/10 border-[#00d4ff]/30",
  in_progress: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  completed: "text-[#00ff88] bg-[#00ff88]/10 border-[#00ff88]/30",
  closed: "text-gray-400 bg-gray-400/10 border-gray-400/30",
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ContactRow = ({ contact, onView, onDelete }) => (
  <TableRow
    className="border-white/10 hover:bg-white/5"
    data-testid={`contact-row-${contact.id}`}
  >
    <TableCell className="font-mono text-sm text-gray-400">
      {formatDate(contact.created_at)}
    </TableCell>
    <TableCell className="font-mono text-sm text-white">
      {contact.name}
    </TableCell>
    <TableCell className="font-mono text-sm text-gray-400">
      {contact.email}
    </TableCell>
    <TableCell className="font-mono text-sm text-gray-400">
      {contact.service}
    </TableCell>
    <TableCell>
      <span
        className={`font-mono text-xs px-2 py-1 border ${
          STATUS_COLORS[contact.status] || STATUS_COLORS.closed
        }`}
      >
        {contact.status.replace("_", " ")}
      </span>
    </TableCell>
    <TableCell>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onView(contact)}
          className="p-2 hover:bg-white/10 rounded transition-colors"
          title="View"
          data-testid={`view-contact-${contact.id}`}
        >
          <Eye size={18} className="text-[#00d4ff]" />
        </button>
        <button
          onClick={() => onDelete(contact.id)}
          className="p-2 hover:bg-white/10 rounded transition-colors"
          title="Delete"
          data-testid={`delete-contact-${contact.id}`}
        >
          <Trash size={18} className="text-red-400" />
        </button>
      </div>
    </TableCell>
  </TableRow>
);

const ContactsTable = ({
  contacts,
  isLoading,
  statusFilter,
  onStatusFilterChange,
  onViewContact,
  onDeleteContact,
}) => {
  return (
    <div className="glass-panel p-6" data-testid="contacts-table-container">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl font-semibold text-white">
          Contact Submissions
        </h2>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-40 bg-transparent border-white/10 text-white font-mono text-sm">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-[#0a1120] border-white/10">
            <SelectItem value="all" className="font-mono text-gray-300">
              All Status
            </SelectItem>
            <SelectItem value="new" className="font-mono text-gray-300">
              New
            </SelectItem>
            <SelectItem value="in_progress" className="font-mono text-gray-300">
              In Progress
            </SelectItem>
            <SelectItem value="completed" className="font-mono text-gray-300">
              Completed
            </SelectItem>
            <SelectItem value="closed" className="font-mono text-gray-300">
              Closed
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="font-mono text-gray-400">Loading...</div>
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-12">
          <Envelope size={48} weight="thin" className="text-gray-600 mx-auto mb-4" />
          <div className="font-mono text-gray-400">No contacts found</div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="font-mono text-xs uppercase text-gray-500">Date</TableHead>
                <TableHead className="font-mono text-xs uppercase text-gray-500">Name</TableHead>
                <TableHead className="font-mono text-xs uppercase text-gray-500">Email</TableHead>
                <TableHead className="font-mono text-xs uppercase text-gray-500">Service</TableHead>
                <TableHead className="font-mono text-xs uppercase text-gray-500">Status</TableHead>
                <TableHead className="font-mono text-xs uppercase text-gray-500">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <ContactRow
                  key={contact.id}
                  contact={contact}
                  onView={onViewContact}
                  onDelete={onDeleteContact}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ContactsTable;
