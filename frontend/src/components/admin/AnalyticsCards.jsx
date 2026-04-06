import { Users, Clock, Envelope, ChartBar } from "@phosphor-icons/react";

const AnalyticsCards = ({ analytics }) => {
  const cards = [
    {
      icon: Users,
      value: analytics.total_contacts,
      label: "Total Contacts",
      color: "text-[#00d4ff]",
    },
    {
      icon: Clock,
      value: analytics.recent_contacts,
      label: "Last 7 Days",
      color: "text-[#00ff88]",
    },
    {
      icon: Envelope,
      value: analytics.contacts_by_status?.new || 0,
      label: "New Messages",
      color: "text-yellow-400",
    },
    {
      icon: ChartBar,
      value: analytics.page_views,
      label: "Page Views",
      color: "text-purple-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" data-testid="analytics-cards">
      {cards.map((card) => (
        <div key={card.label} className="glass-panel p-6">
          <card.icon size={24} weight="thin" className={`${card.color} mb-2`} />
          <div className="font-heading text-3xl font-bold text-white">
            {card.value}
          </div>
          <div className="font-mono text-xs text-gray-500 uppercase tracking-wider mt-1">
            {card.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsCards;
