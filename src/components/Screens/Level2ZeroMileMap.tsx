import React, { useState, useRef } from "react";
import { useGame } from "../../context/GameContext";
import { INDIA_MAP_DATA } from "../../data/indiaMapData";
import {
  Compass,
  MapPin,
  ArrowRight,
  RotateCcw,
  Target,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { sound } from "../../utils/audio";

export const Level2ZeroMileMap: React.FC = () => {
  const { state, updateZeroScore, navigateTo } = useGame();

  const [userPin, setUserPin] = useState<{
    x: number;
    y: number;
    lat: number;
    lon: number;
  } | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // The place the consumer typed on the login/registration screen is the
  // target they need to pinpoint on the map.
  const userCityKey = (state.userCity || "nagpur").toLowerCase();
  const targetCity = INDIA_MAP_DATA.getCityInfo(userCityKey);

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (submitted || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert to SVG viewBox coordinates
    const scaleX = INDIA_MAP_DATA.width / rect.width;
    const scaleY = INDIA_MAP_DATA.height / rect.height;
    const svgX = clickX * scaleX;
    const svgY = clickY * scaleY;

    // Unproject to lat/lon
    const normX = svgX / INDIA_MAP_DATA.width;
    const normY = svgY / INDIA_MAP_DATA.height;
    const [lon, lat] = INDIA_MAP_DATA.unproject(normX, normY);

    // Compute distance to the consumer's own city (their login answer)
    const dist = Math.round(
      INDIA_MAP_DATA.haversineKm(lat, lon, targetCity.lat, targetCity.lon),
    );
    setDistanceKm(dist);

    // Scoring formula: 1,000 pts minus distance penalty, minimum 300 pts
    const calculatedScore = Math.max(
      300,
      Math.min(1000, Math.round(1000 - dist * 0.9)),
    );
    setScore(calculatedScore);
    setUserPin({ x: svgX, y: svgY, lat, lon });

    sound.playClick();
  };

  const handleConfirmGuess = () => {
    if (!userPin || score === null) return;
    sound.playSuccess();
    setSubmitted(true);
    updateZeroScore(score, { x: userPin.x, y: userPin.y });
  };

  const handleReset = () => {
    setUserPin(null);
    setDistanceKm(null);
    setScore(null);
    setSubmitted(false);
    sound.playClick();
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold gold-gradient-text mt-1">
            THE INDIAN EDIT — LOCATE THE EDIT
          </h2>
          <p className="text-xs text-[#f2ead9] mt-1">
            Pinpoint your own city on the map!
          </p>
        </div>

        {/* Live Distance / Score Feedback */}
        {distanceKm !== null && (
          <div className="flex items-center gap-3 bg-[#22160f] border border-[#d4af37]/40 rounded-xl px-4 py-2 shadow-lg">
            <div className="text-center border-r border-[#3d261a] pr-3">
              <span className="text-[10px] text-[#a69383] uppercase font-bold">
                DISTANCE OFF
              </span>
              <div className="font-mono text-lg font-bold text-[#f5d77f]">
                {distanceKm} km
              </div>
            </div>
            <div className="text-center pl-1">
              <span className="text-[10px] text-[#a69383] uppercase font-bold">
                SCORE
              </span>
              <div className="font-mono text-lg font-bold text-[#fff1b8]">
                {score} pts
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Map Interactive Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Map Container */}
        <div className="lg:col-span-8 gold-card p-4 sm:p-6 overflow-hidden relative">
          <div className="text-xs font-semibold text-[#d4af37] mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              <span>Click / Tap map to drop your Location pin</span>
            </span>
            {userPin && !submitted && (
              <span className="text-[11px] text-[#warm-beige]">
                Pin placed! Confirm below.
              </span>
            )}
          </div>

          <div className="relative w-full aspect-760/870 max-h-155 mx-auto bg-[#1a110a] rounded-xl border border-[#3d261a] overflow-hidden flex items-center justify-center">
            <svg
              ref={svgRef}
              viewBox={INDIA_MAP_DATA.viewBox}
              onClick={handleSvgClick}
              className="w-full h-full cursor-crosshair select-none"
            >
              {/* Map Background Gradients */}
              <defs>
                <radialGradient id="nagpurPulse" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#d4af37" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ff9933" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* State Boundaries */}
              <g className="states-group">
                {INDIA_MAP_DATA.states.map((st, i) => (
                  <path
                    key={i}
                    d={st.d}
                    fill="#281a13"
                    stroke="#593b2a"
                    strokeWidth="1"
                    className="hover:fill-[#3d261a] transition-colors"
                  >
                    <title>{st.name}</title>
                  </path>
                ))}
              </g>

              {/* Major Cities subtle markers (target city is hidden until reveal) */}
              {Object.entries(INDIA_MAP_DATA.cities).map(([key, city]) => {
                if (city.name.toLowerCase() === targetCity.name.toLowerCase())
                  return null;
                return (
                  <g key={key} opacity="0.45">
                    <circle
                      cx={city.svgX}
                      cy={city.svgY}
                      r="2.5"
                      fill="#a69383"
                    />
                    <text
                      x={city.svgX}
                      y={city.svgY - 5}
                      fontSize="9"
                      fill="#8c7766"
                      textAnchor="middle"
                      fontFamily="Montserrat, sans-serif"
                    >
                      {city.name}
                    </text>
                  </g>
                );
              })}

              {/* Target City Marker — the consumer's own city from the login
                  form. Only revealed once the guess is submitted, so it
                  doesn't give the answer away beforehand. */}
              {submitted && (
                <g
                  transform={`translate(${targetCity.svgX}, ${targetCity.svgY})`}
                >
                  <circle
                    r="14"
                    fill="url(#nagpurPulse)"
                    className="animate-pulse"
                  />
                  <circle
                    r="5"
                    fill="#d4af37"
                    stroke="#fff1b8"
                    strokeWidth="1.5"
                  />
                  <text
                    y="-12"
                    fontSize="11"
                    fill="#fff1b8"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontFamily="Montserrat, sans-serif"
                  >
                    {targetCity.name} (Your City)
                  </text>
                </g>
              )}

              {/* User Placed Pin */}
              {userPin && (
                <g transform={`translate(${userPin.x}, ${userPin.y})`}>
                  <circle
                    r="6"
                    fill="#ff4d4d"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <text
                    y="16"
                    fontSize="10"
                    fill="#ff8080"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontFamily="Montserrat, sans-serif"
                  >
                    Your Guess
                  </text>
                  {/* Line between user pin and the actual target — only
                      drawn after submission, alongside the reveal above */}
                  {submitted && (
                    <line
                      x1="0"
                      y1="0"
                      x2={targetCity.svgX - userPin.x}
                      y2={targetCity.svgY - userPin.y}
                      stroke="#ff4d4d"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  )}
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Right Info & Submission Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="gold-card p-5">
            {/* Action Buttons */}
            <div className="space-y-2">
              {!submitted ? (
                <button
                  disabled={!userPin}
                  onClick={handleConfirmGuess}
                  className={`w-full py-3 px-4 rounded-full text-xs font-bold flex items-center justify-center gap-2 ${
                    userPin
                      ? "btn-gold cursor-pointer"
                      : "bg-[#2e1e15] text-[#6d5746] border border-[#3d261a] cursor-not-allowed"
                  }`}
                >
                  <Target className="w-4 h-4" />
                  <span>
                    {userPin ? "Lock in My Guess" : "Place Pin on Map First"}
                  </span>
                </button>
              ) : (
                <div className="p-4 rounded-xl bg-linear-to-r from-[#2e1e15] to-[#3d261a] border border-[#d4af37] text-center space-y-3 animate-fade-in">
                  <div className="flex items-center justify-center gap-1.5 text-[#fff1b8] text-sm font-bold">
                    <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                    <span>Level 02 Cleared!</span>
                  </div>
                  <div className="text-xs text-[#warm-beige]">
                    You earned{" "}
                    <strong className="text-[#f5d77f] font-mono">
                      {score} points
                    </strong>{" "}
                    with a precision accuracy of {distanceKm} km!
                  </div>

                  <button
                    onClick={() => navigateTo("screen-level-3")}
                    className="w-full py-3 btn-gold text-xs font-bold flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>Proceed to Level 03: Decode Bottle</span>
                  </button>
                </div>
              )}

              {userPin && !submitted && (
                <button
                  onClick={handleReset}
                  className="w-full py-2 rounded-full border border-[#d4af37]/30 text-xs text-[#a69383] hover:text-[#faf6f0] hover:bg-[#2e1e15] flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Pin Location</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
