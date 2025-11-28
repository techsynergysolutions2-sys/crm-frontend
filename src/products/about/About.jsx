import React, { useState, useEffect } from 'react';
import { Users, Target, Zap, Shield, TrendingUp, Award } from 'lucide-react';
import {useNavigate, Outlet } from 'react-router-dom'

export default function AboutPage() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const values = [
    {
      icon: <Target size={40} />,
      title: 'Customer-Centric',
      description: 'We put our customers at the heart of everything we do, ensuring their success is our success.'
    },
    {
      icon: <Zap size={40} />,
      title: 'Innovation',
      description: 'Constantly evolving with cutting-edge technology to deliver the best CRM experience.'
    },
    {
      icon: <Shield size={40} />,
      title: 'Security First',
      description: 'Enterprise-grade security measures to protect your valuable customer data at all times.'
    },
    {
      icon: <TrendingUp size={40} />,
      title: 'Growth Minded',
      description: 'Empowering businesses to scale and achieve their full potential with intelligent tools.'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Active Users' },
    { number: '95%', label: 'Customer Satisfaction' },
    { number: '150+', label: 'Countries' },
    { number: '24/7', label: 'Support Available' }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Product',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop'
    },
    {
      name: 'David Park',
      role: 'Head of Engineering',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop'
    }
  ];

  return (
    <div className="about-page">
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          overflow-x: hidden;
        }
        
        .about-page {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }
        
        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 120px 0 80px;
          position: relative;
          overflow: hidden;
        }
        
        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grid)"/></svg>');
          opacity: 0.3;
        }
        
        .hero-content {
          position: relative;
          z-index: 1;
          animation: fadeInUp 1s ease-out;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }
        
        .hero-subtitle {
          font-size: 1.3rem;
          opacity: 0.95;
          max-width: 700px;
          margin: 0 auto 2rem;
          line-height: 1.6;
        }
        
        .content-section {
          background: white;
          padding: 80px 0;
        }
        
        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #2d3748;
        }
        
        .section-subtitle {
          font-size: 1.1rem;
          color: #718096;
          max-width: 700px;
          margin: 0 auto 3rem;
        }
        
        .stats-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 60px 0;
          color: white;
        }
        
        .stat-card {
          text-align: center;
          padding: 20px;
        }
        
        .stat-number {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }
        
        .stat-label {
          font-size: 1.1rem;
          opacity: 0.9;
        }
        
        .value-card {
          background: white;
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
          height: 100%;
          border: 1px solid rgba(0,0,0,0.05);
        }
        
        .value-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.12);
        }
        
        .value-icon {
          color: #667eea;
          margin-bottom: 1.5rem;
        }
        
        .value-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #2d3748;
        }
        
        .value-description {
          color: #718096;
          line-height: 1.7;
        }
        
        .team-section {
          background: #f7fafc;
          padding: 80px 0;
        }
        
        .team-card {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .team-image {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 1.5rem;
          border: 5px solid white;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }
        
        .team-card:hover .team-image {
          transform: scale(1.05);
        }
        
        .team-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }
        
        .team-role {
          color: #667eea;
          font-size: 1.1rem;
          font-weight: 500;
        }
        
        .cta-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 80px 0;
          color: white;
          text-align: center;
        }
        
        .cta-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }
        
        .cta-subtitle {
          font-size: 1.2rem;
          opacity: 0.95;
          margin-bottom: 2.5rem;
        }
        
        .btn-cta {
          background: white;
          color: #667eea;
          padding: 15px 40px;
          font-size: 1.1rem;
          font-weight: 600;
          border: none;
          border-radius: 50px;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        
        .btn-cta:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.3);
          background: #f7fafc;
        }
        
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-subtitle {
            font-size: 1.1rem;
          }
          
          .section-title {
            font-size: 2rem;
          }
          
          .stat-number {
            font-size: 2.5rem;
          }
          
          .team-image {
            width: 150px;
            height: 150px;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content text-center">
            <h1 className="hero-title">EBEN<span>crm</span></h1>
            <h1 className="hero-title">Transforming Customer Relationships</h1>
            <p className="hero-subtitle">
              We're on a mission to empower businesses with intelligent CRM solutions that drive growth,
              enhance productivity, and create meaningful customer connections.
            </p>
            <h1 className="hero-title">For only $4.99pm per user</h1>
            <Award size={60} className="mt-4" style={{ opacity: 0.9 }} />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="stats-section">
        <div className="container">
          <div className="row">
            {stats.map((stat, index) => (
              <div key={index} className="col-md-3 col-6">
                <div className="stat-card">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Our Story Section */}
      <section className="content-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="section-title">Our Story</h2>
              <p className="text-muted" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                Founded in 2025, we started with a simple belief: customer relationship management shouldn't be complicated.
                What began as a small team of passionate developers has grown into a global platform serving thousands of businesses worldwide.
              </p>
              <p className="text-muted" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                Today, we continue to innovate and push boundaries, combining artificial intelligence with intuitive design
                to create a CRM that actually works for modern businesses. Our commitment remains unchanged: making customer
                relationships simple, powerful, and profitable.
              </p>
            </div>
            <div className="col-lg-6">
              <img 
                src="https://firebasestorage.googleapis.com/v0/b/crm-solutions-34e5f.firebasestorage.app/o/tasks.PNG?alt=media&token=aeb1b017-f38c-47d4-ba8a-109331031623" 
                alt="Team collaboration"
                className="img-fluid rounded shadow-lg"
                style={{ borderRadius: '20px' }}
              />
            </div>
          </div>
        </div>
      </section>


      <section className="content-section" style={{ background: '#f7fafc' }}>
        <div className="container">
          <div className="mb-5 text-center">
            <h2 className="fw-semibold mb-3" style={{ fontSize: "1.8rem" }}>Our Mission</h2>
            <p className="text-muted" style={{ fontSize: "1.05rem" }}>
              We focus on delivering a lightweight CRM that removes clutter and keeps only what matters. 
              No noise. No unnecessary features. Just clean workflow, smooth performance, and effortless collaboration.
            </p>
          </div>
          {/* Key Points */}
          <div className="row g-4 text-center mb-5">
            <div className="col-md-4">
              <div className="p-4 border rounded-3 bg-white h-100">
                <h5 className="fw-bold mb-2">Simple UI</h5>
                <p className="text-muted">Everything you need — nothing you don't.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 border rounded-3 bg-white h-100">
                <h5 className="fw-bold mb-2">Fast & Clean</h5>
                <p className="text-muted">Optimized for speed and effortless navigation.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 border rounded-3 bg-white h-100">
                <h5 className="fw-bold mb-2">Built for Teams</h5>
                <p className="text-muted">Lightweight tools that make collaboration simple.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
{/* 
      <section className="content-section" style={{ background: '#f7fafc' }}>
        <div className="container">
          
        </div>
      </section> */}

      {/* Values Section */}
      <section className="content-section" style={{ background: '#f7fafc' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Our Core Values</h2>
            <p className="section-subtitle">
              The principles that guide everything we do and every decision we make
            </p>
          </div>
          <div className="row">
            {values.map((value, index) => (
              <div key={index} className="col-lg-3 col-md-6 mb-4">
                <div className="value-card">
                  <div className="value-icon">{value.icon}</div>
                  <h3 className="value-title">{value.title}</h3>
                  <p className="value-description">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Ready to Transform Your Business?</h2>
          <p className="cta-subtitle">
            Join thousands of companies already using our CRM to drive growth and success
          </p>
          <button className="btn btn-cta" onClick={() => navigate('/login')}>Start now</button>
        </div>
      </section>
    </div>
  );
}