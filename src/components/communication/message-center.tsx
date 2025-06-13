"use client";

import { MoreVertical, Paperclip, Phone, Search, Send, Smile, Video } from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils"; // Assuming cn utility is correctly configured

interface Message {
  id: string;
  content: string;
  isRead: boolean;
  senderId: string;
  senderName: string;
  senderRole: "doctor" | "nurse" | "parent" | "patient";
  timestamp: string;
  attachments?: Array<{
    name: string;
    type: string;
    url: string;
  }>;
}

interface Conversation {
  id: string;
  lastMessage: Message;
  participants: Array<{
    id: string;
    isOnline: boolean;
    name: string;
    role: "doctor" | "nurse" | "parent" | "patient";
    avatar?: string;
  }>;
  subject: string;
  unreadCount: number;
}

// --- Mock Data ---
// In a real application, this data would come from an API
const mockConversations: Conversation[] = [
  {
    id: "1",
    lastMessage: {
      id: "msg1",
      content: "The test results look great! Emma's growth is right on track.",
      isRead: false,
      senderId: "doc1",
      senderName: "Dr. Sarah Johnson",
      senderRole: "doctor",
      timestamp: "2024-01-15T10:30:00Z",
    },
    participants: [
      {
        id: "doc1",
        avatar: "/placeholder.svg?height=40&width=40",
        isOnline: true,
        name: "Dr. Sarah Johnson",
        role: "doctor",
      },
      {
        id: "user-patient", // Changed to a more generic "user" ID for consistency
        avatar: "/placeholder.svg?height=40&width=40",
        isOnline: false,
        name: "Emma Johnson",
        role: "patient",
      },
    ],
    subject: "Test Results - Emma Johnson",
    unreadCount: 2,
  },
  {
    id: "2",
    lastMessage: {
      id: "msg2",
      content: "Please bring Emma's vaccination card to the next appointment.",
      isRead: true,
      senderId: "nurse1",
      senderName: "Nurse Mary Wilson",
      senderRole: "nurse",
      timestamp: "2024-01-14T15:45:00Z",
    },
    participants: [
      {
        id: "nurse1",
        avatar: "/placeholder.svg?height=40&width=40",
        isOnline: true,
        name: "Nurse Mary Wilson",
        role: "nurse",
      },
      {
        id: "user-parent", // Changed to a more generic "user" ID for consistency
        avatar: "/placeholder.svg?height=40&width=40",
        isOnline: true,
        name: "John Johnson",
        role: "parent",
      },
    ],
    subject: "Vaccination Reminder",
    unreadCount: 0,
  },
];

const mockMessages: Message[] = [
  {
    id: "1",
    content:
      "Hi Dr. Johnson, I wanted to ask about Emma's recent growth measurements. Should I be concerned about anything?",
    isRead: true,
    senderId: "user-patient", // Use consistent ID
    senderName: "Emma Johnson",
    senderRole: "patient",
    timestamp: "2024-01-15T09:15:00Z",
  },
  {
    id: "2",
    content:
      "Hello! Emma's measurements are excellent. She's tracking beautifully along her growth curve. Her height and weight are both in the 75th percentile, which is very healthy for her age.",
    isRead: true,
    senderId: "doc1",
    senderName: "Dr. Sarah Johnson",
    senderRole: "doctor",
    timestamp: "2024-01-15T10:20:00Z",
  },
  {
    id: "3",
    content: "The test results look great! Emma's growth is right on track.",
    isRead: false,
    senderId: "doc1",
    senderName: "Dr. Sarah Johnson",
    senderRole: "doctor",
    timestamp: "2024-01-15T10:30:00Z",
  },
];
// --- End Mock Data ---

// Assume the current logged-in user's ID. In a real app, this would come from an auth context.
const CURRENT_USER_ID = "user-patient"; // Or "user-parent" depending on context

