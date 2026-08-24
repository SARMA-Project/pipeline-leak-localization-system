import React, { useState } from 'react';
import { Bot, Send, User } from 'lucide-react';
import { useFirebase } from '../contexts/FirebaseContext';

export const AIAssistant = () => {
  const { metrics, nodes } = useFirebase();
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hello. I am your EDGE AI Operations Assistant. How can I help you analyze the pipeline data today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Mock AI Response Logic based on input keywords
    setTimeout(() => {
      let aiText = "I'm monitoring the system. Everything appears within normal parameters. Can you specify your query?";
      const lowerInput = userMsg.text.toLowerCase();

      if (lowerInput.includes('leak') || lowerInput.includes('status')) {
        const leaks = Object.values(nodes).filter(n => n.status === 'Leak');
        if (leaks.length > 0) {
          aiText = `CRITICAL: I have detected a leak at ${leaks[0].locationName} (Node: ${leaks[0].id}). The probability is ${leaks[0].leakProbability.toFixed(1)}%. I recommend initiating the emergency SOP immediately.`;
        } else {
          aiText = "There are currently no leaks detected. The overall pipeline health is nominal.";
        }
      } else if (lowerInput.includes('health') || lowerInput.includes('confidence')) {
        aiText = `The Edge AI prediction confidence is currently at ${metrics?.ai?.overallConfidence}%. Pipeline structural integrity is stable.`;
      } else if (lowerInput.includes('maintenance')) {
        aiText = "Based on trend analysis, Node 08's battery is degrading faster than expected. Scheduled maintenance is advised within 45 days.";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: aiText }]);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col space-y-4 pb-6">
      <div>
        <h1 className="text-2xl font-bold text-steel-900">AI Assistant</h1>
        <p className="text-sm text-steel-500">Query the Edge AI for diagnostics and recommendations</p>
      </div>

      <div className="flex-1 glass-panel flex flex-col overflow-hidden max-w-4xl mx-auto w-full border border-steel-200">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.sender === 'user' ? 'bg-brand-primary text-white ml-3' : 'bg-steel-800 text-brand-info mr-3'
                }`}>
                  {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={`p-4 rounded-2xl text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-brand-primary text-white rounded-tr-none shadow-md' 
                    : 'bg-steel-50 text-steel-900 border border-steel-200 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white border-t border-steel-200">
          <form onSubmit={handleSend} className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about pipeline health, leaks, or maintenance..."
              className="flex-1 bg-steel-50 border border-steel-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-steel-900"
            />
            <button 
              type="submit"
              className="bg-brand-primary text-white px-6 py-3 rounded-lg hover:bg-brand-primary/90 transition-colors flex items-center shadow-md"
            >
              <Send className="w-4 h-4 mr-2" />
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
