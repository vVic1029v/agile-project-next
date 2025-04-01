"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef } from "react";
import * as React from "react";

import { Loader2 } from "lucide-react";
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ className, ...props }, ref) => {
      return (
        <input
          ref={ref}
          className={`border-2 border-gray-300 rounded-lg p-4 text-lg w-full focus:ring-4 focus:ring-blue-500 outline-none transition-all duration-300 ease-in-out ${className}`}
          {...props}
        />
      );
    }
  );
  export const Button = ({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
      <button
        className={`bg-neutral-900 hover:bg-neutral-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out focus:ring-4 focus:ring-neutral-400 ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  };
  const Chatbot = () => {
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({ api: "/api/chatBot" });
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
  
    useEffect(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [messages]);
  
    return (
      <div className="max-w-lg mx-auto p-6 bg-white shadow-xl rounded-lg border border-gray-200">
        <h2 className="text-2xl font-semibold text-center mb-4 text-neutral-900">🤖 Chatbot</h2>
        <div className="h-96 overflow-y-auto p-4 space-y-4 border rounded bg-gray-50 shadow-inner">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`p-4 rounded-lg max-w-xs shadow-md text-sm ${
                  msg.role === "user" ? "bg-neutral-500 text-white" : "bg-gray-200 text-gray-900"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="mt-4 flex gap-4">
          <Input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Scrie un mesaj..."
            className="text-lg font-medium"
          />
          <Button type="submit" disabled={isLoading} className="flex-shrink-0">
            {isLoading ? <Loader2 className="animate-spin" /> : "Trimite"}
          </Button>
        </form>
      </div>
    );
  };
  
  export default Chatbot;