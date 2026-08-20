import { Link } from "react-router";
import { MessageSquare, Bot, Users, Sparkles, ArrowRight, Zap, Check } from "lucide-react";

export function LandingPage() {
  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      color: "#2D2D4D",
      backgroundColor: "#FFFFFF",
      minHeight: "100vh",
      overflowX: "hidden"
    }}>
      {/* 1. Header Navigation */}
      <header style={{
        width: "100%",
        height: "72px",
        borderBottom: "1px solid #F0EEFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "sticky",
        top: 0,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(12px)",
        zIndex: 50
      }}>
        <div style={{
          width: "100%",
          maxWidth: "1200px",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "18px",
              height: "18px",
              borderRadius: "6px",
              backgroundColor: "#8B7CF6",
              boxShadow: "0 4px 12px rgba(139, 124, 246, 0.3)"
            }}></div>
            <span style={{
              fontSize: "1.25rem",
              fontWeight: 800,
              color: "#1C1629",
              letterSpacing: "-0.03em"
            }}>MessiQ</span>
          </div>

          {/* Nav Links */}
          <nav style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            <a href="#features" style={{
              fontSize: "0.9375rem",
              fontWeight: 500,
              color: "#6E6E8A",
              textDecoration: "none",
              transition: "color 0.2s"
            }} onMouseEnter={(e) => e.currentTarget.style.color = "#8B7CF6"}
               onMouseLeave={(e) => e.currentTarget.style.color = "#6E6E8A"}>Features</a>
            <a href="#how-it-works" style={{
              fontSize: "0.9375rem",
              fontWeight: 500,
              color: "#6E6E8A",
              textDecoration: "none",
              transition: "color 0.2s"
            }} onMouseEnter={(e) => e.currentTarget.style.color = "#8B7CF6"}
               onMouseLeave={(e) => e.currentTarget.style.color = "#6E6E8A"}>How it Works</a>
            <a href="#stats" style={{
              fontSize: "0.9375rem",
              fontWeight: 500,
              color: "#6E6E8A",
              textDecoration: "none",
              transition: "color 0.2s"
            }} onMouseEnter={(e) => e.currentTarget.style.color = "#8B7CF6"}
               onMouseLeave={(e) => e.currentTarget.style.color = "#6E6E8A"}>Why Us</a>
          </nav>

          {/* Action Button */}
          <Link to="/login" style={{
            backgroundColor: "#8B7CF6",
            color: "#FFFFFF",
            padding: "10px 20px",
            borderRadius: "12px",
            fontSize: "0.9375rem",
            fontWeight: 600,
            textDecoration: "none",
            boxShadow: "0 4px 14px rgba(139, 124, 246, 0.25)",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }} onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#7C6BEF";
            e.currentTarget.style.transform = "translateY(-1px)";
          }} onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#8B7CF6";
            e.currentTarget.style.transform = "none";
          }}>
            Launch App <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section style={{
        padding: "80px 24px 100px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        background: "linear-gradient(180deg, #FBFBFF 0%, #FFFFFF 100%)",
        position: "relative"
      }}>
        {/* Decorative background glow */}
        <div style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "500px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,124,246,0.06) 0%, rgba(255,255,255,0) 70%)",
          pointerEvents: "none",
          zIndex: 1
        }}></div>

        <div style={{ maxWidth: "850px", position: "relative", zIndex: 2 }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#F0EEFF",
            border: "1px solid #E3DFFF",
            color: "#8B7CF6",
            padding: "6px 14px",
            borderRadius: "100px",
            fontSize: "0.8125rem",
            fontWeight: 600,
            marginBottom: "24px"
          }}>
            <Sparkles size={12} /> The Social Commerce Co-Pilot
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
            fontWeight: 800,
            color: "#1C1629",
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            marginBottom: "24px"
          }}>
            Consolidate Social DMs.<br />
            <span style={{
              background: "linear-gradient(90deg, #8B7CF6 0%, #A396FF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>Automate E-commerce Sales.</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: "clamp(1rem, 2vw, 1.1875rem)",
            color: "#6E6E8A",
            lineHeight: 1.6,
            marginBottom: "40px",
            maxWidth: "680px",
            marginInline: "auto"
          }}>
            MessiQ combines Instagram, Facebook Messenger, and WhatsApp into one unified inbox.
            Solve customer questions, track order history, and deploy AI auto-replies that sell 24/7.
          </p>

          {/* CTAs */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            justifyContent: "center",
            marginBottom: "48px"
          }}>
            <Link to="/login" style={{
              backgroundColor: "#8B7CF6",
              color: "#FFFFFF",
              padding: "16px 36px",
              borderRadius: "16px",
              fontSize: "1.0625rem",
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 6px 20px rgba(139, 124, 246, 0.3)",
              transition: "all 0.2s"
            }} onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#7C6BEF";
              e.currentTarget.style.transform = "scale(1.02)";
            }} onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#8B7CF6";
              e.currentTarget.style.transform = "none";
            }}>
              Start Automating Free
            </Link>
            <a href="#how-it-works" style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E3DFFF",
              color: "#6E6E8A",
              padding: "16px 36px",
              borderRadius: "16px",
              fontSize: "1.0625rem",
              fontWeight: 600,
              textDecoration: "none",
              transition: "all 0.2s"
            }} onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#F9F9FF";
              e.currentTarget.style.borderColor = "#8B7CF6";
            }} onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#FFFFFF";
              e.currentTarget.style.borderColor = "#E3DFFF";
            }}>
              See How It Works
            </a>
          </div>
        </div>

        {/* Dashboard Preview / Mockup */}
        <div style={{
          width: "100%",
          maxWidth: "1050px",
          borderRadius: "24px",
          border: "1px solid #E4E1FC",
          background: "linear-gradient(210deg, #F9F8FF 0%, #FFFFFF 100%)",
          padding: "24px",
          boxShadow: "0 20px 80px rgba(139, 124, 246, 0.08)",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          position: "relative",
          zIndex: 5
        }}>
          {/* Header of mockup */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #F0EEFF",
            paddingBottom: "16px"
          }}>
            <div style={{ display: "flex", gap: "6px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#FF605C" }}></div>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#FFBD44" }}></div>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#00CA4E" }}></div>
            </div>
            <div style={{
              fontSize: "0.75rem",
              color: "#9A9AB3",
              backgroundColor: "#FAFAFC",
              padding: "4px 20px",
              borderRadius: "8px",
              border: "1px solid #F0EEFF"
            }}>
              app.messiq.com/dashboard/messages
            </div>
            <div style={{ width: "30px" }}></div>
          </div>

          {/* Body of mockup */}
          <div style={{
            display: "flex",
            height: "360px",
            textAlign: "left",
            fontSize: "0.875rem"
          }}>
            {/* Mockup Sidebar */}
            <div style={{
              width: "20%",
              borderRight: "1px solid #F0EEFF",
              paddingRight: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}>
              <div style={{ height: "16px", backgroundColor: "#F0EEFF", borderRadius: "4px", width: "80%" }}></div>
              <div style={{ height: "30px", backgroundColor: "#F5F3FF", borderRadius: "8px", width: "100%", borderLeft: "3px solid #8B7CF6" }}></div>
              <div style={{ height: "16px", backgroundColor: "#FAFAFC", borderRadius: "4px", width: "60%", marginTop: "12px" }}></div>
              <div style={{ height: "16px", backgroundColor: "#FAFAFC", borderRadius: "4px", width: "70%" }}></div>
              <div style={{ height: "16px", backgroundColor: "#FAFAFC", borderRadius: "4px", width: "50%" }}></div>
            </div>

            {/* Mockup Inbox List */}
            <div style={{
              width: "30%",
              borderRight: "1px solid #F0EEFF",
              paddingInline: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "16px"
            }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#E3DFFF" }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ height: "12px", backgroundColor: "#2D2D4D", borderRadius: "4px", width: "70%", marginBottom: "6px" }}></div>
                  <div style={{ height: "10px", backgroundColor: "#9A9AB3", borderRadius: "4px", width: "90%" }}></div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center", opacity: 0.6 }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#F0EEFF" }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ height: "12px", backgroundColor: "#6E6E8A", borderRadius: "4px", width: "50%", marginBottom: "6px" }}></div>
                  <div style={{ height: "10px", backgroundColor: "#9A9AB3", borderRadius: "4px", width: "80%" }}></div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center", opacity: 0.4 }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#F0EEFF" }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ height: "12px", backgroundColor: "#6E6E8A", borderRadius: "4px", width: "60%", marginBottom: "6px" }}></div>
                  <div style={{ height: "10px", backgroundColor: "#9A9AB3", borderRadius: "4px", width: "70%" }}></div>
                </div>
              </div>
            </div>

            {/* Mockup Chat Space */}
            <div style={{
              width: "50%",
              paddingLeft: "16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #F0EEFF", paddingBottom: "12px" }}>
                <div style={{ fontWeight: 600, color: "#1C1629" }}>Sarah Jenkins (Instagram DM)</div>
                <div style={{ fontSize: "0.75rem", color: "#00CA4E", display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#00CA4E" }}></span> AI active
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, paddingBlock: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{ backgroundColor: "#F0EEFF", color: "#2D2D4D", padding: "10px 14px", borderRadius: "14px", maxWidth: "80%", fontSize: "0.8125rem" }}>
                    Hi! Is the blue dress still in stock in size Medium? Also, what is the shipping time to California?
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div style={{ backgroundColor: "#8B7CF6", color: "#FFFFFF", padding: "10px 14px", borderRadius: "14px", maxWidth: "80%", fontSize: "0.8125rem", boxShadow: "0 2px 8px rgba(139, 124, 246, 0.15)" }}>
                    Hello Sarah! Yes, the Blue Linen Dress is in stock in Medium. We have 4 left! Shipping to California usually takes 2-3 business days.
                  </div>
                </div>
              </div>

              {/* Input */}
              <div style={{ height: "40px", border: "1px solid #F0EEFF", borderRadius: "10px", paddingInline: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", color: "#9A9AB3" }}>
                <span>Ask AI to draft reply...</span>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#8B7CF6", display: "flex", alignItems: "center", justifySelf: "center", color: "#FFFFFF", justifyContent: "center", cursor: "pointer" }}>
                  <ArrowRight size={12} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" style={{
        padding: "100px 24px",
        backgroundColor: "#FAFAFD",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <div style={{ width: "100%", maxWidth: "1200px", textAlign: "center" }}>
          <div style={{
            fontSize: "0.875rem",
            fontWeight: 700,
            color: "#8B7CF6",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "12px"
          }}>Powerful Features</div>
          <h2 style={{
            fontSize: "2.25rem",
            fontWeight: 800,
            color: "#1C1629",
            letterSpacing: "-0.02em",
            marginBottom: "56px"
          }}>Designed for Social E-Commerce Brands</h2>

          {/* Cards Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "32px",
            textAlign: "left"
          }}>
            {/* Feature 1 */}
            <div style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #F0EEFF",
              borderRadius: "20px",
              padding: "36px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.01)",
              transition: "transform 0.2s, box-shadow 0.2s"
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(139,124,246,0.06)";
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.01)";
            }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "#F0EEFF",
                color: "#8B7CF6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "24px"
              }}>
                <MessageSquare size={24} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1C1629", marginBottom: "12px" }}>Unified Social Inbox</h3>
              <p style={{ color: "#6E6E8A", lineHeight: 1.6, margin: 0, fontSize: "0.9375rem" }}>
                Bring comments and DMs from Instagram Pages and Facebook Messenger into one single collaborative workspace. Never lose a lead in another tab again.
              </p>
            </div>

            {/* Feature 2 */}
            <div style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #F0EEFF",
              borderRadius: "20px",
              padding: "36px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.01)",
              transition: "transform 0.2s, box-shadow 0.2s"
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(139,124,246,0.06)";
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.01)";
            }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "#F0EEFF",
                color: "#8B7CF6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "24px"
              }}>
                <Bot size={24} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1C1629", marginBottom: "12px" }}>AI-Powered Auto-Pilot</h3>
              <p style={{ color: "#6E6E8A", lineHeight: 1.6, margin: 0, fontSize: "0.9375rem" }}>
                Deploy smart automated agent flows that pull inventory levels, verify product catalogs, and send shipping details instantly, saving manual rep support time.
              </p>
            </div>

            {/* Feature 3 */}
            <div style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #F0EEFF",
              borderRadius: "20px",
              padding: "36px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.01)",
              transition: "transform 0.2s, box-shadow 0.2s"
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(139,124,246,0.06)";
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.01)";
            }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "#F0EEFF",
                color: "#8B7CF6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "24px"
              }}>
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1C1629", marginBottom: "12px" }}>Seamless Team Handover</h3>
              <p style={{ color: "#6E6E8A", lineHeight: 1.6, margin: 0, fontSize: "0.9375rem" }}>
                Enable "Human Takeover" mode instantly when a customer requires personalized support. Chats transition smoothly to your live agents with complete session history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section id="how-it-works" style={{
        padding: "100px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <div style={{ width: "100%", maxWidth: "1200px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "40px", alignItems: "center" }}>
            <div style={{ flex: "1 1 450px" }}>
              <div style={{
                fontSize: "0.875rem",
                fontWeight: 700,
                color: "#8B7CF6",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "12px"
              }}>Simple Workflow</div>
              <h2 style={{
                fontSize: "2.25rem",
                fontWeight: 800,
                color: "#1C1629",
                letterSpacing: "-0.02em",
                marginBottom: "24px",
                lineHeight: 1.2
              }}>Get Running In Minutes</h2>
              <p style={{ color: "#6E6E8A", fontSize: "1rem", lineHeight: 1.6, marginBottom: "40px" }}>
                MessiQ is designed to integrate into your e-commerce workflow with zero configuration or coding required.
              </p>

              {/* Step 1 */}
              <div style={{ display: "flex", gap: "20px", marginBottom: "28px" }}>
                <div style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "#F0EEFF",
                  color: "#8B7CF6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  flexShrink: 0
                }}>1</div>
                <div>
                  <h4 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "#1C1629", margin: "0 0 6px" }}>Connect Social Channels</h4>
                  <p style={{ color: "#6E6E8A", margin: 0, fontSize: "0.9375rem" }}>Login via Facebook to securely grant page authorizations with a single click.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div style={{ display: "flex", gap: "20px", marginBottom: "28px" }}>
                <div style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "#F0EEFF",
                  color: "#8B7CF6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  flexShrink: 0
                }}>2</div>
                <div>
                  <h4 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "#1C1629", margin: "0 0 6px" }}>Set Your Welcome Prompt & Voice</h4>
                  <p style={{ color: "#6E6E8A", margin: 0, fontSize: "0.9375rem" }}>Define a friendly default message and style your brand's voice in your settings panel.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div style={{ display: "flex", gap: "20px" }}>
                <div style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "#F0EEFF",
                  color: "#8B7CF6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  flexShrink: 0
                }}>3</div>
                <div>
                  <h4 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "#1C1629", margin: "0 0 6px" }}>Automate & Close Sales</h4>
                  <p style={{ color: "#6E6E8A", margin: 0, fontSize: "0.9375rem" }}>Watch conversations get tracked, automatically replied to, and converted to customers in real-time.</p>
                </div>
              </div>
            </div>

            {/* Right graphic box */}
            <div style={{
              flex: "1 1 450px",
              display: "flex",
              justifyContent: "center"
            }}>
              <div style={{
                width: "100%",
                maxWidth: "480px",
                height: "360px",
                background: "linear-gradient(135deg, #8B7CF6 0%, #7C6BEF 100%)",
                borderRadius: "24px",
                boxShadow: "0 20px 40px rgba(139, 124, 246, 0.15)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: "#FFFFFF",
                padding: "40px",
                textAlign: "center",
                position: "relative",
                overflow: "hidden"
              }}>
                <div style={{
                  position: "absolute",
                  width: "200px",
                  height: "200px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.1)",
                  top: "-50px",
                  right: "-50px"
                }}></div>
                <Zap size={48} style={{ marginBottom: "20px", color: "#FFD23F" }} />
                <h3 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0 0 12px" }}>Instant Social Response</h3>
                <p style={{ opacity: 0.9, lineHeight: 1.6, margin: 0, fontSize: "0.9375rem" }}>
                  Brands using MessiQ reduce average first-response times from 12 hours to less than 1.5 seconds, driving cart completion by 28%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Statistics Section */}
      <section id="stats" style={{
        padding: "80px 24px",
        backgroundColor: "#1C1629",
        color: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <div style={{
          width: "100%",
          maxWidth: "1200px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "40px",
          textAlign: "center"
        }}>
          <div style={{ flex: "1 1 200px" }}>
            <div style={{ fontSize: "3rem", fontWeight: 800, color: "#8B7CF6", marginBottom: "8px" }}>24/7</div>
            <div style={{ fontSize: "0.9375rem", color: "#9A9AB3" }}>Lead Capture & Automation</div>
          </div>
          <div style={{ flex: "1 1 200px" }}>
            <div style={{ fontSize: "3rem", fontWeight: 800, color: "#8B7CF6", marginBottom: "8px" }}>&lt; 2s</div>
            <div style={{ fontSize: "0.9375rem", color: "#9A9AB3" }}>Average Response Time</div>
          </div>
          <div style={{ flex: "1 1 200px" }}>
            <div style={{ fontSize: "3rem", fontWeight: 800, color: "#8B7CF6", marginBottom: "8px" }}>+28%</div>
            <div style={{ fontSize: "0.9375rem", color: "#9A9AB3" }}>E-commerce Sales Conversion</div>
          </div>
          <div style={{ flex: "1 1 200px" }}>
            <div style={{ fontSize: "3rem", fontWeight: 800, color: "#8B7CF6", marginBottom: "8px" }}>100%</div>
            <div style={{ fontSize: "0.9375rem", color: "#9A9AB3" }}>Official Meta API Integrations</div>
          </div>
        </div>
      </section>

      {/* 6. Call to Action (CTA) Section */}
      <section style={{
        padding: "100px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <div style={{
          width: "100%",
          maxWidth: "1150px",
          background: "linear-gradient(135deg, #FAF9FF 0%, #F5F3FF 100%)",
          border: "1px solid #E3DFFF",
          borderRadius: "32px",
          padding: "60px 40px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <h2 style={{
            fontSize: "2.25rem",
            fontWeight: 800,
            color: "#1C1629",
            letterSpacing: "-0.02em",
            marginBottom: "16px",
            lineHeight: 1.2
          }}>Ready to Automate Your Social DMs?</h2>
          <p style={{
            color: "#6E6E8A",
            fontSize: "1.0625rem",
            lineHeight: 1.6,
            maxWidth: "600px",
            marginBottom: "36px"
          }}>
            Create your account today, link your Instagram business profile, and start engaging customers instantly.
          </p>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
            <Link to="/login" style={{
              backgroundColor: "#8B7CF6",
              color: "#FFFFFF",
              padding: "16px 36px",
              borderRadius: "16px",
              fontSize: "1.0625rem",
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 6px 20px rgba(139, 124, 246, 0.3)",
              transition: "all 0.2s"
            }} onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#7C6BEF";
              e.currentTarget.style.transform = "translateY(-1px)";
            }} onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#8B7CF6";
              e.currentTarget.style.transform = "none";
            }}>
              Launch MessiQ App
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer style={{
        width: "100%",
        borderTop: "1px solid #F0EEFF",
        padding: "48px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#FAFAFD"
      }}>
        <div style={{
          width: "100%",
          maxWidth: "1200px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "24px"
        }}>
          {/* Logo & Copyright */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "4px", backgroundColor: "#8B7CF6" }}></div>
              <span style={{ fontWeight: 700, color: "#1C1629" }}>MessiQ</span>
            </div>
            <p style={{ margin: 0, fontSize: "0.8125rem", color: "#9A9AB3" }}>&copy; 2026 MessiQ. All rights reserved.</p>
          </div>

          {/* Policy Links */}
          <div style={{ display: "flex", gap: "24px" }}>
            <Link to="/privacy.html" style={{ fontSize: "0.875rem", color: "#6E6E8A", textDecoration: "none" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#8B7CF6"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#6E6E8A"}>Privacy Policy</Link>
            <Link to="/terms.html" style={{ fontSize: "0.875rem", color: "#6E6E8A", textDecoration: "none" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#8B7CF6"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#6E6E8A"}>Terms of Service</Link>
            <Link to="/data-deletion.html" style={{ fontSize: "0.875rem", color: "#6E6E8A", textDecoration: "none" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#8B7CF6"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#6E6E8A"}>Data Deletion</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
