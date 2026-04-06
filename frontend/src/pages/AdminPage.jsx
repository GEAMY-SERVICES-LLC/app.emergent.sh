import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import {
  SignOut,
  Envelope,
  ChartBar,
  Users,
  Eye,
  Trash,
  Check,
  Clock,
  X,
  ArrowLeft,
} from "@phosphor-icons/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const getAuthHeader = () => {
    const token = localStorage.getItem("adminToken");
    return { Authorization: `Bearer ${token}` };
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchData();
  }, [navigate, statusFilter]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [contactsRes, analyticsRes] = await Promise.all([
        axios.get(`${API}/admin/contacts`, {
          headers: getAuthHeader(),
          params: statusFilter !== "all" ? { status_filter: statusFilter } : {},
        }),
        axios.get(`${API}/admin/analytics/summary`, {
          headers: getAuthHeader(),
        }),
      ]);
      setContacts(contactsRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error("Fetch error:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    navigate("/admin/login");
  };

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setIsDialogOpen(true);
  };

  const handleUpdateStatus = async (contactId, newStatus) => {
    try {
      await axios.patch(
        `${API}/admin/contacts/${contactId}`,
        { status: newStatus },
        { headers: getAuthHeader() }
      );
      toast.success("Status updated");
      fetchData();
      if (selectedContact?.id === contactId) {
        setSelectedContact((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;

    try {
      await axios.delete(`${API}/admin/contacts/${contactId}`, {
        headers: getAuthHeader(),
      });
      toast.success("Contact deleted");
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to delete contact");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "text-[#00d4ff] bg-[#00d4ff]/10 border-[#00d4ff]/30";
      case "in_progress":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
      case "completed":
        return "text-[#00ff88] bg-[#00ff88]/10 border-[#00ff88]/30";
      case "closed":
        return "text-gray-400 bg-gray-400/10 border-gray-400/30";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/30";
    }
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

  return (
    <div className="min-h-screen bg-[#040810] grid-texture">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-xl bg-[#040810]/90 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="font-heading text-xl font-bold text-white tracking-tight"
            >
              GEAMY<span className="text-[#00d4ff]">.</span>
            </a>
            <span className="font-mono text-xs text-gray-500 uppercase tracking-wider">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-sm text-gray-400">
              {localStorage.getItem("adminEmail")}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 font-mono text-sm text-gray-400 hover:text-[#00d4ff] transition-colors"
              data-testid="admin-logout"
            >
              <SignOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Back to Website */}
        <a
          href="/"
          className="inline-flex items-center gap-2 font-mono text-sm text-gray-400 hover:text-[#00d4ff] transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to Website
        </a>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" data-testid="analytics-cards">
            <div className="glass-panel p-6">
              <Users size={24} weight="thin" className="text-[#00d4ff] mb-2" />
              <div className="font-heading text-3xl font-bold text-white">
                {analytics.total_contacts}
              </div>
              <div className="font-mono text-xs text-gray-500 uppercase tracking-wider mt-1">
                Total Contacts
              </div>
            </div>

            <div className="glass-panel p-6">
              <Clock size={24} weight="thin" className="text-[#00ff88] mb-2" />
              <div className="font-heading text-3xl font-bold text-white">
                {analytics.recent_contacts}
              </div>
              <div className="font-mono text-xs text-gray-500 uppercase tracking-wider mt-1">
                Last 7 Days
              </div>
            </div>

            <div className="glass-panel p-6">
              <Envelope size={24} weight="thin" className="text-yellow-400 mb-2" />
              <div className="font-heading text-3xl font-bold text-white">
                {analytics.contacts_by_status?.new || 0}
              </div>
              <div className="font-mono text-xs text-gray-500 uppercase tracking-wider mt-1">
                New Messages
              </div>
            </div>

            <div className="glass-panel p-6">
              <ChartBar size={24} weight="thin" className="text-purple-400 mb-2" />
              <div className="font-heading text-3xl font-bold text-white">
                {analytics.page_views}
              </div>
              <div className="font-mono text-xs text-gray-500 uppercase tracking-wider mt-1">
                Page Views
              </div>
            </div>
          </div>
        )}

        {/* Contacts Table */}
        <div className="glass-panel p-6" data-testid="contacts-table-container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-xl font-semibold text-white">
              Contact Submissions
            </h2>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                    <TableHead className="font-mono text-xs uppercase text-gray-500">
                      Date
                    </TableHead>
                    <TableHead className="font-mono text-xs uppercase text-gray-500">
                      Name
                    </TableHead>
                    <TableHead className="font-mono text-xs uppercase text-gray-500">
                      Email
                    </TableHead>
                    <TableHead className="font-mono text-xs uppercase text-gray-500">
                      Service
                    </TableHead>
                    <TableHead className="font-mono text-xs uppercase text-gray-500">
                      Status
                    </TableHead>
                    <TableHead className="font-mono text-xs uppercase text-gray-500">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow
                      key={contact.id}
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
                          className={`font-mono text-xs px-2 py-1 border ${getStatusColor(
                            contact.status
                          )}`}
                        >
                          {contact.status.replace("_", " ")}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewContact(contact)}
                            className="p-2 hover:bg-white/10 rounded transition-colors"
                            title="View"
                            data-testid={`view-contact-${contact.id}`}
                          >
                            <Eye size={18} className="text-[#00d4ff]" />
                          </button>
                          <button
                            onClick={() => handleDeleteContact(contact.id)}
                            className="p-2 hover:bg-white/10 rounded transition-colors"
                            title="Delete"
                            data-testid={`delete-contact-${contact.id}`}
                          >
                            <Trash size={18} className="text-red-400" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>

      {/* Contact Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#0a1120] border-white/10 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl text-white">
              Contact Details
            </DialogTitle>
          </DialogHeader>

          {selectedContact && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Name
                  </div>
                  <div className="font-mono text-white">{selectedContact.name}</div>
                </div>
                <div>
                  <div className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Email
                  </div>
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="font-mono text-[#00d4ff] hover:underline"
                  >
                    {selectedContact.email}
                  </a>
                </div>
                <div>
                  <div className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Phone
                  </div>
                  <div className="font-mono text-white">
                    {selectedContact.phone || "Not provided"}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Service
                  </div>
                  <div className="font-mono text-white">{selectedContact.service}</div>
                </div>
                <div>
                  <div className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Date
                  </div>
                  <div className="font-mono text-gray-400">
                    {formatDate(selectedContact.created_at)}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Email Sent
                  </div>
                  <div className="font-mono">
                    {selectedContact.email_sent ? (
                      <span className="text-[#00ff88]">Yes</span>
                    ) : (
                      <span className="text-yellow-400">No</span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-2">
                  Message
                </div>
                <div className="font-mono text-gray-300 bg-white/5 p-4 border border-white/10 whitespace-pre-wrap">
                  {selectedContact.message}
                </div>
              </div>

              <div>
                <div className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-2">
                  Update Status
                </div>
                <div className="flex gap-2">
                  {["new", "in_progress", "completed", "closed"].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(selectedContact.id, status)}
                      className={`font-mono text-xs px-3 py-2 border transition-colors ${
                        selectedContact.status === status
                          ? getStatusColor(status)
                          : "border-white/10 text-gray-400 hover:border-white/30"
                      }`}
                    >
                      {status.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
