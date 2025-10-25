import React from 'react';

/**
 * HomeContent Component
 * 
 * Contains the main content for the home page including information
 * about Hacktoberfest, getting started guide, and community info.
 */
const HomeContent = () => {
  return (
    <div style={{ 
      maxWidth: "900px", 
      margin: "4rem auto", 
      padding: "0 2rem",
      textAlign: "left" 
    }}>
      {/* About Section */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ 
          fontSize: "2rem", 
          marginBottom: "1rem", 
          color: "#6e6ef2" 
        }}>
          🎯 About Hacktoberfest
        </h2>
        <p style={{ 
          lineHeight: "1.8", 
          color: "#4a5568", 
          marginBottom: "1rem" 
        }}>
          Hacktoberfest is DigitalOcean's annual event that encourages people to contribute 
          to open source throughout October. Whether you're a seasoned contributor or looking 
          for projects to contribute to for the first time, you're welcome to participate!
        </p>
        <p style={{ lineHeight: "1.8", color: "#4a5568" }}>
          Much of modern tech infrastructure—including some of DigitalOcean's own products—relies 
          on open-source projects built and maintained by passionate people who often don't have 
          the staff or budgets to do much more than keep the project alive.
        </p>
      </section>

      {/* Getting Started Section */}
      <section style={{ 
        marginBottom: "3rem",
        background: "#f7fafc",
        padding: "2rem",
        borderRadius: "12px",
        border: "2px solid #e2e8f0"
      }}>
        <h2 style={{ 
          fontSize: "2rem", 
          marginBottom: "1rem", 
          color: "#6e6ef2" 
        }}>
          🚀 Getting Started
        </h2>
        <ol style={{ 
          lineHeight: "2", 
          color: "#4a5568",
          paddingLeft: "1.5rem"
        }}>
          <li><strong>Register:</strong> Sign up for Hacktoberfest on the official website</li>
          <li><strong>Find Projects:</strong> Look for issues labeled "hacktoberfest" or "good-first-issue"</li>
          <li><strong>Contribute:</strong> Submit quality pull requests to participate</li>
          <li><strong>Complete:</strong> Have your PRs accepted to earn rewards</li>
        </ol>
      </section>

      {/* Contribution Guidelines */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ 
          fontSize: "2rem", 
          marginBottom: "1rem", 
          color: "#6e6ef2" 
        }}>
          📝 Contribution Guidelines
        </h2>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
          gap: "1.5rem" 
        }}>
          <div style={{ 
            background: "#fff", 
            padding: "1.5rem", 
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ color: "#6e6ef2", marginBottom: "0.5rem" }}>✅ Quality First</h3>
            <p style={{ color: "#718096", fontSize: "0.9rem" }}>
              Focus on meaningful contributions that add value to the project
            </p>
          </div>
          <div style={{ 
            background: "#fff", 
            padding: "1.5rem", 
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ color: "#6e6ef2", marginBottom: "0.5rem" }}>🤝 Be Respectful</h3>
            <p style={{ color: "#718096", fontSize: "0.9rem" }}>
              Follow the project's code of conduct and be kind to maintainers
            </p>
          </div>
          <div style={{ 
            background: "#fff", 
            padding: "1.5rem", 
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ color: "#6e6ef2", marginBottom: "0.5rem" }}>📖 Read Guidelines</h3>
            <p style={{ color: "#718096", fontSize: "0.9rem" }}>
              Always read CONTRIBUTING.md before submitting a PR
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ 
          fontSize: "2rem", 
          marginBottom: "1rem", 
          color: "#6e6ef2" 
        }}>
          💻 Technologies We Use
        </h2>
        <div style={{ 
          display: "flex", 
          flexWrap: "wrap", 
          gap: "1rem",
          marginTop: "1rem"
        }}>
          {["React", "JavaScript", "Python", "Java", "HTML/CSS", "Git", "Node.js", "Vite"].map(tech => (
            <span key={tech} style={{
              background: "#6e6ef2",
              color: "white",
              padding: "0.5rem 1.5rem",
              borderRadius: "20px",
              fontSize: "0.9rem",
              fontWeight: "500"
            }}>
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Community Section */}
      <section style={{ 
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "3rem 2rem",
        borderRadius: "12px",
        color: "white",
        textAlign: "center",
        marginBottom: "3rem"
      }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          🌟 Join Our Community
        </h2>
        <p style={{ lineHeight: "1.8", marginBottom: "1.5rem", opacity: "0.95" }}>
          Connect with fellow contributors, share your progress, and learn from the community. 
          We're here to support each other on this open-source journey!
        </p>
        <div style={{ 
          display: "flex", 
          gap: "1rem", 
          justifyContent: "center",
          flexWrap: "wrap"
        }}>
          <button style={{
            background: "white",
            color: "#6e6ef2",
            border: "none",
            padding: "0.75rem 2rem",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer"
          }}>
            Get Started
          </button>
          <button style={{
            background: "transparent",
            color: "white",
            border: "2px solid white",
            padding: "0.75rem 2rem",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer"
          }}>
            View Issues
          </button>
        </div>
      </section>

      {/* Scroll Test Notice */}
      <div style={{
        background: "#fff3cd",
        border: "2px solid #ffc107",
        borderRadius: "8px",
        padding: "1.5rem",
        textAlign: "center",
        marginTop: "3rem"
      }}>
        <p style={{ 
          color: "#856404", 
          fontWeight: "500",
          margin: 0
        }}>
          ⬇️ Scroll down to see the "Scroll to Top" button appear in the bottom-right corner! ⬇️
        </p>
      </div>
    </div>
  );
};

export default HomeContent;