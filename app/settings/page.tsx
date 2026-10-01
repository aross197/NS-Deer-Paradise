"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  loadContacts,
  saveContacts,
  loadHomeBase,
  saveHomeBase,
  loadProfileName,
  saveProfileName,
  type StoredContact,
  type HomeBase,
} from "@/lib/local-store";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [contacts, setContacts] = useState<StoredContact[]>([]);
  const [home, setHome] = useState<HomeBase | null>(null);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    setName(loadProfileName());
    setContacts(loadContacts());
    setHome(loadHomeBase());
  }, []);

  const persistContacts = (list: StoredContact[]) => {
    setContacts(list);
    saveContacts(list);
  };

  const addContact = () => {
    if (!newName.trim() || !newEmail.trim() || !newEmail.includes("@")) {
      setMsg("Name and valid email required.");
      return;
    }
    const c: StoredContact = {
      id: `c_${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim(),
      selected: true,
    };
    persistContacts([...contacts, c]);
    setNewName("");
    setNewEmail("");
    setMsg("Contact saved.");
  };

  const removeContact = (id: string) => {
    persistContacts(contacts.filter((c) => c.id !== id));
  };

  const setHomeFromGps = () => {
    if (!navigator.geolocation) {
      setMsg("GPS not available.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const h: HomeBase = {
          name: "Truck / home base",
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        };
        setHome(h);
        saveHomeBase(h);
        setMsg("Home base set from GPS.");
      },
      () => setMsg("Could not get GPS."),
      { enableHighAccuracy: true, timeout: 20000 }
    );
  };

  return (
    <div className="min-h-screen bg-deep text-cream-100">
      <nav className="sticky top-0 z-20 border-b border-white/[0.04] glass-strong">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="font-serif text-lg">
            BuckTracks
          </Link>
          <Link href="/sos" className="text-sm text-red-400">
            SOS
          </Link>
        </div>
      </nav>

      <main className="max-w-lg mx-auto px-4 py-8 space-y-8 pb-24">
        <h1 className="font-serif text-3xl text-cream-50">Settings</h1>
        {msg && <p className="text-sm text-amber-300">{msg}</p>}

        <section className="card-premium p-5 space-y-3">
          <h2 className="text-sm uppercase tracking-wider text-cream-300/40">Your name</h2>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl bg-forest-900 border border-white/10 px-3 py-2.5 text-sm"
          />
          <button
            type="button"
            className="btn-primary text-sm py-2"
            onClick={() => {
              saveProfileName(name.trim() || "Hunter");
              setMsg("Name saved.");
            }}
          >
            Save name
          </button>
        </section>

        <section className="card-premium p-5 space-y-3">
          <h2 className="text-sm uppercase tracking-wider text-cream-300/40">
            Home base (for back bearing)
          </h2>
          {home ? (
            <p className="font-mono text-sm text-cream-200">
              {home.name}
              <br />
              {home.lat.toFixed(5)}, {home.lon.toFixed(5)}
            </p>
          ) : (
            <p className="text-sm text-cream-300/50">Not set — SOS needs this.</p>
          )}
          <button type="button" className="btn-ghost text-sm py-2" onClick={setHomeFromGps}>
            Set from GPS now
          </button>
        </section>

        <section className="card-premium p-5 space-y-3">
          <h2 className="text-sm uppercase tracking-wider text-cream-300/40">
            Emergency contacts
          </h2>
          <ul className="space-y-2">
            {contacts.map((c) => (
              <li
                key={c.id}
                className="flex justify-between gap-2 text-sm border-b border-white/5 pb-2"
              >
                <span>
                  {c.name}
                  <span className="block text-xs text-cream-300/40">{c.email}</span>
                </span>
                <button
                  type="button"
                  className="text-red-400/80 text-xs"
                  onClick={() => removeContact(c.id)}
                >
                  Remove
                </button>
              </li>
            ))}
            {contacts.length === 0 && (
              <p className="text-sm text-cream-300/40">Add people SOS can email.</p>
            )}
          </ul>
          <input
            placeholder="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full rounded-xl bg-forest-900 border border-white/10 px-3 py-2.5 text-sm"
          />
          <input
            placeholder="Email"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full rounded-xl bg-forest-900 border border-white/10 px-3 py-2.5 text-sm"
          />
          <button type="button" className="btn-primary text-sm py-2" onClick={addContact}>
            Add contact
          </button>
        </section>
      </main>
    </div>
  );
}
