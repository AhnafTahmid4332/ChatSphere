"use client";

import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  useRef,
  ReactNode,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Menu, X, Send } from "lucide-react";
import {
  getAuth,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { db } from "@/lib/firebase"; // Ensure firebase.js file exports db instance
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

// Firebase auth setup
const auth = getAuth();

// Define TypeScript interfaces
interface User extends FirebaseUser {}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: string;
  lastMessage: string;
}

interface Message {
  id: string;
  text: string;
  sender: string;
  displayName: string;
  senderProfileImg: string;
  timestamp: Timestamp | null;
}

// Update UserContext to reflect the correct type
const UserContext = createContext<User | null>(null);

export const useUser = () => useContext(UserContext);

// Define Props for ChatsList component if needed
const ChatsList: React.FC<{ contacts: Contact[] }> = ({ contacts }) => (
  <div className="p-4">
    <h2 className="text-2xl font-bold mb-4 text-white">Chats</h2>
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="w-full mb-4 bg-black border border-zinc-800">
        <TabsTrigger
          value="all"
          className="w-full data-[state=active]:bg-white data-[state=active]:text-black"
        >
          All
        </TabsTrigger>
        <TabsTrigger
          value="unread"
          className="w-full data-[state=active]:bg-white data-[state=active]:text-black"
        >
          Unread
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <ScrollArea className="h-[calc(100vh-200px)]">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center gap-3 p-3 hover:bg-zinc-900 rounded-lg cursor-pointer transition-colors"
            >
              <div className="relative">
                <img
                  alt={contact.name}
                  className="rounded-full"
                  height={40}
                  src={contact.avatar}
                  width={40}
                />
                <span
                  className={cn(
                    "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black",
                    contact.status === "online" && "bg-green-500"
                  )}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white">{contact.name}</div>
                <div className="text-sm text-zinc-400 truncate">
                  {contact.lastMessage}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </TabsContent>
      <TabsContent value="unread">
        <div className="text-center text-zinc-400 py-4">No unread messages</div>
      </TabsContent>
    </Tabs>
  </div>
);

export default function ResponsiveDarkChat() {
  // Type state hooks
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userContact: Contact = {
          id: currentUser.uid,
          name: currentUser.displayName || "You",
          avatar: currentUser.photoURL || "/placeholder.svg?height=40&width=40",
          status: "online",
          lastMessage: "Welcome!",
        };
        setContacts((prevContacts) => {
          const exists = prevContacts.some(
            (contact) => contact.id === userContact.id
          );
          return exists ? prevContacts : [...prevContacts, userContact];
        });
      }
    });

    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      const fetchedMessages: Message[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Message, "id">),
      }));
      setMessages(fetchedMessages);

      // Auto-scroll to the latest message
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeMessages();
    };
  }, []);

  const handleSendMessage = async () => {
    if (message.trim() && user) {
      await addDoc(collection(db, "messages"), {
        text: message,
        sender: user.uid,
        displayName: user.displayName || "Anonymous",
        senderProfileImg:
          user.photoURL || "/placeholder.svg?height=40&width=40",
        timestamp: serverTimestamp(),
      });
      setMessage(""); // Clear the input field
    }
  };

  return (
    <UserContext.Provider value={user}>
      <div className="flex h-screen bg-black">
        <div className="hidden md:block w-80 border-r border-zinc-800">
          <ChatsList contacts={contacts} />
        </div>

        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden absolute top-4 left-4 text-white"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 bg-black p-0">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </Button>
            <ChatsList contacts={contacts} />
          </SheetContent>
        </Sheet>

        <div className="flex-1 p-4">
          <h2 className="text-2xl font-bold mb-4 text-white">Chat</h2>
          <ScrollArea className="h-[calc(100vh-200px)]" ref={scrollRef}>
            <div className="flex flex-col">
              {messages.map((msg) => (
                <div key={msg.id} className="mb-2 flex items-start">
                  <div className="flex items-center mr-3">
                    <img
                      src={msg.senderProfileImg}
                      alt={`${msg.displayName}'s profile`}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex flex-col ml-2">
                      <span className="font-medium text-white">
                        {msg.displayName || "Anonymous"}:
                      </span>
                      <span className="text-zinc-400 text-sm">
                        {msg.timestamp
                          ? msg.timestamp.toDate().toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Sending..."}
                      </span>
                      <div className="text-white">{msg.text}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="flex mt-4">
            <Input
              className="flex-1 bg-black border-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-700"
              placeholder="Type a message"
              value={message}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setMessage(e.target.value)
              }
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") handleSendMessage();
              }}
            />
            <Button onClick={handleSendMessage}>
              <Send className="h-6 w-6 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </UserContext.Provider>
  );
}
