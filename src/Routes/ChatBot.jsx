import { useState } from 'react';
import axios from 'axios';

export default function ChatBot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages([...messages, userMsg]);

    const res = await axios.post('https://club-event-management-server.onrender.com/chat', { message: input });
    console.log('bot reply', res.data.reply);
    const botMsg = { sender: 'bot', text: res.data.reply };

    setMessages(prev => [...prev, botMsg]);
    setInput('');
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>🤖 Chat with AI</h2>
      <div style={{ border: '1px solid #ccc', height: 300, overflowY: 'auto', padding: 10 }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
            <p><strong>{msg.sender === 'user' ? 'You' : 'Bot'}:</strong> {msg.text}</p>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
        placeholder="Type a message..."
        style={{ width: '100%', padding: 8, marginTop: 10 }}
      />
    </div>
  );
}
