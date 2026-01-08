import { useState, useEffect, useRef } from "react";
import selkteckIcon from "./assets/selkteck-icon.svg";
import ombrettaPhoto from "./assets/Ombretta.jpeg";
import kylePhoto from "./assets/Kyle.png";
import tegPhoto from "./assets/teg.jpeg";
import emmaPhoto from "./assets/emma.jpeg";

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
              }
            }
          },
          { threshold: 0.2, rootMargin: '0px 0px -100px 0px' }
        );

        observer.observe(card);
        observers.push(observer);
      }
    }

    return () => {
      for (const observer of observers) {
        observer.disconnect();
      }
    };
  }, []);

  const getCardAnimation = (index: number) => {
    const isVisible = visibleCards.includes(index);
    const delay = index * 150;

    return {
      transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
      opacity: isVisible ? 1 : 0,
      transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
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
        <button
          className="bg-white border-2 border-gray-900 rounded-full px-6 py-3 text-sm font-golos text-gray-900 transition-all duration-300 hover:bg-gray-50 hover:shadow-lg"
          onClick={scrollToContact}
        >
          Contact Us
        </button>
      </nav>

      {/* Hero section */}
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-white to-[#FEF5E5] p-8 md:p-12 shadow-xl">
          {/* Centered content */}
          <div className="text-center">
            <div className={`transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              <h1 className="text-5xl font-new-hero leading-tight md:text-6xl">
                From Idea to Implementation<span className="text-orange-500">.</span>
              </h1>
              <p className="mt-6 text-lg font-golos text-gray-600 md:text-xl max-w-3xl mx-auto">
                We take businesses from concept to reality—whether you need an intelligent AI system, a custom application, or robust cloud infrastructure to power it all.
              </p>
              <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
                <button
                  className="bg-white border-2 border-gray-900 rounded-full px-8 py-3 text-sm font-golos text-gray-900 transition-all duration-300 hover:bg-gray-50 hover:shadow-lg"
                  onClick={scrollToContact}
                >
                  Get Started
                </button>
                <button
                  className="flex items-center rounded-lg px-6 py-3 text-sm font-golos transition-all duration-300 hover:text-gray-700 justify-center"
                  onClick={scrollToCaseStudies}
                >
                  View Our Work
                  <span className="ml-2 text-orange-500">→</span>
                </button>
              </div>
            </div>

            {/* Stats/Showcase Section - Replacing Video */}
            <div className={`mt-16 transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{ transitionDelay: "400ms" }}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                <div className="text-center p-6">
                  <div className="text-4xl md:text-5xl font-new-hero text-orange-500 mb-2">50+</div>
                  <div className="text-gray-600 font-golos text-sm">Projects Delivered</div>
                </div>
                <div className="text-center p-6">
                  <div className="text-4xl md:text-5xl font-new-hero text-orange-500 mb-2">98%</div>
                  <div className="text-gray-600 font-golos text-sm">Client Satisfaction</div>
                </div>
                <div className="text-center p-6">
                  <div className="text-4xl md:text-5xl font-new-hero text-orange-500 mb-2">15+</div>
                  <div className="text-gray-600 font-golos text-sm">Years Experience</div>
                </div>
                <div className="text-center p-6">
                  <div className="text-4xl md:text-5xl font-new-hero text-orange-500 mb-2">24/7</div>
                  <div className="text-gray-600 font-golos text-sm">Support Available</div>
                </div>
              </div>
            </div>
          </div>

          {/* Partner logos */}
          <div className={`mt-16 hidden border-t border-gray-200 pt-8 md:block transition-all duration-1000 ${
            isLoaded ? "opacity-70" : "opacity-0"
          }`} style={{ transitionDelay: "800ms" }}>
            <p className="text-center text-sm font-golos text-gray-500 mb-6">Trusted by Industry Leaders</p>
            <div className="grid grid-cols-5 gap-8 items-center">
              {/* Placeholder logos - Replace with actual client logos */}
              <div className="flex items-center justify-center">
                <div className="h-8 w-32 bg-gray-200/50 rounded flex items-center justify-center">
                  <span className="text-gray-400 font-golos text-xs">Client Logo</span>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="h-8 w-32 bg-gray-200/50 rounded flex items-center justify-center">
                  <span className="text-gray-400 font-golos text-xs">Client Logo</span>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="h-8 w-32 bg-gray-200/50 rounded flex items-center justify-center">
                  <span className="text-gray-400 font-golos text-xs">Client Logo</span>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="h-8 w-32 bg-gray-200/50 rounded flex items-center justify-center">
                  <span className="text-gray-400 font-golos text-xs">Client Logo</span>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="h-8 w-32 bg-gray-200/50 rounded flex items-center justify-center">
                  <span className="text-gray-400 font-golos text-xs">Client Logo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-gradient-to-r from-white to-[#FEF5E5] py-20">
        <div className="mx-auto max-w-7xl px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-new-hero text-gray-900 mb-6">
              What We Build
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
              className="bg-white/80 rounded-2xl p-6 border border-gray-200/50 hover:border-orange-500/50 hover:shadow-lg transition-all duration-300 group backdrop-blur-sm"
              style={getCardAnimation(0)}
            >
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-500/30 transition-colors">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="bg-white/80 rounded-2xl p-6 border border-gray-200/50 hover:border-orange-500/50 hover:shadow-lg transition-all duration-300 group backdrop-blur-sm"
              style={getCardAnimation(1)}
            >
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-500/30 transition-colors">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="bg-white/80 rounded-2xl p-6 border border-gray-200/50 hover:border-orange-500/50 hover:shadow-lg transition-all duration-300 group backdrop-blur-sm"
              style={getCardAnimation(2)}
            >
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-500/30 transition-colors">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="bg-white/80 rounded-2xl p-6 border border-gray-200/50 hover:border-orange-500/50 hover:shadow-lg transition-all duration-300 group backdrop-blur-sm"
              style={getCardAnimation(3)}
            >
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-500/30 transition-colors">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="bg-white/80 rounded-2xl p-6 border border-gray-200/50 hover:border-orange-500/50 hover:shadow-lg transition-all duration-300 group backdrop-blur-sm"
              style={getCardAnimation(4)}
            >
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-500/30 transition-colors">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <div className="bg-gradient-to-r from-white to-[#FEF5E5] py-20" ref={caseStudiesRef}>
        <div className="mx-auto max-w-7xl px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-new-hero text-gray-900 mb-6">
              Our Work
            </h2>
            <p className="text-lg md:text-xl font-golos text-gray-600 max-w-3xl mx-auto">
              See how we've helped businesses transform their ideas into successful digital solutions
            </p>
          </div>

          {/* Case Studies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Case Study 1 */}
            <div className="group cursor-pointer">
              <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl p-8 h-64 mb-4 transition-all duration-300 group-hover:shadow-lg group-hover:scale-[1.02] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <span className="text-gray-500 font-golos text-sm">AI & Machine Learning</span>
                </div>
              </div>
              <h3 className="text-xl font-new-hero text-gray-900 mb-2">AI-Powered Customer Service Platform</h3>
              <p className="text-gray-600 font-golos text-sm mb-3">
                Built an intelligent chatbot that reduced support tickets by 60% and improved response time by 80%.
              </p>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-golos">AI</span>
                <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-golos">NLP</span>
                <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-golos">Cloud</span>
              </div>
            </div>

            {/* Case Study 2 */}
            <div className="group cursor-pointer">
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-8 h-64 mb-4 transition-all duration-300 group-hover:shadow-lg group-hover:scale-[1.02] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-gray-500 font-golos text-sm">Mobile Development</span>
                </div>
              </div>
              <h3 className="text-xl font-new-hero text-gray-900 mb-2">Enterprise Mobile App Suite</h3>
              <p className="text-gray-600 font-golos text-sm mb-3">
                Developed cross-platform mobile apps for field teams, increasing productivity by 45% across 500+ users.
              </p>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-golos">React Native</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-golos">iOS</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-golos">Android</span>
              </div>
            </div>

            {/* Case Study 3 */}
            <div className="group cursor-pointer">
              <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-2xl p-8 h-64 mb-4 transition-all duration-300 group-hover:shadow-lg group-hover:scale-[1.02] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  </div>
                  <span className="text-gray-500 font-golos text-sm">Cloud Infrastructure</span>
                </div>
              </div>
              <h3 className="text-xl font-new-hero text-gray-900 mb-2">Cloud Migration & Optimization</h3>
              <p className="text-gray-600 font-golos text-sm mb-3">
                Migrated legacy systems to AWS, reducing infrastructure costs by 40% while improving uptime to 99.99%.
              </p>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-golos">AWS</span>
                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-golos">DevOps</span>
                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-golos">Kubernetes</span>
              </div>
            </div>
          </div>

          {/* View All Projects Button */}
          <div className="text-center mt-12">
            <button
              className="bg-white border-2 border-gray-900 rounded-full px-8 py-3 text-sm font-golos text-gray-900 transition-all duration-300 hover:bg-gray-50 hover:shadow-lg"
              onClick={scrollToCaseStudies}
            >
              View All Projects
            </button>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gradient-to-r from-white to-[#FEF5E5] py-20">
        <div className="mx-auto max-w-7xl px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-new-hero text-gray-900 mb-6">
              Meet Our Team
            </h2>
            <p className="text-lg md:text-xl font-golos text-gray-600 max-w-3xl mx-auto">
              The passionate innovators building technology solutions that transform businesses
            </p>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Team Member 1 */}
            <div className="group">
              <div className="rounded-3xl p-8 h-96 overflow-hidden transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-new-hero text-gray-800 mb-2">Dr. Ombretta Para</h3>
                  <p className="text-gray-600 font-golos">Chief Technology Officer</p>
                </div>

                <div className="w-32 h-32 mb-4">
                  <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={ombrettaPhoto}
                      alt="Dr. Ombretta Para"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <a
                  href="https://www.linkedin.com/in/ombretta-para-646066241/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/60 hover:bg-white/80 rounded-full flex items-center justify-center transition-all duration-300 opacity-60 filter grayscale hover:opacity-80 hover:filter-none"
                  title="Connect on LinkedIn"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="group">
              <div className="rounded-3xl p-8 h-96 overflow-hidden transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-new-hero text-gray-800 mb-2">Kyle Rood</h3>
                  <p className="text-gray-600 font-golos">Lead Developer</p>
                </div>

                <div className="w-32 h-32 mb-4">
                  <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={kylePhoto}
                      alt="Kyle Rood"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <a
                  href="https://www.linkedin.com/in/kyle-rood/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/60 hover:bg-white/80 rounded-full flex items-center justify-center transition-all duration-300 opacity-60 filter grayscale hover:opacity-80 hover:filter-none"
                  title="Connect on LinkedIn"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="group">
              <div className="rounded-3xl p-8 h-96 overflow-hidden transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-new-hero text-gray-800 mb-2">Teg Grenager</h3>
                  <p className="text-gray-600 font-golos">Solutions Architect</p>
                </div>

                <div className="w-32 h-32 mb-4">
                  <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={tegPhoto}
                      alt="Teg Grenager"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <a
                  href="https://www.linkedin.com/in/grenager/?trk=lil_instructor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/60 hover:bg-white/80 rounded-full flex items-center justify-center transition-all duration-300 opacity-60 filter grayscale hover:opacity-80 hover:filter-none"
                  title="Connect on LinkedIn"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Team Member 4 */}
            <div className="group">
              <div className="rounded-3xl p-8 h-96 overflow-hidden transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-new-hero text-gray-800 mb-2">Emmanuel Henri</h3>
                  <p className="text-gray-600 font-golos">UI/UX Designer</p>
                </div>

                <div className="w-32 h-32 mb-4">
                  <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={emmaPhoto}
                      alt="Emmanuel Henri"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <a
                  href="https://www.linkedin.com/in/mannyhenri/?trk=lil_instructor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/60 hover:bg-white/80 rounded-full flex items-center justify-center transition-all duration-300 opacity-60 filter grayscale hover:opacity-80 hover:filter-none"
                  title="Connect on LinkedIn"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-gradient-to-r from-white to-[#FEF5E5] py-20">
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
              <div className="absolute top-[20%] left-[25%] w-[25%] h-0.5 bg-gradient-to-r from-orange-500 to-orange-400 opacity-60" />
              <div className="absolute top-[70%] left-[25%] w-[25%] h-0.5 bg-gradient-to-r from-orange-500 to-orange-400 opacity-60" />
              <div className="absolute top-[30%] left-[75%] w-0.5 h-[30%] bg-gradient-to-b from-orange-400 to-orange-500 opacity-60" />
              <div className="absolute top-[35%] left-[40%] w-0.5 h-[20%] bg-gradient-to-b from-orange-500 to-orange-400 opacity-40 transform rotate-45 origin-top" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* Step 1 - Discovery */}
              <div className="relative">
                <div className="bg-white/80 rounded-2xl p-8 border border-gray-200/50 hover:border-orange-500/50 hover:shadow-lg transition-all duration-300 backdrop-blur-sm group">
                  <div className="absolute -top-4 left-8">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:bg-white transition-colors">
                      <span className="text-orange-500 font-bold text-small">01</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-2xl font-new-hero text-gray-900 mb-2">Discovery & Strategy</h3>
                    <div className="space-y-3 text-gray-600 font-golos">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                        <span>Deep dive into your business goals and challenges</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                        <span>Technical assessment and feasibility analysis</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                        <span>Custom roadmap and technology recommendations</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 - Design */}
              <div className="relative">
                <div className="bg-white/80 rounded-2xl p-8 border border-gray-200/50 hover:border-orange-500/50 hover:shadow-lg transition-all duration-300 backdrop-blur-sm group">
                  <div className="absolute -top-4 left-8">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:bg-white transition-colors">
                      <span className="text-orange-500 font-bold text-small">02</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-2xl font-new-hero text-gray-900 mb-2">Design & Architecture</h3>
                    <div className="space-y-3 text-gray-600 font-golos">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                        <span>User experience design and prototyping</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                        <span>System architecture and infrastructure planning</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                        <span>Security and scalability considerations</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 - Development */}
              <div className="relative">
                <div className="bg-white/80 rounded-2xl p-8 border border-gray-200/50 hover:border-orange-500/50 hover:shadow-lg transition-all duration-300 backdrop-blur-sm group">
                  <div className="absolute -top-4 left-8">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:bg-white transition-colors">
                      <span className="text-orange-500 font-bold text-small">03</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-2xl font-new-hero text-gray-900 mb-2">Development & Testing</h3>
                    <div className="space-y-3 text-gray-600 font-golos">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                        <span>Agile development with regular check-ins</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                        <span>Continuous integration and automated testing</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                        <span>Quality assurance and performance optimization</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 - Launch & Support */}
              <div className="relative">
                <div className="bg-white/80 rounded-2xl p-8 border border-gray-200/50 hover:border-orange-500/50 hover:shadow-lg transition-all duration-300 backdrop-blur-sm group">
                  <div className="absolute -top-4 left-8">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:bg-white transition-colors">
                      <span className="text-orange-500 font-bold text-small">04</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-2xl font-new-hero text-gray-900 mb-2">Launch & Support</h3>
                    <div className="space-y-3 text-gray-600 font-golos">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                        <span>Seamless deployment and go-live assistance</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                        <span>Training and documentation for your team</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
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

      {/* Contact Form Section */}
      <div className="bg-gradient-to-r from-white to-[#FEF5E5] py-20" ref={contactRef}>
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
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-new-hero text-gray-900 mb-1">Email Us</h4>
                    <p className="font-golos text-gray-600">hello@selkteck.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-new-hero text-gray-900 mb-1">Response Time</h4>
                    <p className="font-golos text-gray-600">We typically respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-golos"
                      placeholder="John Doe"
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
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-golos"
                      placeholder="john@company.com"
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
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-golos"
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
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-golos resize-none"
                      placeholder="Describe your project or idea..."
                      disabled={isSubmitting}
                    />
                  </div>

                  <button
                    type="submit"
                    className={`w-full bg-gray-900 text-white rounded-full px-8 py-4 font-golos transition-all duration-300 hover:bg-gray-800 hover:shadow-lg ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
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
      <footer className="bg-gradient-to-r from-white to-[#FEF5E5] py-16">
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
                href="mailto:hello@selkteck.com"
                className="group"
              >
                <div className="flex items-center space-x-3 bg-white border-2 border-gray-900 rounded-full px-8 py-4 hover:bg-gray-50 transition-all duration-300 hover:shadow-lg">
                  <svg
                    className="w-5 h-5 text-gray-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="font-golos text-gray-900 font-medium">
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
