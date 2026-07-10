"use client";
import React, { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { useGameStore } from "@/lib/store";
import { Send, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  uid: string;
  username: string;
  avatar: string;
  text: string;
  createdAt: Timestamp | null;
}

interface ClubChatProps {
  clubId: string;
}

export default function ClubChat({ clubId }: ClubChatProps) {
  const { uid, username, avatar } = useGameStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!clubId) return;

    const messagesRef = collection(db, "clubs", clubId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"), limit(100));

    const unsub = onSnapshot(q, (snap) => {
      const msgs: Message[] = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Message, "id">),
      }));
      setMessages(msgs);
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    });

    return () => unsub();
  }, [clubId]);

  const handleSend = async () => {
    if (!text.trim() || !uid || sending) return;

    setSending(true);
    try {
      const messagesRef = collection(db, "clubs", clubId, "messages");
      await addDoc(messagesRef, {
        uid,
        username: username || "Snob Anonyme",
        avatar: avatar || "🎩",
        text: text.trim(),
        createdAt: serverTimestamp(),
      });
      setText("");
    } catch (err) {
      console.error("Erreur envoi message:", err);
    } finally {
      setSending(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (ts: Timestamp | null): string => {
    if (!ts) return "";
    const d = ts.toDate();
    return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

  const isMyMessage = (msgUid: string) => msgUid === uid;

  return (
    <div className="flex flex-col h-full bg-slate-950/50 rounded-2xl border border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900/60">
        <MessageCircle className="w-4 h-4 text-yellow-400" />
        <span className="font-bold text-sm text-slate-200">Chat du Club</span>
        <span className="ml-auto text-xs text-slate-500">{messages.length}/100 messages</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="text-3xl mb-2">💬</div>
            <p className="text-slate-500 text-sm">Aucun message pour l&apos;instant.</p>
            <p className="text-slate-600 text-xs mt-1">Soyez le premier à écrire !</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const mine = isMyMessage(msg.uid);
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2 ${mine ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-base flex-shrink-0 select-none">
                    {msg.avatar}
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[70%] flex flex-col gap-0.5 ${mine ? "items-end" : "items-start"}`}>
                    <div className="flex items-center gap-1.5">
                      {!mine && (
                        <span className="text-[10px] text-slate-400 font-semibold">{msg.username}</span>
                      )}
                      <span className="text-[9px] text-slate-600">{formatTime(msg.createdAt)}</span>
                    </div>
                    <div
                      className={`px-3 py-2 rounded-2xl text-sm leading-relaxed break-words ${
                        mine
                          ? "bg-yellow-500/20 text-yellow-100 border border-yellow-500/30 rounded-tr-sm"
                          : "bg-slate-800/80 text-slate-200 border border-slate-700/50 rounded-tl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {uid ? (
        <div className="px-3 py-3 border-t border-slate-800 bg-slate-900/40">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKey}
              maxLength={200}
              placeholder="Écrire un message..."
              className="flex-1 bg-slate-950/60 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500/50 transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={!text.trim() || sending}
              className="w-9 h-9 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/40 border border-yellow-500/40 text-yellow-400 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="px-4 py-3 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-500">Connectez-vous pour participer au chat.</p>
        </div>
      )}
    </div>
  );
}
