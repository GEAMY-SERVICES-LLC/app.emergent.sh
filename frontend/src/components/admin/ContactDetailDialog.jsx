import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const STATUS_COLORS = {
  new: "text-[#00d4ff] bg-[#00d4ff]/10 border-[#00d4ff]/30",
  in_progress: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  completed: "text-[#00ff88] bg-[#00ff88]/10 border-[#00ff88]/30",
  closed: "text-gray-400 bg-gray-400/10 border-gray-400/30",
};

const STATUSES = ["new", "in_progress", "completed", "closed"];

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ContactDetailDialog = ({ contact, isOpen, onOpenChange, onUpdateStatus }) => {
  if (!contact) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0a1120] border-white/10 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-white">
            Contact Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <DetailField label="Name" value={contact.name} />
            <DetailField 
              label="Email" 
              value={contact.email} 
              isLink 
              href={`mailto:${contact.email}`} 
            />
            <DetailField label="Phone" value={contact.phone || "Not provided"} />
            <DetailField label="Service" value={contact.service} />
            <DetailField label="Date" value={formatDate(contact.created_at)} muted />
            <DetailField 
              label="Email Sent" 
              value={contact.email_sent ? "Yes" : "No"} 
              valueColor={contact.email_sent ? "text-[#00ff88]" : "text-yellow-400"}
            />
          </div>

          <div>
            <div className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-2">
              Message
            </div>
            <div className="font-mono text-gray-300 bg-white/5 p-4 border border-white/10 whitespace-pre-wrap">
              {contact.message}
            </div>
          </div>

          <div>
            <div className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-2">
              Update Status
            </div>
            <div className="flex gap-2">
              {STATUSES.map((status) => (
                <button
                  key={status}
                  onClick={() => onUpdateStatus(contact.id, status)}
                  className={`font-mono text-xs px-3 py-2 border transition-colors ${
                    contact.status === status
                      ? STATUS_COLORS[status]
                      : "border-white/10 text-gray-400 hover:border-white/30"
                  }`}
                >
                  {status.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DetailField = ({ label, value, isLink, href, muted, valueColor }) => (
  <div>
    <div className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">
      {label}
    </div>
    {isLink ? (
      <a href={href} className="font-mono text-[#00d4ff] hover:underline">
        {value}
      </a>
    ) : (
      <div className={`font-mono ${valueColor || (muted ? "text-gray-400" : "text-white")}`}>
        {value}
      </div>
    )}
  </div>
);

export default ContactDetailDialog;
