import React, { useState, useEffect, useRef } from 'react';

const ChatSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi there! 👋 How can I help you today?' }
  ]);
  const messagesEndRef = useRef(null);

  const predefinedQuestions = [
    {
      q: 'What is your return policy?',
      a: 'We offer a 30-day return policy. Items must be unused and in original packaging. Check out our Return & Refund Policy page for full details.'
    },
    {
      q: 'How do I track my order?',
      a: 'Once your order ships, we will email you a tracking link. You can also view the status in your account under "Orders".'
    },
    {
      q: 'Do you offer Cash on Delivery?',
      a: 'Yes! We offer 100% Cash on Delivery across all cities in Pakistan. You can pay cash when the parcel arrives at your doorstep.'
    },
    {
      q: 'I need to speak to support',
      a: 'You can reach our Taicon support team directly on WhatsApp or phone at +92 327 4000155 or email us at salmantariq11786@gmail.com.'
    }
  ];

  const handleQuestionClick = (qa) => {
    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: qa.q }]);
    
    // Simulate typing delay
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text: qa.a }]);
    }, 600);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Styles
  const floatingBtnStyle = {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    backgroundColor: 'var(--accent-color, #000)',
    color: '#fff',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    border: 'none',
  };

  const chatWindowStyle = {
    position: 'fixed',
    bottom: '90px',
    right: '24px',
    width: '350px',
    height: '500px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    border: '1px solid #eaeaea',
    fontFamily: 'inherit'
  };

  const headerStyle = {
    backgroundColor: 'var(--accent-color, #000)',
    color: '#fff',
    padding: '16px',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const messagesContainerStyle = {
    flex: 1,
    padding: '16px',
    overflowY: 'auto',
    backgroundColor: '#f9f9f9',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  };

  const messageBubbleStyle = (isUser) => ({
    maxWidth: '80%',
    padding: '12px 16px',
    borderRadius: '16px',
    fontSize: '0.9rem',
    lineHeight: '1.4',
    alignSelf: isUser ? 'flex-end' : 'flex-start',
    backgroundColor: isUser ? 'var(--accent-color, #000)' : '#fff',
    color: isUser ? '#fff' : '#333',
    border: isUser ? 'none' : '1px solid #e0e0e0',
    borderBottomRightRadius: isUser ? '4px' : '16px',
    borderBottomLeftRadius: isUser ? '16px' : '4px',
  });

  const optionsContainerStyle = {
    padding: '12px 16px',
    backgroundColor: '#fff',
    borderTop: '1px solid #eee',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const optionButtonStyle = {
    padding: '8px 12px',
    backgroundColor: '#f0f0f0',
    border: '1px solid #ddd',
    borderRadius: '20px',
    fontSize: '0.85rem',
    color: '#333',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background-color 0.2s',
  };

  return (
    <>
      {isOpen && (
        <div style={chatWindowStyle}>
          {/* Header */}
          <div style={headerStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1H2zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z"/>
                <path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
              </svg>
              <span>Support Chat</span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}>
              &times;
            </button>
          </div>

          {/* Chat Messages */}
          <div style={messagesContainerStyle}>
            {messages.map((msg, idx) => (
              <div key={idx} style={messageBubbleStyle(msg.sender === 'user')}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Options */}
          <div style={optionsContainerStyle}>
            <p style={{ fontSize: '0.8rem', color: '#888', margin: '0 0 4px 4px' }}>Suggested questions:</p>
            {predefinedQuestions.map((qa, idx) => (
              <button 
                key={idx} 
                style={optionButtonStyle}
                onClick={() => handleQuestionClick(qa)}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f0f0f0'}
              >
                {qa.q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button 
          style={floatingBtnStyle} 
          onClick={() => setIsOpen(true)}
          aria-label="Open support chat"
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
            <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
            <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z"/>
          </svg>
        </button>
      )}
    </>
  );
};

export default ChatSupport;
