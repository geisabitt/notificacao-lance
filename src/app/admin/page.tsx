"use client";
import { useEffect, useState } from "react";
import { ArrowLeft, Goal, Zap, Volleyball } from "lucide-react";
import { useRouter } from "next/navigation";
import EnableNotifications from "@/components/EnableNotifications";

type EventItem = {
  id: number;
  action: string;
  timestamp: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        if (!res.ok) throw new Error("Erro ao carregar eventos");
        const data: EventItem[] = await res.json();
        setEvents(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const groupedEvents = events.reduce(
    (acc: Record<string, EventItem[]>, event) => {
      const date = new Date(event.timestamp).toLocaleDateString("pt-BR");
      if (!acc[date]) acc[date] = [];
      acc[date].push(event);
      return acc;
    },
    {}
  );

  const getIcon = (action: string) => {
    switch (action) {
      case "Gol":
        return <Goal className="text-green-500" size={28} />;
      case "Drible":
        return <Zap className="text-blue-500" size={28} />;
      case "Lencol":
        return <Volleyball className="text-red-500" size={28} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-600">
        <p className="text-xl">Carregando eventos...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 p-6">
      <EnableNotifications />
      {/* Topbar */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-300">
          Área Administrativa
        </h1>
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          <ArrowLeft size={20} /> Voltar
        </button>
      </div>

      {Object.keys(groupedEvents).length === 0 ? (
        <p className="text-gray-200 text-lg">Nenhum evento registrado ainda.</p>
      ) : (
        Object.keys(groupedEvents)
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
          .map((date) => (
            <div key={date} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-200 mb-4">
                {date} ({groupedEvents[date].length} ações)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedEvents[date].map((event) => (
                  <div
                    key={event.id}
                    className="bg-gray-800 rounded-xl shadow-md p-4 flex items-center gap-4"
                  >
                    {getIcon(event.action)}
                    <div>
                      <p className="text-lg text-gray-300 font-bold">
                        {event.action}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {new Date(event.timestamp).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
      )}
    </main>
  );
}