export function MessageCenter() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>("1");
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const currentConversation = mockConversations.find((c) => c.id === selectedConversationId);
  // In a real app, you'd filter or fetch messages based on selectedConversationId
  const currentMessages = selectedConversationId === "1" ? mockMessages : [];

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversationId) {
      // In a real app, you'd send this message to your backend API
      // and update the messages state for the current conversation.
      console.log(`Sending message to convo ${selectedConversationId}: ${newMessage}`);
      setNewMessage("");
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "doctor":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "nurse":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "parent":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "patient":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const formatTime = (timestamp: string) => {
    // Check if timestamp is a valid date string
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Messages</h1>
          <p className="text-muted-foreground">Communicate with your healthcare team</p>
        </div>
        <Button>
          <Send className="mr-2 h-4 w-4" />
          New Message
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Conversations List */}
        <Card>
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
            <CardDescription>Recent messages and updates</CardDescription>
            <div className="relative">
              <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              {/* Iterating through mockConversations to display them */}
              {mockConversations.map((conversation) => (
                // FIX: Changed <div> to <button> for accessibility
                <button
                  key={conversation.id}
                  className={cn(
                    "flex w-full items-start space-x-3 border-b p-4 text-left transition-colors hover:bg-muted/50",
                    selectedConversationId === conversation.id ? "bg-muted" : ""
                  )}
                  onClick={() => setSelectedConversationId(conversation.id)}
                  type="button" // Important for semantic correctness and preventing form submission issues
                >
                  <div className="relative flex-shrink-0">
                    {" "}
                    {/* Use flex-shrink-0 to prevent avatar squishing */}
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={conversation.participants[0].avatar || "/placeholder.svg"}
                        alt={`Avatar of ${conversation.participants[0].name}`}
                      />
                      <AvatarFallback>
                        {conversation.participants[0].name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {/* Online status indicator */}
                    {conversation.participants[0].isOnline && (
                      <div className="-right-0.5 -bottom-0.5 absolute h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500 dark:border-gray-950" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate font-medium text-sm">
                        {conversation.participants[0].name}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <Badge variant="default" className="ml-2 flex-shrink-0">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <p className="mb-1 truncate text-muted-foreground text-xs">
                      {conversation.subject}
                    </p>
                    <p className="truncate text-muted-foreground text-sm">
                      {conversation.lastMessage.content}
                    </p>
                    <p className="mt-1 text-muted-foreground text-xs">
                      {formatTime(conversation.lastMessage.timestamp)}
                    </p>
                  </div>
                </button>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Message Thread */}
        <Card className="md:col-span-2">
          {currentConversation ? (
            <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={currentConversation.participants[0].avatar || "/placeholder.svg"}
                        alt={`Avatar of ${currentConversation.participants[0].name}`}
                      />
                      <AvatarFallback>
                        {currentConversation.participants[0].name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {currentConversation.participants[0].name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={getRoleColor(currentConversation.participants[0].role)}
                        >
                          {currentConversation.participants[0].role}
                        </Badge>
                        {currentConversation.participants[0].isOnline && (
                          <span className="text-green-600 text-sm">● Online</span>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="icon" variant="outline" aria-label="Call">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" aria-label="Video Call">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" aria-label="More options">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="p-0">
                <ScrollArea className="h-[300px] p-4">
                  <div className="space-y-4">
                    {currentMessages.map((message) => (
                      <div
                        key={message.id}
                        // Check if the sender is the current user (e.g., "Emma Johnson" or "John Johnson")
                        className={cn(
                          "flex",
                          message.senderId === CURRENT_USER_ID ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[70%] rounded-lg p-3",
                            message.senderId === CURRENT_USER_ID
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}
                        >
                          <div className="mb-1 flex items-center space-x-2">
                            <span className="font-medium text-xs">{message.senderName}</span>
                            <Badge
                              variant="outline"
                              className={cn("text-xs", getRoleColor(message.senderRole))}
                            >
                              {message.senderRole}
                            </Badge>
                          </div>
                          <p className="text-sm">{message.content}</p>
                          <p className="mt-1 text-xs opacity-70">{formatTime(message.timestamp)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <Separator />
                <div className="p-4">
                  <div className="flex items-end space-x-2">
                    <div className="flex-1">
                      <Textarea
                        className="min-h-[60px] resize-none"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault(); // Prevent new line in textarea
                            handleSendMessage();
                          }
                        }}
                        placeholder="Type your message..."
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button size="icon" variant="outline" aria-label="Attach file">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline" aria-label="Insert emoji">
                        <Smile className="h-4 w-4" />
                      </Button>
                      <Button
                        disabled={!newMessage.trim()}
                        onClick={handleSendMessage}
                        aria-label="Send message"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex h-[500px] items-center justify-center">
              <div className="text-center">
                <Send className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">Select a conversation to start messaging</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
