import { SignOut } from "@phosphor-icons/react";

const AdminHeader = ({ email, onLogout }) => {
  return (
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
          <span className="font-mono text-sm text-gray-400">{email}</span>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 font-mono text-sm text-gray-400 hover:text-[#00d4ff] transition-colors"
            data-testid="admin-logout"
          >
            <SignOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
