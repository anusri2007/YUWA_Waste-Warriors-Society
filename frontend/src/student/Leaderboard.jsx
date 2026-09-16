import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Trophy,
  Award,
  Users,
  Building2,
  Search,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Medal,
  Flame,
  ShieldCheck,
  CheckCircle,
  X
} from "lucide-react";
import { useStudent } from "./StudentContext";
import "./Leaderboard.css";

const Leaderboard = () => {
  const { leaderboards, student, team } = useStudent();
  const [activeTab, setActiveTab] = useState("individual"); // individual | teams | colleges
  const [searchQuery, setSearchQuery] = useState("");

  const individualList = leaderboards?.myRank || [];
  const teamsList = leaderboards?.myTeam || [];
  const collegesList = leaderboards?.college || [];

  // Filter lists based on search
  const filteredIndividuals = individualList.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.team && item.team.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredTeams = teamsList.filter(
    (item) =>
      item.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.college.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredColleges = collegesList.filter(
    (item) =>
      item.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Top 3 Podium
  const getPodiumData = () => {
    if (activeTab === "individual") {
      return individualList.slice(0, 3).map((item, idx) => ({
        rank: idx + 1,
        title: item.name,
        subtitle: item.college,
        points: item.points,
        badge: item.badge,
        avatar: item.avatar || (idx === 0 ? "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200" : idx === 1 ? "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200" : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200")
      }));
    }
    if (activeTab === "teams") {
      return teamsList.slice(0, 3).map((item, idx) => ({
        rank: idx + 1,
        title: item.team,
        subtitle: item.college,
        points: item.points,
        badge: item.badge,
        avatar: null
      }));
    }
    return collegesList.slice(0, 3).map((item, idx) => ({
      rank: idx + 1,
      title: item.college,
      subtitle: `${item.state} • ${item.teamsCount} Teams`,
      points: item.points,
      badge: item.badge,
      avatar: null
    }));
  };

  const podium = getPodiumData();

  return (
    <div className="leaderboard-page-container">
      {/* Header Banner */}
      <section className="lead-hero-banner glass-card">
        <div className="lead-hero-content">
          <div className="lead-live-badge">
            <Flame size={15} className="text-amber-400" />
            <span>NATIONAL STANDINGS • YUWA ECOLYMPICS 2026</span>
          </div>
          <h1 className="lead-hero-title">Championship Leaderboard</h1>
          <p className="lead-hero-subtitle">
            Track individual climate warriors, squad powerhouses, and top environmental institutions leading the waste diversion revolution across India.
          </p>
        </div>

        {/* User Quick Rank Standings */}
        <div className="lead-user-standing-pill">
          <div className="user-stand-left">
            <span className="stand-tag">Your Standing</span>
            <div className="stand-val-row">
              <span className="stand-rank">Rank #{student.rank}</span>
              <span className="stand-pts text-amber-400">{student.points.toLocaleString()} pts</span>
            </div>
            <span className="stand-sub">{team.name} • {team.college.split(" ")[0]}</span>
          </div>
          <Link to="/student/submit" className="eco-btn-primary stand-cta">
            <Sparkles size={14} />
            <span>Earn More Points</span>
          </Link>
        </div>
      </section>

      {/* Tabs Bar & Search */}
      <div className="lead-control-bar glass-card">
        <div className="lead-tabs-group">
          <button
            type="button"
            className={`lead-tab-btn ${activeTab === "individual" ? "active" : ""}`}
            onClick={() => { setActiveTab("individual"); setSearchQuery(""); }}
          >
            <Trophy size={16} />
            <span>Individual Warriors</span>
          </button>

          <button
            type="button"
            className={`lead-tab-btn ${activeTab === "teams" ? "active" : ""}`}
            onClick={() => { setActiveTab("teams"); setSearchQuery(""); }}
          >
            <Users size={16} />
            <span>Squad Standings</span>
          </button>

          <button
            type="button"
            className={`lead-tab-btn ${activeTab === "colleges" ? "active" : ""}`}
            onClick={() => { setActiveTab("colleges"); setSearchQuery(""); }}
          >
            <Building2 size={16} />
            <span>College Champions</span>
          </button>
        </div>

        <div className="lead-search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder={
              activeTab === "individual"
                ? "Search warriors by name, team, college..."
                : activeTab === "teams"
                ? "Search squads by team name, college..."
                : "Search colleges or states..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="btn-clear"
              onClick={() => setSearchQuery("")}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Top 3 Podium Highlights */}
      {!searchQuery && podium.length >= 3 && (
        <section className="podium-showcase-section">
          {/* Silver Rank 2 */}
          <div className="podium-card podium-silver glass-card">
            <div className="podium-crown">🥈 2nd Place</div>
            {podium[1].avatar ? (
              <img src={podium[1].avatar} alt={podium[1].title} className="podium-avatar" />
            ) : (
              <div className="podium-avatar-fallback silver-bg">2</div>
            )}
            <h3 className="podium-title">{podium[1].title}</h3>
            <p className="podium-sub">{podium[1].subtitle}</p>
            <div className="podium-points-badge silver-badge">
              {podium[1].points.toLocaleString()} pts
            </div>
            {podium[1].badge && <span className="podium-tag">{podium[1].badge}</span>}
          </div>

          {/* Gold Rank 1 */}
          <div className="podium-card podium-gold glass-card">
            <div className="gold-halo" />
            <div className="podium-crown gold-crown">🥇 National Champion</div>
            {podium[0].avatar ? (
              <img src={podium[0].avatar} alt={podium[0].title} className="podium-avatar gold-border" />
            ) : (
              <div className="podium-avatar-fallback gold-bg">1</div>
            )}
            <h3 className="podium-title gold-text">{podium[0].title}</h3>
            <p className="podium-sub">{podium[0].subtitle}</p>
            <div className="podium-points-badge gold-badge">
              {podium[0].points.toLocaleString()} pts
            </div>
            {podium[0].badge && <span className="podium-tag gold-tag">{podium[0].badge}</span>}
          </div>

          {/* Bronze Rank 3 */}
          <div className="podium-card podium-bronze glass-card">
            <div className="podium-crown">🥉 3rd Place</div>
            {podium[2].avatar ? (
              <img src={podium[2].avatar} alt={podium[2].title} className="podium-avatar" />
            ) : (
              <div className="podium-avatar-fallback bronze-bg">3</div>
            )}
            <h3 className="podium-title">{podium[2].title}</h3>
            <p className="podium-sub">{podium[2].subtitle}</p>
            <div className="podium-points-badge bronze-badge">
              {podium[2].points.toLocaleString()} pts
            </div>
            {podium[2].badge && <span className="podium-tag">{podium[2].badge}</span>}
          </div>
        </section>
      )}

      {/* Main Rankings List Table */}
      <section className="lead-table-card glass-card">
        <div className="lead-table-header">
          <span className="col-rank">RANK</span>
          <span className="col-info">
            {activeTab === "individual"
              ? "WARRIOR & COLLEGE"
              : activeTab === "teams"
              ? "SQUAD & COLLEGE"
              : "INSTITUTION & STATE"}
          </span>
          <span className="col-badge">TIER / BADGE</span>
          <span className="col-points text-right">TOTAL POINTS</span>
        </div>

        <div className="lead-table-body">
          {/* 1. Individual Warriors Tab */}
          {activeTab === "individual" && (
            <>
              {filteredIndividuals.map((item) => (
                <div
                  key={item.rank}
                  className={`lead-row-item ${item.isCurrentUser ? "user-row-highlight" : ""}`}
                >
                  <div className="col-rank">
                    <span className={`rank-pill-badge ${item.rank <= 3 ? `rank-${item.rank}` : ""}`}>
                      {item.rank === 1 ? "🥇 1" : item.rank === 2 ? "🥈 2" : item.rank === 3 ? "🥉 3" : `#${item.rank}`}
                    </span>
                  </div>

                  <div className="col-info">
                    <div className="lead-name-group">
                      <strong className="lead-item-name">
                        {item.name} {item.isCurrentUser && <span className="you-chip">You</span>}
                      </strong>
                      <span className="lead-item-sub">
                        {item.team ? `${item.team} • ` : ""}{item.college}
                      </span>
                    </div>
                  </div>

                  <div className="col-badge">
                    {item.badge ? (
                      <span className="lead-badge-pill">{item.badge}</span>
                    ) : (
                      <span className="text-muted text-xs">—</span>
                    )}
                  </div>

                  <div className="col-points text-right">
                    <strong className="lead-pts-val text-amber-400">
                      {item.points.toLocaleString()}
                    </strong>
                    <span className="lead-pts-lbl">pts</span>
                  </div>
                </div>
              ))}

              {filteredIndividuals.length === 0 && (
                <div className="lead-empty-state">
                  <Sparkles size={32} className="text-emerald-400" />
                  <h4>No warriors found</h4>
                  <p>Try searching with another keyword.</p>
                </div>
              )}
            </>
          )}

          {/* 2. Squad Standings Tab */}
          {activeTab === "teams" && (
            <>
              {filteredTeams.map((item) => (
                <div
                  key={item.rank}
                  className={`lead-row-item ${item.isCurrentTeam ? "user-row-highlight" : ""}`}
                >
                  <div className="col-rank">
                    <span className={`rank-pill-badge ${item.rank <= 3 ? `rank-${item.rank}` : ""}`}>
                      {item.rank === 1 ? "🥇 1" : item.rank === 2 ? "🥈 2" : item.rank === 3 ? "🥉 3" : `#${item.rank}`}
                    </span>
                  </div>

                  <div className="col-info">
                    <div className="lead-name-group">
                      <strong className="lead-item-name">
                        {item.team} {item.isCurrentTeam && <span className="you-chip">Your Team</span>}
                      </strong>
                      <span className="lead-item-sub">{item.college}</span>
                    </div>
                  </div>

                  <div className="col-badge">
                    {item.badge ? (
                      <span className="lead-badge-pill league-pill">{item.badge}</span>
                    ) : (
                      <span className="text-muted text-xs">—</span>
                    )}
                  </div>

                  <div className="col-points text-right">
                    <strong className="lead-pts-val text-emerald-400">
                      {item.points.toLocaleString()}
                    </strong>
                    <span className="lead-pts-lbl">pts</span>
                  </div>
                </div>
              ))}

              {filteredTeams.length === 0 && (
                <div className="lead-empty-state">
                  <Sparkles size={32} className="text-emerald-400" />
                  <h4>No squads found</h4>
                  <p>Try searching with another keyword.</p>
                </div>
              )}
            </>
          )}

          {/* 3. College Champions Tab */}
          {activeTab === "colleges" && (
            <>
              {filteredColleges.map((item) => (
                <div
                  key={item.rank}
                  className={`lead-row-item ${item.isCurrentCollege ? "user-row-highlight" : ""}`}
                >
                  <div className="col-rank">
                    <span className={`rank-pill-badge ${item.rank <= 3 ? `rank-${item.rank}` : ""}`}>
                      {item.rank === 1 ? "🥇 1" : item.rank === 2 ? "🥈 2" : item.rank === 3 ? "🥉 3" : `#${item.rank}`}
                    </span>
                  </div>

                  <div className="col-info">
                    <div className="lead-name-group">
                      <strong className="lead-item-name">
                        {item.college} {item.isCurrentCollege && <span className="you-chip">Your College</span>}
                      </strong>
                      <span className="lead-item-sub">{item.state} • {item.teamsCount} Active Teams</span>
                    </div>
                  </div>

                  <div className="col-badge">
                    {item.badge ? (
                      <span className="lead-badge-pill college-badge-pill">{item.badge}</span>
                    ) : (
                      <span className="text-muted text-xs">—</span>
                    )}
                  </div>

                  <div className="col-points text-right">
                    <strong className="lead-pts-val text-cyan-400">
                      {item.points.toLocaleString()}
                    </strong>
                    <span className="lead-pts-lbl">pts</span>
                  </div>
                </div>
              ))}

              {filteredColleges.length === 0 && (
                <div className="lead-empty-state">
                  <Sparkles size={32} className="text-emerald-400" />
                  <h4>No colleges found</h4>
                  <p>Try searching with another keyword.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Leaderboard;

