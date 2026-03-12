import { useState, useEffect } from "react";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { Send, MessageSquare, User } from "lucide-react";

export default function Messages() {
  const { user: authUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);

  useEffect(() => {
    loadConversations();
    loadUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      loadMessages(selectedUser._id);
    } else {
      setMessages([]);
    }
  }, [selectedUser]);

  const loadConversations = async () => {
    try {
      const res = await apiFetch("/messages/conversations");
      setConversations(res.data);
    } catch (err) {
      console.error(err);
      setConversations([]);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await apiFetch("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (userId) => {
    try {
      const res = await apiFetch(`/messages?withUser=${userId}`);
      setMessages(res.data.reverse());
    } catch (err) {
      console.error(err);
      setMessages([]);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;
    setSending(true);
    try {
      await apiFetch("/messages", {
        method: "POST",
        body: JSON.stringify({
          receiver: selectedUser._id,
          content: newMessage.trim(),
        }),
      });
      setNewMessage("");
      loadMessages(selectedUser._id);
      loadConversations();
    } catch (err) {
      alert(err.message);
    } finally {
      setSending(false);
    }
  };

  const selectUser = (user) => {
    setSelectedUser(user);
    setShowNewChat(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>
        <p className="mt-1 text-muted-foreground">
          Chat with your team and collaborators
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex flex-col lg:flex-row" style={{ minHeight: "400px" }}>
          {/* Sidebar - conversations / user list */}
          <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-border">
            <div className="p-4 border-b border-border">
              <button
                onClick={() => setShowNewChat(!showNewChat)}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <MessageSquare className="h-4 w-4" />
                New conversation
              </button>
            </div>
            <div className="overflow-y-auto max-h-64 lg:max-h-96">
              {showNewChat ? (
                users.map((u) => (
                  <button
                    key={u._id}
                    onClick={() => selectUser(u)}
                    className={`w-full flex items-center gap-3 p-4 text-left hover:bg-card ${
                      selectedUser?._id === u._id ? "bg-primary/10" : ""
                    }`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </button>
                ))
              ) : (
                conversations.map((c) => (
                  <button
                    key={c._id}
                    onClick={() => selectUser(c.user)}
                    className={`w-full flex items-center gap-3 p-4 text-left hover:bg-card ${
                      selectedUser?._id === c.user?._id ? "bg-primary/10" : ""
                    }`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground truncate">
                        {c.user?.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {c.lastMessage?.content}
                      </p>
                    </div>
                    {c.unread > 0 && (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                        {c.unread}
                      </span>
                    )}
                  </button>
                ))
              )}
              {!showNewChat && conversations.length === 0 && !loading && (
                <p className="p-4 text-sm text-muted-foreground">
                  No conversations yet
                </p>
              )}
            </div>
          </div>

          {/* Message area */}
          <div className="flex-1 flex flex-col min-h-64">
            {selectedUser ? (
              <>
                <div className="p-4 border-b border-border">
                  <p className="font-semibold text-foreground">
                    {selectedUser.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.email}
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-64 lg:max-h-80">
                  {messages.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No messages yet. Send one to start the conversation.
                    </p>
                  ) : (
                    messages.map((m) => {
                      const isFromMe = m.sender?._id === authUser?._id;
                      return (
                      <div
                        key={m._id}
                        className={`flex ${
                          isFromMe ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            isFromMe
                              ? "bg-primary text-primary-foreground"
                              : "bg-card border border-border"
                          }`}
                        >
                          <p className="text-sm">{m.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {new Date(m.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ); })
                  )}
                </div>
                <form
                  onSubmit={sendMessage}
                  className="p-4 border-t border-border flex gap-2"
                >
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 rounded-lg border border-border bg-input px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="rounded-lg bg-primary p-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <p>Select a conversation or start a new one</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
