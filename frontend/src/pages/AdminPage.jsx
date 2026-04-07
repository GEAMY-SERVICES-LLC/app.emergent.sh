import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { ArrowLeft } from "@phosphor-icons/react";
import AdminHeader from "@/components/admin/AdminHeader";
import AnalyticsCards from "@/components/admin/AnalyticsCards";
import ContactsTable from "@/components/admin/ContactsTable";
import ContactDetailDialog from "@/components/admin/ContactDetailDialog";

import { API_BASE as API } from '@/utils/apiConfig';

const AdminPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [contactsRes, analyticsRes] = await Promise.all([
        axios.get(`${API}/admin/contacts`, {
          withCredentials: true,
          params: statusFilter !== "all" ? { status_filter: statusFilter } : {},
        }),
        axios.get(`${API}/admin/analytics/summary`, {
          withCredentials: true,
        }),
      ]);
      setContacts(contactsRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error("Fetch error:", error);
      if (error.response?.status === 401) {
        sessionStorage.removeItem("adminEmail");
        navigate("/admin/login");
      }
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, navigate]);

  useEffect(() => {
    const email = sessionStorage.getItem("adminEmail");
    if (!email) {
      navigate("/admin/login");
      return;
    }
    fetchData();
  }, [fetchData, navigate]);

  const handleLogout = useCallback(async () => {
    try {
      await axios.post(`${API}/admin/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
    sessionStorage.removeItem("adminEmail");
    navigate("/admin/login");
  }, [navigate]);

  const handleViewContact = useCallback((contact) => {
    setSelectedContact(contact);
    setIsDialogOpen(true);
  }, []);

  const handleUpdateStatus = useCallback(async (contactId, newStatus) => {
    try {
      await axios.patch(
        `${API}/admin/contacts/${contactId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      toast.success("Status updated");
      fetchData();
      setSelectedContact((prev) => 
        prev?.id === contactId ? { ...prev, status: newStatus } : prev
      );
    } catch (error) {
      toast.error("Failed to update status");
    }
  }, [fetchData]);

  const handleDeleteContact = useCallback(async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;

    try {
      await axios.delete(`${API}/admin/contacts/${contactId}`, {
        withCredentials: true,
      });
      toast.success("Contact deleted");
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to delete contact");
    }
  }, [fetchData]);

  const adminEmail = sessionStorage.getItem("adminEmail");

  return (
    <div className="min-h-screen bg-[#040810] grid-texture">
      <AdminHeader email={adminEmail} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <a
          href="/"
          className="inline-flex items-center gap-2 font-mono text-sm text-gray-400 hover:text-[#00d4ff] transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to Website
        </a>

        {analytics && <AnalyticsCards analytics={analytics} />}

        <ContactsTable
          contacts={contacts}
          isLoading={isLoading}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onViewContact={handleViewContact}
          onDeleteContact={handleDeleteContact}
        />
      </main>

      <ContactDetailDialog
        contact={selectedContact}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default AdminPage;
