"use client";
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

interface FAQ {
  id: string;
  keywords: string[];
  question: string;
  answer: string;
  category: 'general' | 'admissions' | 'departments' | 'faculty' | 'facilities' | 'placements' | 'fees' | 'contact';
}

const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '👋 Welcome to SVEC! How can I help you today?\n\n💬 Choose from the menu below (type the number):\n\n1️⃣ 📝 Admissions & Eligibility\n\n2️⃣ 🎓 Departments & Programs\n\n3️⃣ 👨‍🏫 Faculty Information\n\n4️⃣ 🏢 Facilities & Infrastructure\n\n5️⃣ 💼 Placements & Careers\n\n6️⃣ 💰 Fees & Scholarships\n\n7️⃣ 📞 Contact Information\n\n✨ Or ask me anything directly!',
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Quick suggestion buttons
  const quickSuggestions = [
    { text: '1️⃣ Admissions', query: '1' },
    { text: '2️⃣ Departments', query: '2' },
    { text: '3️⃣ Faculty', query: '3' },
    { text: '4️⃣ Facilities', query: '4' },
    { text: '5️⃣ Placements', query: '5' },
    { text: '6️⃣ Fees', query: '6' },
    { text: '7️⃣ Contact', query: '7' }
  ];

  const handleSuggestionClick = (query: string) => {
    setInputValue(query);
    setShowSuggestions(false);
    // Auto-send the suggestion
    setTimeout(() => {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: query,
        isUser: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);

      // Process the suggestion query
      processBotResponse(query);
    }, 100);
  };

  const processBotResponse = async (userInput: string) => {
    try {
      // Use API endpoint for better FAQ matching
      const response = await fetch('/api/chatbot/faqs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput }),
      });

      const result = await response.json();
      
      setTimeout(() => {
        setIsTyping(false);
        const responseText = result.success ? result.data.answer : findBestMatch(userInput);
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: responseText,
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMessage]);
      }, 1500);
    } catch (error) {
      // Fallback to local matching if API fails
      setTimeout(() => {
        setIsTyping(false);
        const response = findBestMatch(userInput);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response,
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMessage]);
      }, 1500);
    }
  };

  // Debug log
  useEffect(() => {
    console.log('ChatbotWidget component rendered');
  }, []);

  // Short & Sweet FAQ Database
  const faqDatabase: FAQ[] = [
    // General College Information
    {
      id: 'gen1',
      keywords: ['college', 'about', 'svec', 'vasavi', 'information', 'history', 'established', 'founded'],
      question: 'Tell me about SVEC',
      answer: '🏫 SVEC established in 2001, Tadepalligudem, AP\n✅ NAAC Grade A | Autonomous | AICTE Approved\n🎓 Offers B.Tech, M.Tech & MBA programs',
      category: 'general'
    },
    {
      id: 'gen2',
      keywords: ['location', 'address', 'where', 'tadepalligudem', 'andhra pradesh'],
      question: 'Where is SVEC located?',
      answer: '📍 Tadepalligudem, West Godavari District, AP - 534101\n🚂 Near Tadepalligudem Railway Station\n🛣️ Well connected by road & rail',
      category: 'general'
    },
    {
      id: 'gen3',
      keywords: ['accreditation', 'naac', 'aicte', 'autonomous', 'affiliation', 'recognition'],
      question: 'What are the accreditations?',
      answer: '✅ NAAC Grade A Accredited\n🏛️ Autonomous Institution\n📜 JNTUK Affiliated | AICTE Approved\n🏆 ISO 9001:2015 Certified',
      category: 'general'
    },

    // Admissions
    {
      id: 'adm1',
      keywords: ['admission', 'eligibility', 'entrance', 'apply', 'application', 'how to join'],
      question: 'What is the admission process?',
      answer: '📝 B.Tech: AP EAMCET | M.Tech: GATE/PGECET\n🎯 Eligibility: 10+2 PCM with 45% marks\n💺 Convener & Management quota seats available',
      category: 'admissions'
    },
    {
      id: 'adm2',
      keywords: ['seats', 'intake', 'capacity', 'branches', 'quota'],
      question: 'What is the seat intake?',
      answer: '🎓 CSE: 240 | AIML: 180 | ECE: 180 | EEE: 180\n💻 CSE (AI): 120 | CSE (DS): 60\n🏗️ Civil: 120 | Mechanical: 120',
      category: 'admissions'
    },
    {
      id: 'adm3',
      keywords: ['cutoff', 'rank', 'eamcet', 'minimum', 'marks'],
      question: 'What are the cutoff ranks?',
      answer: '📊 CSE: 5K-15K | AIML: 10K-25K | ECE: 15K-30K\n📈 EEE: 20K-35K | Civil/Mech: 25K-45K\n⚠️ Ranks vary yearly based on competition',
      category: 'admissions'
    },

    // Departments
    {
      id: 'dept1',
      keywords: ['departments', 'branches', 'courses', 'programs', 'engineering'],
      question: 'What departments are available?',
      answer: '� CSE | CSE (AI) | CSE (DS) | AIML\n⚡ ECE | EEE | Civil | Mechanical\n� MBA program also available',
      category: 'departments'
    },
    {
      id: 'dept2',
      keywords: ['cse', 'computer science', 'software', 'programming', 'coding', 'cst'],
      question: 'Tell me about CSE',
      answer: '💻 Established: 2001 | Intake: 240 seats\n�‍🏫 HOD: Dr. D. Jaya Kumari (CSE & CST)\n🚀 Focus: Software, AI/ML, Data Analytics\n📈 Excellent placements in top IT companies',
      category: 'departments'
    },
    {
      id: 'dept3',
      keywords: ['aiml', 'artificial intelligence', 'machine learning', 'ai', 'ml', 'cai', 'cseds'],
      question: 'Tell me about AIML',
      answer: '🤖 Established: 2021 | Intake: 180 seats\n👩‍🏫 HOD: Dr. G. Loshma (AIML & CAI & CSEDS)\n🧠 Focus: Deep Learning, Neural Networks, Computer Vision\n💻 GPU labs with industry partnerships',
      category: 'departments'
    },
    {
      id: 'dept4',
      keywords: ['ece', 'electronics', 'communication', 'vlsi', 'embedded', 'ect'],
      question: 'Tell me about ECE',
      answer: '📡 Established: 2001 | Intake: 180 seats\n�‍🏫 HOD: Dr. E. Kusuma Kumari (ECE & ECT)\n⚡ Focus: VLSI, Embedded Systems, IoT\n🔧 Advanced labs & core company placements',
      category: 'departments'
    },
    {
      id: 'dept5',
      keywords: ['eee', 'electrical', 'power', 'energy', 'systems'],
      question: 'Tell me about EEE',
      answer: '⚡ Established: 2001 | Intake: 180 seats\n👩‍🏫 HOD: Dr. D. Sudha Rani\n🔋 Focus: Power Systems, Renewable Energy\n🏭 Strong connections in power sector',
      category: 'departments'
    },
    {
      id: 'dept6',
      keywords: ['mechanical', 'mech', 'automobiles', 'manufacturing', 'thermal'],
      question: 'Tell me about Mechanical',
      answer: '🔧 Established: 2001 | Intake: 120 seats\n👨‍🏫 HOD: Dr. M.V. Ramesh\n⚙️ Focus: Design, Manufacturing, Thermal Engineering\n🏭 Strong industry connections & hands-on learning',
      category: 'departments'
    },
    {
      id: 'dept7',
      keywords: ['civil', 'construction', 'structures', 'environmental', 'building'],
      question: 'Tell me about Civil',
      answer: '🏗️ Established: 2001 | Intake: 120 seats\n👨‍🏫 HOD: Dr. G. Radha Krishna\n🌉 Focus: Structural Design, Environmental Engineering\n🏢 Strong placement in construction & infrastructure',
      category: 'departments'
    },

    // Faculty
    {
      id: 'fac1',
      keywords: ['faculty', 'professors', 'teachers', 'staff', 'qualification'],
      question: 'Tell me about faculty',
      answer: '👨‍🏫 200+ experienced faculty\n🎓 80% with M.Tech/Ph.D qualifications\n📚 Research active with industry experience\n📊 Student-faculty ratio: 15:1',
      category: 'faculty'
    },
    {
      id: 'fac2',
      keywords: ['hod', 'head', 'department head', 'principal'],
      question: 'Who are the department heads?',
      answer: '🎓 Principal: Dr. G. Ratnakar Rao\n💻 CSE & CST: Dr. D. Jaya Kumari\n🤖 AIML & CAI & CSEDS: Dr. G. Loshma\n📡 ECE & ECT: Dr. E. Kusuma Kumari\n⚡ EEE: Dr. D. Sudha Rani\n🔧 Mechanical: Dr. M.V. Ramesh\n🏗️ Civil: Dr. G. Radha Krishna',
      category: 'faculty'
    },

    // Facilities
    {
      id: 'fac3',
      keywords: ['facilities', 'infrastructure', 'labs', 'library', 'hostel', 'campus'],
      question: 'What facilities are available?',
      answer: '🏢 Classrooms with smart boards\n🔬 Advanced labs for all departments\n📚 Library with 50K+ books\n🏠 Separate hostels for boys & girls\n🚌 Transportation | 🏥 Medical facility',
      category: 'facilities'
    },
    {
      id: 'fac4',
      keywords: ['hostel', 'accommodation', 'rooms', 'mess', 'food'],
      question: 'Tell me about hostel facilities',
      answer: '🏠 Separate boys & girls hostels\n❄️ AC & non-AC rooms (2-4 sharing)\n🍽️ Hygienic mess with nutritious food\n🔒 24/7 security with CCTV\n📶 Wi-Fi & recreation facilities',
      category: 'facilities'
    },

    // Placements
    {
      id: 'plc1',
      keywords: ['placement', 'jobs', 'companies', 'package', 'salary', 'recruitment'],
      question: 'How are the placements?',
      answer: '📈 85%+ placement rate\n💰 Highest: ₹44 LPA | Average: ₹4.5 LPA\n🏢 300+ companies visit annually\n🌟 Top recruiters: TCS, Infosys, Amazon, Microsoft, Penant, Kyndrall, Celigo, My Home Groups, Tessolve, Jocata, ASM Technologies, Orion',
      category: 'placements'
    },
    {
      id: 'plc2',
      keywords: ['companies', 'recruiters', 'top companies', 'multinational'],
      question: 'Which companies visit?',
      answer: '� IT: TCS, Infosys, Wipro, Cognizant, Amazon\n� Product: Microsoft, Google, Adobe, Oracle\n🏭 Core: L&T, BHEL, NTPC, ONGC\n� Consulting: Deloitte, PwC, EY',
      category: 'placements'
    },

    // Fees
    {
      id: 'fee1',
      keywords: ['fees', 'cost', 'tuition', 'fee structure', 'payment'],
      question: 'What is the fee structure?',
      answer: '💰 Convener Quota: ₹1,05,000/year\n💸 Management Quota: ₹1,50,000/year\n📋 Additional: Admission (₹25K), Bus (₹35K)',
      category: 'fees'
    },
    {
      id: 'fee2',
      keywords: ['scholarship', 'financial aid', 'merit', 'fee waiver'],
      question: 'Are scholarships available?',
      answer: '� Top 10 EAMCET: 100% fee waiver\n🥇 Top 100: 50% fee waiver\n🏛️ Government scholarships: SC/ST, BC/EBC, EWS\n💡 Merit scholarships for academic toppers',
      category: 'fees'
    },

    // Contact Information
    {
      id: 'con1',
      keywords: ['contact', 'phone', 'email', 'address', 'reach'],
      question: 'How can I contact the college?',
      answer: '📞 Phone: 08818-284355, 284366\n📧 Email: principal@srivasaviengg.ac.in\n🌐 Website: www.srivasaviengg.ac.in\n📱 WhatsApp: +91 8142382563',
      category: 'contact'
    },
    {
      id: 'con2',
      keywords: ['timings', 'office hours', 'working hours', 'visit'],
      question: 'What are the college timings?',
      answer: '🕘 Classes: Mon-Fri 9:30AM-4:30PM | Sat 9:30AM-4:30PM\n🏢 Office: Mon-Sat 9:30AM-4:30PM\n📞 Admission Helpline: 9AM-6PM\n❌ Sunday: Closed',
      category: 'contact'
    }
  ];

  // Short & Sweet fallback responses
  const fallbackResponses = [
    "🤔 Great question! Contact us at 08818-284355 for detailed info.",
    "💡 Check our website: www.srivasaviengg.ac.in or call our office!",
    "📞 Our admission helpline can help: 08818-284355",
    "🎓 For specific queries, visit our campus or call us!",
    "📧 Placement queries? Email: placements@srivasaviengg.ac.in",
    "✨ SVEC offers world-class facilities! What specific area interests you?",
    "💬 Ask about admissions, departments, facilities, or placements!",
    "🏆 NAAC Grade A college with excellent programs! How can I help?"
  ];

  // FAQ Matching Function
  const findBestMatch = (userInput: string): string => {
    const input = userInput.toLowerCase().trim();
    
    // Handle numbered menu options
    const menuOptions: { [key: string]: string } = {
      '1': '📝 **Admissions & Eligibility**\n\n🎯 Eligibility: 10+2 with PCM (45% for general, 40% for SC/ST)\n📋 Entrance: AP EAMCET/JEE Main\n📅 Application: Online at apeamcet.nic.in\n💳 Application fee: ₹650 (₹450 for SC/ST)\n📊 Counseling: Web-based seat allotment\n\n*Type "2" for Departments or ask specific questions!*',
      '2': '🎓 **Departments & Programs**\n\n💻 CSE | CSE (AI) | CSE (DS) | AIML\n⚡ ECE | EEE | Civil | Mechanical\n📊 MBA program also available\n\n🎯 Total seats: 1,440 engineering + 120 MBA\n\n*Type "3" for Faculty info or ask about specific departments!*',
      '3': '👨‍🏫 **Faculty Information**\n\n🎓 Principal: Dr. G. Ratnakar Rao\n💻 CSE & CST: Dr. D. Jaya Kumari\n🤖 AIML & CAI & CSEDS: Dr. G. Loshma\n📡 ECE & ECT: Dr. E. Kusuma Kumari\n⚡ EEE: Dr. D. Sudha Rani\n🔧 Mechanical: Dr. M.V. Ramesh\n🏗️ Civil: Dr. G. Radha Krishna\n\n👨‍🏫 200+ experienced faculty | 80% with M.Tech/Ph.D\n\n*Type "4" for Facilities or ask specific questions!*',
      '4': '🏢 **Facilities & Infrastructure**\n\n🏢 Smart classrooms with modern boards\n🔬 Advanced labs for all departments\n📚 Library with 50K+ books & e-resources\n🏠 Separate hostels (boys & girls)\n🚌 Transportation facility\n🏥 Medical center with qualified staff\n📶 Wi-Fi enabled campus\n\n*Type "5" for Placements or ask specific questions!*',
      '5': '💼 **Placements & Careers**\n\n📈 85%+ placement rate\n💰 Highest: ₹44 LPA | Average: ₹4.5 LPA\n🏢 300+ companies visit annually\n🌟 Top recruiters: TCS, Infosys, Amazon, Microsoft\n\n🎯 Dedicated Training & Placement Cell\n📊 Strong industry partnerships\n\n*Type "6" for Fees or ask specific questions!*',
      '6': '💰 **Fees & Scholarships**\n\n💳 Annual tuition: ₹85,000-₹1.2L\n🏠 Hostel: ₹60,000/year (including food)\n🚌 Transport: ₹15,000/year\n\n🎓 Scholarships available:\n• Merit-based scholarships\n• Government schemes (fee reimbursement)\n• Financial assistance for needy students\n\n*Type "7" for Contact info or ask specific questions!*',
      '7': '📞 **Contact Information**\n\n🏢 Sri Vasavi Engineering College\nPedatadepalli, Tadepalligudem - 534101\nWest Godavari, Andhra Pradesh\n\n📞 Phone: +91-8818-284355/284356\n📠 Fax: +91-8818-284322\n✉️ Email: info@srivasaviengg.ac.in\n🌐 Website: www.srivasaviengg.ac.in\n\n*Type "1" to go back to menu or ask anything!*'
    };

    // Check if input is a menu number
    if (menuOptions[input]) {
      return menuOptions[input];
    }
    
    // Check for exact keyword matches
    for (const faq of faqDatabase) {
      for (const keyword of faq.keywords) {
        if (input.includes(keyword.toLowerCase())) {
          return faq.answer;
        }
      }
    }
    
    // Check for partial matches and common patterns
    if (input.includes('admission') || input.includes('join') || input.includes('apply')) {
      return faqDatabase.find(f => f.id === 'adm1')?.answer || fallbackResponses[0];
    }
    
    if (input.includes('department') || input.includes('branch') || input.includes('course')) {
      return faqDatabase.find(f => f.id === 'dept1')?.answer || fallbackResponses[0];
    }
    
    if (input.includes('fee') || input.includes('cost') || input.includes('payment')) {
      return faqDatabase.find(f => f.id === 'fee1')?.answer || fallbackResponses[0];
    }
    
    if (input.includes('placement') || input.includes('job') || input.includes('company')) {
      return faqDatabase.find(f => f.id === 'plc1')?.answer || fallbackResponses[0];
    }
    
    if (input.includes('contact') || input.includes('phone') || input.includes('address')) {
      return faqDatabase.find(f => f.id === 'con1')?.answer || fallbackResponses[0];
    }
    
    if (input.includes('facility') || input.includes('lab') || input.includes('hostel')) {
      return faqDatabase.find(f => f.id === 'fac3')?.answer || fallbackResponses[0];
    }

    // Main menu option
    if (input.includes('menu') || input.includes('main menu') || input.includes('start') || input.includes('options')) {
      return '👋 Welcome back to SVEC! Choose from the menu below:\n\n1️⃣ 📝 Admissions & Eligibility\n\n2️⃣ 🎓 Departments & Programs\n\n3️⃣ 👨‍🏫 Faculty Information\n\n4️⃣ 🏢 Facilities & Infrastructure\n\n5️⃣ 💼 Placements & Careers\n\n6️⃣ 💰 Fees & Scholarships\n\n7️⃣ 📞 Contact Information\n\n✨ Type the number or ask me anything directly!';
    }

    // Quick answers for common greetings
    if (input.includes('hi') || input.includes('hello') || input.includes('hey')) {
      return "👋 Hello! Welcome to SVEC! Type a number (1-7) from the menu above or ask me anything directly!";
    }
    
    if (input.includes('thank') || input.includes('thanks')) {
      return "😊 You're welcome! Any more questions about SVEC?";
    }
    
    if (input.includes('bye') || input.includes('goodbye')) {
      return "👋 Thanks for visiting! Visit www.srivasaviengg.ac.in or call 08818-284355. Have a great day!";
    }
    
    // Return random fallback response
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = inputValue;
    setInputValue('');
    setShowSuggestions(false);
    setIsTyping(true);

    // Process the user input
    processBotResponse(userInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    console.log('Chat toggle clicked, current state:', isOpen);
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-[9999]">
      {!isOpen ? (
        // Collapsed Chat Button
        <button
          onClick={toggleChat}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
          aria-label="Open live chat"
          style={{ 
            boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
            border: '2px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm font-medium">Chat</span>
        </button>
      ) : (
        // Expanded Chat Window
        <div
          className="bg-white rounded-lg shadow-2xl w-72 sm:w-80 h-80 sm:h-96 flex flex-col animate-slide-up backdrop-blur-sm bg-opacity-95 absolute bottom-0 right-0"
          role="dialog"
          aria-label="Live Chat"
        >
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">Chat with Us</span>
            </div>
            <button
              onClick={toggleChat}
              className="text-white hover:text-gray-200 transition-colors duration-200"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message.text}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))}
            {isTyping && <TypingIndicator />}
            
            {/* Quick Suggestions */}
            {showSuggestions && messages.length === 1 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-gray-500 mb-2">Quick Questions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion.query)}
                      className="text-left p-2 text-xs bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200"
                      disabled={isTyping}
                    >
                      {suggestion.text}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Type your message"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={inputValue.trim() === '' || isTyping}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors duration-200"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
