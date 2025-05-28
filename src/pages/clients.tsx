import Layout from "@/components/layout";
import { useState } from "react";
import { Client } from "@/types/client";
import { v4 as uuidv4 } from "uuid";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [newClient, setNewClient] = useState({ name: "", email: "", company: "" });

  const handleAddClient = () => {
    if (!newClient.name || !newClient.email) return;
    const client: Client = { id: uuidv4(), ...newClient };
    setClients([...clients, client]);
    setNewClient({ name: "", email: "", company: "" });
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Clients</h1>

      <div className="mb-6">
        <input
          className="border p-2 mr-2"
          placeholder="Name"
          value={newClient.name}
          onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
        />
        <input
          className="border p-2 mr-2"
          placeholder="Email"
          value={newClient.email}
          onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
        />
        <input
          className="border p-2 mr-2"
          placeholder="Company"
          value={newClient.company}
          onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
        />
        <button
          onClick={handleAddClient}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Client
        </button>
      </div>

      <ul>
        {clients.map((client) => (
          <li
            key={client.id}
            className="bg-white p-4 shadow mb-2 rounded border border-gray-200"
          >
            <h2 className="font-semibold">{client.name}</h2>
            <p className="text-sm text-gray-600">{client.email}</p>
            {client.company && <p className="text-sm text-gray-500">{client.company}</p>}
          </li>
        ))}
      </ul>
    </Layout>
  );
}
