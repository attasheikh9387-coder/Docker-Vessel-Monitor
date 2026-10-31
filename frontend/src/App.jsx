import { useEffect, useState } from "react"

import {
  Bell,
  Search,
  Ship,
  MapPin,
  Gauge,
  Fuel,
  Thermometer,
  ArrowUpRight,
  Menu,
} from "lucide-react"

import "./App.css"
function App() {
  const [activeSection, setActiveSection] = useState("Dashboard")
  const [ships, setShips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchShips = async () => {
      try {
        const response = await fetch("http://192.168.1.107:8000/ships")

        if (!response.ok) {
          throw new Error("Failed to fetch ship data")
        }

        const data = await response.json()
        setShips(data)
        setError("")
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchShips()

    const interval = setInterval(fetchShips, 5000)

    return () => clearInterval(interval)
  }, [])

  const ship = ships[0]
  if (loading) {
    return <div className="app">Loading ShipTrack data...</div>
  }

  if (error) {
    return <div className="app">API Error: {error}</div>
  }

  if (!ship) {
    return <div className="app">No ships found.</div>
  }
  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="logo">
          <div className="logo-icon">
            <Ship size={22} />
          </div>

          <div>
            <strong>ShipTrack</strong>
            <span>Fleet Intelligence</span>
          </div>
        </div>

        <nav>
                    {["Dashboard", "Fleet", "Live Map", "Telemetry", "Alerts", "Analytics"].map((section) => (
            <a
              key={section}
              className={activeSection === section ? "nav-active" : ""}
              onClick={() => setActiveSection(section)}
            >
              {section}
            </a>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <span className="online-dot"></span>
          <div>
            <strong>System Online</strong>
            <small>All services operational</small>
          </div>
        </div>

      </aside>


      {/* CONTENT */}
      <main className="content">

        {/* HEADER */}
        <header className="header">

          <button className="mobile-menu">
            <Menu size={22} />
          </button>

          <div className="search">
            <Search size={18} />
            <input placeholder="Search vessels, IMO number..." />
          </div>

          <div className="header-right">

            <button className="notification">
              <Bell size={20} />
              <span>3</span>
            </button>

            <div className="user">
              <div className="avatar">FO</div>

              <div>
                <strong>Fleet Operator</strong>
                <small>Operations</small>
              </div>
            </div>

          </div>

        </header>


        {activeSection === "Dashboard" ? (
          <>
        {/* HERO */}
        <section className="hero">

          <div className="hero-image">
            <div className="hero-overlay"></div>

            <div className="hero-content">

              <span className="hero-label">
                LIVE FLEET MONITORING
              </span>

              <h1>
                Welcome to<br />
                ShipTrack
              </h1>

              <p>
                Monitor your vessels, telemetry and fleet
                operations in real time.
              </p>

              <button className="hero-button">
                View Fleet
                <ArrowUpRight size={17} />
              </button>

            </div>

          </div>


          <div className="hero-side">

            <div className="side-title">
              <span>ACTIVE VESSEL</span>
              <b>LIVE</b>
            </div>

            <div className="vessel-name">
              <Ship size={22} />
              <div>
                <h2>{ship.name}</h2>
                <span>{ship.imo_number}</span>
              </div>
            </div>

            <div className="location">
              <MapPin size={18} />
              <div>
                <small>Current Location</small>
                <strong>{ship.latitude.toFixed(4)}° N, {ship.longitude.toFixed(4)}° E</strong>
              </div>
            </div>

            <div className="vessel-stats">

              <div>
                <Gauge size={18} />
                <small>Speed</small>
                <strong>{Number(ship.speed).toFixed(1)} <em>kn</em></strong>
              </div>

              <div>
                <Thermometer size={18} />
                <small>Engine</small>
                <strong>{Number(ship.engine_temperature).toFixed(1)} <em>°C</em></strong>
              </div>

              <div>
                <Fuel size={18} />
                <small>Fuel</small>
                <strong>{Number(ship.fuel_level).toFixed(1)} <em>%</em></strong>
              </div>

            </div>

          </div>

        </section>


        {/* OVERVIEW */}
        <section className="section">

          <div className="section-heading">
            <div>
              <span>FLEET OVERVIEW</span>
              <h2>Today's Operations</h2>
            </div>

            <button className="view-all">
              View all
              <ArrowUpRight size={16} />
            </button>
          </div>


          <div className="stats">

            <div className="stat">
              <div className="stat-icon blue">
                <Ship size={21} />
              </div>

              <div>
                <span>Total Vessels</span>
                <strong>01</strong>
                <small>Registered fleet</small>
              </div>
            </div>


            <div className="stat">
              <div className="stat-icon green">
                <Gauge size={21} />
              </div>

              <div>
                <span>Active Vessels</span>
                <strong>01</strong>
                <small>Currently underway</small>
              </div>
            </div>


            <div className="stat">
              <div className="stat-icon orange">
                <Bell size={21} />
              </div>

              <div>
                <span>Alerts</span>
                <strong>00</strong>
                <small>All systems normal</small>
              </div>
            </div>


            <div className="stat">
              <div className="stat-icon purple">
                <Fuel size={21} />
              </div>

              <div>
                <span>Fleet Fuel</span>
                <strong>{Number(ship.fuel_level).toFixed(1)}%</strong>
                <small>Current average</small>
              </div>
            </div>

          </div>

        </section>


        {/* LOWER CONTENT */}
        <section className="lower">

          {/* MAP */}
          <div className="card map-card">

            <div className="card-heading">

              <div>
                <span>LIVE TRACKING</span>
                <h2>Vessel Location</h2>
              </div>

              <button className="live">
                <i></i>
                Live
              </button>

            </div>

            <div className="map">

              <div className="map-water"></div>

              <div className="map-grid"></div>

              <div className="route-line"></div>

              <div className="map-ship">
                <div className="pulse"></div>
                <Ship size={19} />
              </div>

              <div className="map-label">
                Atlantic Star
                <small>{Number(ship.speed).toFixed(1)} kn</small>
              </div>

              <div className="map-location">
                Istanbul
              </div>

            </div>

          </div>


          {/* TELEMETRY */}
          <div className="card telemetry">

            <div className="card-heading">

              <div>
                <span>REAL-TIME DATA</span>
                <h2>Telemetry</h2>
              </div>

              <span className="updated">
                Updated now
              </span>

            </div>


            <div className="metric">

              <div className="metric-top">
                <span>Speed</span>
                <Gauge size={18} />
              </div>

              <strong>
                {Number(ship.speed).toFixed(1)} <em>kn</em>
              </strong>

              <div className="progress">
                <span style={{ width: "68%" }}></span>
              </div>

            </div>


            <div className="metric">

              <div className="metric-top">
                <span>Engine Temperature</span>
                <Thermometer size={18} />
              </div>

              <strong>
                {Number(ship.engine_temperature).toFixed(1)} <em>°C</em>
              </strong>

              <div className="progress">
                <span style={{ width: "57%" }}></span>
              </div>

            </div>


            <div className="metric">

              <div className="metric-top">
                <span>Fuel Level</span>
                <Fuel size={18} />
              </div>

              <strong>
                {Number(ship.fuel_level).toFixed(1)} <em>%</em>
              </strong>

              <div className="progress">
                <span style={{ width: "76%" }}></span>
              </div>

            </div>

          </div>

        </section>


        </>
        ) : (
          <section className="section">
            <div className="section-heading">
              <div>
                <span>SHIPTRACK OPERATIONS</span>
                <h2>{activeSection}</h2>
              </div>
            </div>

            {activeSection === "Fleet" && (
              <div className="fleet-card">
                <div className="fleet-header">
                  <div>
                    <h3>{ship.name}</h3>
                    <p>IMO: {ship.imo_number}</p>
                  </div>
                  <span className="fleet-status">{ship.engine_status}</span>
                </div>

                <div className="fleet-metrics">
                  <div className="fleet-metric">
                    <span>Vessel Speed</span>
                    <strong>{Number(ship.speed).toFixed(1)}<small> knots</small></strong>
                  </div>

                  <div className="fleet-metric">
                    <span>Fuel Level</span>
                    <strong>{Number(ship.fuel_level).toFixed(1)}<small>%</small></strong>
                  </div>
                </div>
              </div>
              )}

            {activeSection === "Live Map" && (
              <div className="card">
                <h3>Vessel Position</h3>
                <p>{ship.name}</p>
                <p>Latitude: {Number(ship.latitude).toFixed(4)}</p>
                <p>Longitude: {Number(ship.longitude).toFixed(4)}</p>
              </div>
            )}

            {activeSection === "Telemetry" && (
              <div className="stats">
                <div className="stat">
                  <div className="metric-top">
                    <span>Vessel Speed</span>
                    <Gauge size={20} />
                  </div>
                  <strong>{Number(ship.speed).toFixed(1)} <em>knots</em></strong>
                  <div className="progress">
                    <span style={{ width: `${Math.min(Number(ship.speed) / 30 * 100, 100)}%` }}></span>
                  </div>
                  <small>Live engine speed</small>
                </div>

                <div className="stat">
                  <div className="metric-top">
                    <span>Engine Temperature</span>
                    <Thermometer size={20} />
                  </div>
                  <strong>{Number(ship.engine_temperature).toFixed(1)} <em>°C</em></strong>
                  <div className="progress">
                    <span style={{ width: `${Math.min(Number(ship.engine_temperature) / 120 * 100, 100)}%` }}></span>
                  </div>
                  <small>Live engine temperature</small>
                </div>

                <div className="stat">
                  <div className="metric-top">
                    <span>Fuel Level</span>
                    <Fuel size={20} />
                  </div>
                  <strong>{Number(ship.fuel_level).toFixed(1)} <em>%</em></strong>
                  <div className="progress">
                    <span style={{ width: `${Math.max(0, Math.min(Number(ship.fuel_level), 100))}%` }}></span>
                  </div>
                  <small>Remaining fuel</small>
                </div>

                <div className="stat">
                  <div className="metric-top">
                    <span>Engine Status</span>
                    <Ship size={20} />
                  </div>
                  <strong>{ship.engine_status}</strong>
                  <small>Current vessel status</small>
                </div>
              </div>
            )}
            {activeSection === "Alerts" && (
              <div className="card">
                <h3>System Alerts</h3>
                {Number(ship.engine_temperature) >= 90 ? (
                  <p>Warning: High engine temperature</p>
                ) : (
                  <p>No active temperature alerts.</p>
                )}
              </div>
            )}

            {activeSection === "Analytics" && (
              <div className="card">
                <h3>Fleet Analytics</h3>
                <p>Speed: {Number(ship.speed).toFixed(1)} knots</p>
                <p>Temperature: {Number(ship.engine_temperature).toFixed(1)} °C</p>
                <p>Fuel: {Number(ship.fuel_level).toFixed(1)}%</p>
              </div>
            )}
          </section>
        )}
        <footer>
          ShipTrack Fleet Intelligence
          <span>API · PostgreSQL · Redis Connected</span>
        </footer>

      </main>

    </div>
  )
}

export default App
