import { useState, useEffect, useRef } from "react";
import selkteckIcon from "./assets/selkteck-logo.png";

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [expandedPartner, setExpandedPartner] = useState<number | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const caseStudiesRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Using Formspree with your email
      const response = await fetch('https://formspree.io/f/SultanGenerateCode@Gmail.com', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setFormSubmitted(true);
        setTimeout(() => {
          setFormSubmitted(false);
          setFormData({ name: '', email: '', company: '', message: '' });
        }, 3000);
      } else {
        // Fallback: Open email client
        const subject = encodeURIComponent(`New Contact from ${formData.name} - ${formData.company || 'SelkTeck Website'}`);
        const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company}\n\nMessage:\n${formData.message}`);
        window.location.href = `mailto:SultanGenerateCode@Gmail.com?subject=${subject}&body=${body}`;
        setFormSubmitted(true);
        setTimeout(() => {
          setFormSubmitted(false);
          setFormData({ name: '', email: '', company: '', message: '' });
        }, 3000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      // Fallback: Open email client
      const subject = encodeURIComponent(`New Contact from ${formData.name} - ${formData.company || 'SelkTeck Website'}`);
      const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company}\n\nMessage:\n${formData.message}`);
      window.location.href = `mailto:SultanGenerateCode@Gmail.com?subject=${subject}&body=${body}`;
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({ name: '', email: '', company: '', message: '' });
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToCaseStudies = () => {
    caseStudiesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setLoginError(''); // Clear error on input change
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    // Simulate API call delay
    setTimeout(() => {
      setIsLoggingIn(false);
      setLoginError('Unauthorized: Invalid credentials. Access denied.');
      // Clear the password field
      setLoginData(prev => ({ ...prev, password: '' }));
    }, 1500);
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    for (let index = 0; index < cardRefs.current.length; index++) {
      const card = cardRefs.current[index];
      if (card) {
        const observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) {
                setVisibleCards(prev => {
                  if (!prev.includes(index)) {
                    return [...prev, index];
                  }
                  return prev;
                });
                observer.unobserve(card);
              }
            }
          },
          { threshold: 0.1 }
        );
        observer.observe(card);
        observers.push(observer);
      }
    }

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  const getCardAnimation = (index: number) => {
    const isVisible = visibleCards.includes(index);
    return {
      transition: 'all 0.6s ease-out',
      opacity: isVisible ? 1 : 0.3,
      transform: isVisible ? 'translateY(0px)' : 'translateY(20px)',
    };
  };

  return (
    <div className="min-h-screen font-sans">
      {/* Navigation bar */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between py-6 px-4">
        <div className="flex items-center">
          <img src={selkteckIcon} alt="SelkTeck Icon" className="h-12 w-auto mr-3" />
          <span className="text-2xl font-new-hero text-gray-900 tracking-tight select-none">SelkTeck. LLC</span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            className="bg-white border-2 border-[#A68660] text-[#A68660] rounded-full px-6 py-3 text-sm font-golos transition-all duration-300 hover:bg-[#A68660] hover:text-white hover:shadow-lg"
            onClick={() => setShowLoginModal(true)}
          >
            Login
          </button>
          <button
            className="bg-white border-2 border-gray-900 rounded-full px-6 py-3 text-sm font-golos text-gray-900 transition-all duration-300 hover:bg-gray-50 hover:shadow-lg"
            onClick={scrollToContact}
          >
            Contact Us
          </button>
        </div>
      </nav>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-slideUp">
            {/* Close Button */}
            <button
              onClick={() => {
                setShowLoginModal(false);
                setLoginError('');
                setLoginData({ email: '', password: '' });
              }}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header Section */}
            <div className="bg-gradient-to-br from-[#A68660] to-[#8B6F47] p-8 pb-12">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-new-hero text-white text-center mb-2">Welcome Back</h2>
              <p className="text-white/80 font-golos text-center text-sm">Sign in to access your dashboard</p>
            </div>

            {/* Form Section */}
            <div className="p-8 -mt-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  {/* Email Field */}
                  <div>
                    <label htmlFor="login-email" className="block text-sm font-golos text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        id="login-email"
                        name="email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#A68660] focus:outline-none transition-colors font-golos"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="login-password" className="block text-sm font-golos text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        type="password"
                        id="login-password"
                        name="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#A68660] focus:outline-none transition-colors font-golos"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  {loginError && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start space-x-3 animate-shake">
                      <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p className="text-sm font-golos text-red-800">{loginError}</p>
                    </div>
                  )}

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-[#A68660] border-gray-300 rounded focus:ring-[#A68660]" />
                      <span className="ml-2 text-sm font-golos text-gray-600">Remember me</span>
                    </label>
                    <a href="#" className="text-sm font-golos text-[#A68660] hover:text-[#8B6F47] transition-colors">
                      Forgot password?
                    </a>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full bg-gradient-to-r from-[#A68660] to-[#8B6F47] text-white rounded-xl py-3 font-golos font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isLoggingIn ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <span>Sign In</span>
                    )}
                  </button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center">
                  <p className="text-sm font-golos text-gray-600">
                    Don't have an account?{' '}
                    <a href="#" className="text-[#A68660] hover:text-[#8B6F47] font-medium transition-colors">
                      Sign up
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero section */}
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-white to-[#E8F5E4] p-8 md:p-12 shadow-xl">
          {/* Centered content */}
          <div className="text-center">
            <div className={`transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              <h1 className="text-5xl font-new-hero leading-tight md:text-6xl">
                From Idea to <span className="text-[#A68660]">Implementation</span><span className="text-green-600">.</span>
              </h1>
              <p className="mt-6 text-lg font-golos text-gray-600 md:text-xl max-w-3xl mx-auto">
                We take businesses from concept to reality—whether you need an intelligent AI system, a custom application, or robust cloud infrastructure to power it all.
              </p>
              <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
                <button
                  className="bg-[#A68660] hover:bg-[#8B6F47] border-2 border-[#A68660] rounded-full px-8 py-3 text-sm font-golos text-white transition-all duration-300 hover:shadow-lg"
                  onClick={scrollToContact}
                >
                  Get Started
                </button>
                <button
                  className="flex items-center rounded-lg px-6 py-3 text-sm font-golos transition-all duration-300 hover:text-green-700 justify-center"
                  onClick={scrollToCaseStudies}
                >
                  View Our Work
                  <span className="ml-2 text-green-600">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-gradient-to-r from-white to-[#E8F5E4] py-20">
        <div className="mx-auto max-w-7xl px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-new-hero text-gray-900 mb-6">
              What We <span className="text-[#A68660]">Build</span>
            </h2>
            <p className="text-lg md:text-xl font-golos text-gray-600 max-w-3xl mx-auto">
              We're not just developers—we're technology partners who solve real problems with modern solutions
            </p>
          </div>

          {/* Services Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {/* Card 1: AI Systems */}
            <div
              ref={(el) => { cardRefs.current[0] = el; }}
              className="bg-white/80 rounded-2xl p-6 border border-gray-200/50 hover:border-green-600/50 hover:shadow-lg transition-all duration-300 group backdrop-blur-sm"
              style={getCardAnimation(0)}
            >
              <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-600/30 transition-colors">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-gray-900 font-new-hero text-lg mb-3">Intelligent AI Systems</h3>
              <p className="text-gray-600 font-golos text-sm leading-relaxed">
                Custom AI solutions that automate processes, enhance decision-making, and unlock new capabilities for your business.
              </p>
            </div>

            {/* Card 2: Custom Applications */}
            <div
              ref={(el) => { cardRefs.current[1] = el; }}
              className="bg-white/80 rounded-2xl p-6 border border-gray-200/50 hover:border-[#A68660]/50 hover:shadow-lg transition-all duration-300 group backdrop-blur-sm"
              style={getCardAnimation(1)}
            >
              <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-600/30 transition-colors">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-gray-900 font-new-hero text-lg mb-3">Custom Applications</h3>
              <p className="text-gray-600 font-golos text-sm leading-relaxed">
                Web, mobile, and enterprise applications built from scratch to match your exact requirements and scale with your growth.
              </p>
            </div>

            {/* Card 3: Cloud Infrastructure */}
            <div
              ref={(el) => { cardRefs.current[2] = el; }}
              className="bg-white/80 rounded-2xl p-6 border border-gray-200/50 hover:border-[#A68660]/50 hover:shadow-lg transition-all duration-300 group backdrop-blur-sm"
              style={getCardAnimation(2)}
            >
              <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-600/30 transition-colors">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-gray-900 font-new-hero text-lg mb-3">Cloud Infrastructure</h3>
              <p className="text-gray-600 font-golos text-sm leading-relaxed">
                Robust, scalable cloud solutions on AWS, Azure, or GCP—designed for security, performance, and cost efficiency.
              </p>
            </div>

            {/* Card 4: Data & Analytics */}
            <div
              ref={(el) => { cardRefs.current[3] = el; }}
              className="bg-white/80 rounded-2xl p-6 border border-gray-200/50 hover:border-[#A68660]/50 hover:shadow-lg transition-all duration-300 group backdrop-blur-sm"
              style={getCardAnimation(3)}
            >
              <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-600/30 transition-colors">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-gray-900 font-new-hero text-lg mb-3">Data & Analytics</h3>
              <p className="text-gray-600 font-golos text-sm leading-relaxed">
                Turn your data into actionable insights with modern data pipelines, dashboards, and machine learning models.
              </p>
            </div>

            {/* Card 5: Technical Consulting */}
            <div
              ref={(el) => { cardRefs.current[4] = el; }}
              className="bg-white/80 rounded-2xl p-6 border border-gray-200/50 hover:border-[#A68660]/50 hover:shadow-lg transition-all duration-300 group backdrop-blur-sm"
              style={getCardAnimation(4)}
            >
              <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-600/30 transition-colors">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-gray-900 font-new-hero text-lg mb-3">Technical Consulting</h3>
              <p className="text-gray-600 font-golos text-sm leading-relaxed">
                Strategic guidance on architecture, technology stack, and digital transformation to help you make the right decisions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Case Studies / Portfolio Section */}
      <div className="bg-gradient-to-r from-white to-[#E8F5E4] py-20" ref={caseStudiesRef}>
        <div className="mx-auto max-w-7xl px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-new-hero text-gray-900 mb-6">
              Our <span className="text-[#A68660]">Work</span>
            </h2>
            <p className="text-lg md:text-xl font-golos text-gray-600 max-w-3xl mx-auto">
              See how we've helped businesses transform their ideas into successful digital solutions
            </p>
          </div>

          {/* Video Showcase */}
          <div className="max-w-5xl mx-auto">
            {/* Video Container with Beautiful Frame */}
            <div className="relative group">
              {/* Decorative Elements */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#A68660]/20 via-green-500/20 to-[#A68660]/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-50" />
              
              {/* Main Video Card */}
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50">
                {/* Video Player */}
                <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800">
                  <video 
                    className="w-full h-full object-cover"
                    controls
                    poster="/Pic.png"
                  >
                    <source src="/Vid.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  
                  {/* Optional Play Button Overlay (if you want custom styling) */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <div className="w-16 h-16 bg-[#A68660] rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video Info Bar */}
                <div className="bg-gradient-to-r from-white to-gray-50 p-6 border-t border-gray-100">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <div>
                      <h3 className="text-xl font-new-hero text-gray-900 mb-1">
                        Watch Our Success Stories
                      </h3>
                      <p className="text-gray-600 font-golos text-sm">
                        See how we transform ideas into powerful digital solutions
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-sm font-golos text-gray-600">Live Projects</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Corner Accents */}
              <div className="absolute -top-3 -left-3 w-24 h-24 bg-[#A68660]/10 rounded-full blur-xl" />
              <div className="absolute -bottom-3 -right-3 w-32 h-32 bg-green-500/10 rounded-full blur-xl" />
            </div>
          </div>

          {/* View All Projects Button */}
          <div className="text-center mt-12">
            <button className="bg-[#A68660] hover:bg-[#8B6F47] text-white border-2 border-[#A68660] rounded-full px-8 py-4 font-golos transition-all duration-300 hover:shadow-lg">
              View All Projects
            </button>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-gradient-to-r from-white to-[#E8F5E4] py-20">
        <div className="mx-auto max-w-7xl px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-new-hero text-gray-900 mb-6">
              Our Process
            </h2>
            <p className="text-lg md:text-xl font-golos text-gray-600 max-w-3xl mx-auto">
              A proven methodology that turns your vision into reality, step by step
            </p>
          </div>

          {/* Process Grid */}
          <div className="relative">
            {/* Connecting Lines */}
            <div className="absolute inset-0 pointer-events-none hidden lg:block">
              <div className="absolute top-[20%] left-[25%] w-[25%] h-0.5 bg-gradient-to-r from-[#A68660] to-[#8B6F47] opacity-60" />
              <div className="absolute top-[70%] left-[25%] w-[25%] h-0.5 bg-gradient-to-r from-[#A68660] to-[#8B6F47] opacity-60" />
              <div className="absolute top-[30%] left-[75%] w-0.5 h-[30%] bg-gradient-to-b from-[#8B6F47] to-[#A68660] opacity-60" />
              <div className="absolute top-[35%] left-[40%] w-0.5 h-[20%] bg-gradient-to-b from-[#A68660] to-[#8B6F47] opacity-40 transform rotate-45 origin-top" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* Step 1 - Discovery */}
              <div className="relative">
                <div className="bg-white/80 rounded-2xl p-8 border border-gray-200/50 hover:border-[#A68660]/50 hover:shadow-lg transition-all duration-300 backdrop-blur-sm group">
                  <div className="absolute -top-4 left-8">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:bg-white transition-colors">
                      <span className="text-[#A68660] font-bold text-small">01</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-2xl font-new-hero text-gray-900 mb-2">Discovery & Strategy</h3>
                    <div className="space-y-3 text-gray-600 font-golos">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-[#A68660] rounded-full mt-2 flex-shrink-0" />
                        <span>Deep dive into your business goals and challenges</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-[#A68660] rounded-full mt-2 flex-shrink-0" />
                        <span>Technical assessment and feasibility analysis</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-[#A68660] rounded-full mt-2 flex-shrink-0" />
                        <span>Custom roadmap and technology recommendations</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 - Design */}
              <div className="relative">
                <div className="bg-white/80 rounded-2xl p-8 border border-gray-200/50 hover:border-[#A68660]/50 hover:shadow-lg transition-all duration-300 backdrop-blur-sm group">
                  <div className="absolute -top-4 left-8">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:bg-white transition-colors">
                      <span className="text-[#A68660] font-bold text-small">02</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-2xl font-new-hero text-gray-900 mb-2">Design & Architecture</h3>
                    <div className="space-y-3 text-gray-600 font-golos">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-[#A68660] rounded-full mt-2 flex-shrink-0" />
                        <span>User experience design and prototyping</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-[#A68660] rounded-full mt-2 flex-shrink-0" />
                        <span>System architecture and infrastructure planning</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-[#A68660] rounded-full mt-2 flex-shrink-0" />
                        <span>Security and scalability considerations</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 - Development */}
              <div className="relative">
                <div className="bg-white/80 rounded-2xl p-8 border border-gray-200/50 hover:border-[#A68660]/50 hover:shadow-lg transition-all duration-300 backdrop-blur-sm group">
                  <div className="absolute -top-4 left-8">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:bg-white transition-colors">
                      <span className="text-[#A68660] font-bold text-small">03</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-2xl font-new-hero text-gray-900 mb-2">Development & Testing</h3>
                    <div className="space-y-3 text-gray-600 font-golos">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-[#A68660] rounded-full mt-2 flex-shrink-0" />
                        <span>Agile development with regular check-ins</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-[#A68660] rounded-full mt-2 flex-shrink-0" />
                        <span>Continuous integration and automated testing</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-[#A68660] rounded-full mt-2 flex-shrink-0" />
                        <span>Quality assurance and performance optimization</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 - Launch & Support */}
              <div className="relative">
                <div className="bg-white/80 rounded-2xl p-8 border border-gray-200/50 hover:border-[#A68660]/50 hover:shadow-lg transition-all duration-300 backdrop-blur-sm group">
                  <div className="absolute -top-4 left-8">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:bg-white transition-colors">
                      <span className="text-[#A68660] font-bold text-small">04</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-2xl font-new-hero text-gray-900 mb-2">Launch & Support</h3>
                    <div className="space-y-3 text-gray-600 font-golos">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-[#A68660] rounded-full mt-2 flex-shrink-0" />
                        <span>Seamless deployment and go-live assistance</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-[#A68660] rounded-full mt-2 flex-shrink-0" />
                        <span>Training and documentation for your team</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-[#A68660] rounded-full mt-2 flex-shrink-0" />
                        <span>Ongoing maintenance, updates, and support</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Partner With Us Section */}
      <div className="bg-gradient-to-r from-white to-[#E8F5E4] py-20">
        <div className="mx-auto max-w-5xl px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-new-hero text-gray-900 mb-4">
              Why Partner With <span className="text-[#A68660]">Us</span>
            </h2>
          </div>

          {/* Accordion Rows */}
          <div className="space-y-2">
            {/* Accordion 1 - AI Expertise */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-300">
              <button
                onClick={() => setExpandedPartner(expandedPartner === 1 ? null : 1)}
                className="w-full flex items-center justify-between px-8 py-5 text-left hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-xl font-new-hero text-gray-900">AI Expertise</h3>
                <svg
                  className={`w-5 h-5 text-[#A68660] transition-transform duration-300 ${expandedPartner === 1 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${expandedPartner === 1 ? 'max-h-96' : 'max-h-0'}`}
              >
                <div className="px-8 pb-6 pt-2">
                  <p className="text-gray-600 font-golos leading-relaxed mb-4">
                    Advanced machine learning models tailored for business applications.
                  </p>
                  <p className="text-gray-600 font-golos leading-relaxed">
                    Our team specializes in developing cutting-edge AI solutions that drive real business value. From natural language processing to computer vision, we build intelligent systems that automate processes, enhance decision-making, and unlock insights from your data. We leverage the latest frameworks and methodologies to deliver models that are not only accurate but also scalable and maintainable in production environments.
                  </p>
                </div>
              </div>
            </div>

            {/* Accordion 2 - Enterprise Grade */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-300">
              <button
                onClick={() => setExpandedPartner(expandedPartner === 2 ? null : 2)}
                className="w-full flex items-center justify-between px-8 py-5 text-left hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-xl font-new-hero text-gray-900">Enterprise Grade</h3>
                <svg
                  className={`w-5 h-5 text-[#A68660] transition-transform duration-300 ${expandedPartner === 2 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${expandedPartner === 2 ? 'max-h-96' : 'max-h-0'}`}
              >
                <div className="px-8 pb-6 pt-2">
                  <p className="text-gray-600 font-golos leading-relaxed mb-4">
                    Secure, scalable, and reliable cloud infrastructure.
                  </p>
                  <p className="text-gray-600 font-golos leading-relaxed">
                    We build enterprise-grade solutions with security and scalability at their core. Our infrastructure is designed to handle millions of requests while maintaining 99.99% uptime. We implement industry-standard security protocols, data encryption, and compliance measures to protect your business and customers. Every system we build is architected for growth, allowing you to scale seamlessly as your business expands without worrying about technical limitations.
                  </p>
                </div>
              </div>
            </div>

            {/* Accordion 3 - Based in Oman */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-300">
              <button
                onClick={() => setExpandedPartner(expandedPartner === 3 ? null : 3)}
                className="w-full flex items-center justify-between px-8 py-5 text-left hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-xl font-new-hero text-gray-900">Based in Oman</h3>
                <svg
                  className={`w-5 h-5 text-[#A68660] transition-transform duration-300 ${expandedPartner === 3 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${expandedPartner === 3 ? 'max-h-96' : 'max-h-0'}`}
              >
                <div className="px-8 pb-6 pt-2">
                  <p className="text-gray-600 font-golos leading-relaxed mb-4">
                    Local understanding with global technology standards.
                  </p>
                  <p className="text-gray-600 font-golos leading-relaxed">
                    Headquartered in Oman, we bring a unique advantage of understanding regional business culture, regulations, and market dynamics while delivering solutions that meet international standards. We bridge the gap between local needs and global best practices, ensuring your technology investments align with both your immediate market requirements and long-term global ambitions. Our strategic location and cultural expertise make us the ideal partner for businesses operating in the Middle East and beyond.
                  </p>
                </div>
              </div>
            </div>

            {/* Accordion 4 - Data Driven */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-300">
              <button
                onClick={() => setExpandedPartner(expandedPartner === 4 ? null : 4)}
                className="w-full flex items-center justify-between px-8 py-5 text-left hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-xl font-new-hero text-gray-900">Data Driven</h3>
                <svg
                  className={`w-5 h-5 text-[#A68660] transition-transform duration-300 ${expandedPartner === 4 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${expandedPartner === 4 ? 'max-h-96' : 'max-h-0'}`}
              >
                <div className="px-8 pb-6 pt-2">
                  <p className="text-gray-600 font-golos leading-relaxed mb-4">
                    Decisions backed by powerful analytics and real-time data.
                  </p>
                  <p className="text-gray-600 font-golos leading-relaxed">
                    We believe in the power of data to drive meaningful business outcomes. Every solution we build incorporates comprehensive analytics and real-time monitoring capabilities, giving you actionable insights into your operations. From user behavior tracking to predictive analytics, we help you make informed decisions based on facts, not assumptions. Our data pipelines are designed to process and visualize information in ways that are immediately useful to your business, turning raw data into strategic advantages.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="bg-gradient-to-r from-white to-[#E8F5E4] py-20" ref={contactRef}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Text */}
            <div>
              <h2 className="text-4xl md:text-5xl font-new-hero text-gray-900 mb-6">
                Let's Build Something Great Together
              </h2>
              <p className="text-lg md:text-xl font-golos text-gray-600 mb-8">
                Ready to transform your idea into reality? Get in touch with our team and let's discuss how we can help your business grow.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#A68660]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#A68660]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-new-hero text-gray-900 mb-1">Email Us</h4>
                    <p className="font-golos text-gray-600">selkteck@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#A68660]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#A68660]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-new-hero text-gray-900 mb-1">Response Time</h4>
                    <p className="font-golos text-gray-600">We typically respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#A68660]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#A68660]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-new-hero text-gray-900 mb-1">Location</h4>
                    <p className="font-golos text-gray-600">Available worldwide, remote-first</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="bg-white/80 rounded-2xl p-8 border border-gray-200/50 backdrop-blur-sm shadow-lg">
              {formSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-new-hero text-gray-900 mb-2">Message Sent!</h3>
                  <p className="font-golos text-gray-600">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-golos text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#A68660] focus:ring-2 focus:ring-[#A68660]/20 outline-none transition-all font-golos"
                      placeholder="Mohammed Munther"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-golos text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#A68660] focus:ring-2 focus:ring-[#A68660]/20 outline-none transition-all font-golos"
                      placeholder="Mohammed@Gmail.com"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-golos text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#A68660] focus:ring-2 focus:ring-[#A68660]/20 outline-none transition-all font-golos"
                      placeholder="Your Company"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-golos text-gray-700 mb-2">
                      Tell Us About Your Project
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleFormChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#A68660] focus:ring-2 focus:ring-[#A68660]/20 outline-none transition-all font-golos resize-none"
                      placeholder="Describe your project or idea..."
                      disabled={isSubmitting}
                    />
                  </div>

                  <button
                    type="submit"
                    className={`w-full bg-[#A68660] text-white rounded-full px-8 py-4 font-golos transition-all duration-300 hover:bg-[#8B6F47] hover:shadow-lg ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gradient-to-r from-white to-[#E8F5E4] py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-6 md:space-y-0">
            {/* Logo - Left Side */}
            <div className="flex justify-center md:justify-start items-center">
              <img src={selkteckIcon} alt="SelkTeck Icon" className="h-16 w-auto mr-3" />
              <span className="text-2xl font-new-hero text-gray-900 tracking-tight select-none">SelkTeck. LLC</span>
            </div>

            {/* Contact Link - Right Side */}
            <div className="flex justify-center md:justify-end">
              <a
                href="mailto:SelkTeck@Gmail.com"
                className="group"
              >
                <div className="flex items-center space-x-3 bg-white border-2 border-[#A68660] rounded-full px-8 py-4 hover:bg-[#F5F5F0] transition-all duration-300 hover:shadow-lg">
                  <svg
                    className="w-5 h-5 text-[#A68660]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="font-golos text-[#A68660] font-medium">
                    Get in Touch
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-gray-200/50 text-center">
            <p className="text-gray-500 font-golos text-sm">
              © 2025 SelkTeck. LLC. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

