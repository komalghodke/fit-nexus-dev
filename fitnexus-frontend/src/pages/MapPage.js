import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import { API_URL } from "../api/apiConfig";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Rating,
  Avatar,
  IconButton,
  Tooltip,
  CircularProgress,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { Search, Map, SelfImprovement, FitnessCenter, LocalHospital, GpsFixed, VerifiedUser, Close } from "@mui/icons-material";

// Fix Leaflet CSS missing import issue (leaflet CSS needs to be loaded)
import "leaflet/dist/leaflet.css";

// Pune Center Coordinates
const PUNE_CENTER = [18.5204, 73.8567];

// Helper to center the map on item click
function MapCenterController({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView(coords, 14, { animate: true, duration: 1.5 });
    }
  }, [coords, map]);
  return null;
}

function MapPage() {
  const [selectedType, setSelectedType] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCenter, setActiveCenter] = useState(null);
  const [mapCenter, setMapCenter] = useState(PUNE_CENTER);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [sourceInfo, setSourceInfo] = useState("Local Curated Data");
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [verifyCenter, setVerifyCenter] = useState(null);

  const token = localStorage.getItem("token");

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = [position.coords.latitude, position.coords.longitude];
          setUserLocation(coords);
          setMapCenter(coords);
        },
        () => {
          console.log("Geolocation access denied. Defaulting to Pune.");
        }
      );
    }
    // Initial fetch
    fetchLocations("all", PUNE_CENTER[0], PUNE_CENTER[1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLocations = async (queryStr, latVal, lngVal) => {
    setLoading(true);
    try {
      const lat = latVal || mapCenter[0];
      const lng = lngVal || mapCenter[1];
      const query = queryStr || searchQuery || "wellness";

      const response = await axios.get(`${API_URL}/locations`, {
        params: { query, lat, lng },
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && response.data.results) {
        setCenters(response.data.results);
        setSourceInfo(response.data.source === "serpapi" ? "Live SerpApi Local Search" : "Local Curated Data");
        if (response.data.results.length > 0) {
          // Centering to the first match
          const first = response.data.results[0];
          setMapCenter([first.lat, first.lng]);
          setActiveCenter(first);
        }
      }
    } catch (error) {
      console.error("Failed to fetch locations", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchLocations(searchQuery);
    }
  };

  const handleGpsClick = () => {
    if (userLocation) {
      setMapCenter(userLocation);
      fetchLocations(searchQuery || "fitness", userLocation[0], userLocation[1]);
    }
  };

  // Custom Icon Builders using CSS to avoid Webpack Leaflet asset bugs
  const createCustomIcon = (type, isActive) => {
    let color = "#602e7d"; // default yoga (purple)
    if (type === "GYM") color = "#054474"; // gym (blue)
    if (type === "WELLNESS") color = "#2e7d32"; // wellness (green)

    const size = isActive ? "40px" : "32px";
    const border = isActive ? "3px solid #fff" : "2px solid #fff";
    const shadow = isActive ? "0 4px 12px rgba(0,0,0,0.45)" : "0 2px 6px rgba(0,0,0,0.3)";

    return L.divIcon({
      className: "custom-leaflet-marker",
      html: `<div style="
        background-color: ${color};
        width: ${size};
        height: ${size};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: ${border};
        box-shadow: ${shadow};
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-size: ${isActive ? "16px" : "12px"};
          font-weight: bold;
        ">
          ${type === "YOGA" ? "🧘" : type === "GYM" ? "🏋️" : "🏥"}
        </div>
      </div>`,
      iconSize: isActive ? [40, 40] : [32, 32],
      iconAnchor: isActive ? [20, 40] : [16, 32],
      popupAnchor: [0, -32]
    });
  };

  const handleCenterSelect = (center) => {
    setActiveCenter(center);
    setMapCenter([center.lat, center.lng]);
  };

  const filteredCenters = centers.filter((c) => {
    if (selectedType === "ALL") return true;
    if (selectedType === "AYUSH_CERTIFIED") return c.isAyushCertified === true;
    return c.type === selectedType;
  });

  return (
    <Box sx={{ minHeight: "92vh", background: "#f5f5f5", py: 4 }}>
      <Container maxWidth="xl">
        <Card
          sx={{
            mb: 4,
            borderRadius: 4,
            background: "linear-gradient(135deg, #054474 0%, #602e7d 100%)",
            color: "#fff",
            boxShadow: "0 8px 32px rgba(96, 46, 125, 0.3)"
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifySpaceBetween: "space-between", flexWrap: "wrap", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}>
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 56, height: 56 }}>
                  <Map sx={{ fontSize: 28, color: "#b39ddb" }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    📍 FitNexus Wellness Locator
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Discover real-time fitness facilities, yoga centers, and AYUSH clinics powered by live search.
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={`Source: ${sourceInfo}`}
                sx={{
                  bgcolor: "rgba(255,255,255,0.15)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  border: "1px solid rgba(255,255,255,0.3)"
                }}
              />
            </Box>
          </CardContent>
        </Card>

        <Alert
          severity="warning"
          sx={{
            mb: 3,
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(230,81,0,0.08)",
            border: "1px solid #ffe082",
            fontWeight: 500
          }}
        >
          <strong>Disclaimer:</strong> This wellness locator fetches public map results near you. FitNexus does not verify the credentials, operating status, or reviews of these external facilities. Please exercise independent caution and cross-verify studio details before visiting.
        </Alert>

        <Grid container spacing={3}>
          {/* Sidebar & Filters */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 4, height: "650px", display: "flex", flexDirection: "column", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
              <CardContent sx={{ p: 3, pb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#333", mb: 2 }}>
                  Search Facilities
                </Typography>

                <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    placeholder="Search e.g. YCB yoga, cult fit..."
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      )
                    }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                  />
                  <IconButton
                    color="primary"
                    onClick={() => fetchLocations()}
                    sx={{ border: "1px solid #ddd", borderRadius: 3 }}
                  >
                    <Search />
                  </IconButton>
                  <Tooltip title="Use Current Location">
                    <span>
                      <IconButton
                        color="secondary"
                        disabled={!userLocation}
                        onClick={handleGpsClick}
                        sx={{ border: "1px solid #ddd", borderRadius: 3 }}
                      >
                        <GpsFixed />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>

                {/* Filter Chips */}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1.5 }}>
                  <Chip
                    label="Show All"
                    clickable
                    color={selectedType === "ALL" ? "primary" : "default"}
                    onClick={() => setSelectedType("ALL")}
                    sx={{ fontWeight: 600 }}
                  />
                  <Chip
                    icon={<SelfImprovement />}
                    label="Yoga Centers"
                    clickable
                    color={selectedType === "YOGA" ? "secondary" : "default"}
                    onClick={() => setSelectedType("YOGA")}
                    sx={{ fontWeight: 600 }}
                  />
                  <Chip
                    icon={<FitnessCenter />}
                    label="Gyms & Fitness"
                    clickable
                    color={selectedType === "GYM" ? "primary" : "default"}
                    onClick={() => setSelectedType("GYM")}
                    sx={{ fontWeight: 600 }}
                  />
                  <Chip
                    icon={<LocalHospital />}
                    label="AYUSH Clinics"
                    clickable
                    color={selectedType === "WELLNESS" ? "success" : "default"}
                    onClick={() => setSelectedType("WELLNESS")}
                    sx={{ fontWeight: 600 }}
                  />
                  <Chip
                    icon={<VerifiedUser />}
                    label="🛡️ AYUSH Certified Only"
                    clickable
                    onClick={() => setSelectedType("AYUSH_CERTIFIED")}
                    sx={{
                      fontWeight: 700,
                      bgcolor: selectedType === "AYUSH_CERTIFIED" ? "#b8860b" : "default",
                      color: selectedType === "AYUSH_CERTIFIED" ? "#fff" : "#b8860b",
                      border: "1.5px solid #b8860b",
                      "&:hover": { bgcolor: "#b8860b", color: "#fff" }
                    }}
                  />
                </Box>

                {/* Quick City Jumper / PAN India Selector */}
                <Box sx={{ mb: 2, p: 1.5, bgcolor: "#faf6ff", borderRadius: 3, border: "1px solid rgba(96,46,125,0.15)" }}>
                  <Typography variant="caption" sx={{ color: "#602e7d", fontWeight: 800, display: "block", mb: 1, letterSpacing: 0.5 }}>
                    🇮🇳 PAN INDIA QUICK CITY LOCATOR:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                    {[
                      { label: "🇮🇳 All India", coords: [20.5937, 78.9629], query: "all" },
                      { label: "Mumbai", coords: [19.0760, 72.8777], query: "mumbai" },
                      { label: "Delhi NCR", coords: [28.6139, 77.2090], query: "delhi" },
                      { label: "Rishikesh", coords: [30.0869, 78.2676], query: "rishikesh" },
                      { label: "Bengaluru", coords: [12.9716, 77.5946], query: "bengaluru" },
                      { label: "Chennai", coords: [13.0827, 80.2707], query: "chennai" },
                      { label: "Kolkata", coords: [22.5726, 88.3639], query: "kolkata" },
                      { label: "Pune", coords: [18.5204, 73.8567], query: "pune" },
                      { label: "Hyderabad", coords: [17.3850, 78.4867], query: "hyderabad" }
                    ].map((city) => (
                      <Chip
                        key={city.label}
                        label={city.label}
                        size="small"
                        clickable
                        onClick={() => {
                          setSearchQuery(city.query === "all" ? "" : city.label);
                          setMapCenter(city.coords);
                          fetchLocations(city.query, city.coords[0], city.coords[1]);
                        }}
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.72rem",
                          bgcolor: (searchQuery.toLowerCase() === city.query || (city.query === "all" && !searchQuery)) ? "#602e7d" : "#ffffff",
                          color: (searchQuery.toLowerCase() === city.query || (city.query === "all" && !searchQuery)) ? "#ffffff" : "#602e7d",
                          border: "1px solid rgba(96,46,125,0.25)",
                          "&:hover": { bgcolor: "#602e7d", color: "#ffffff" }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
                <Divider />
              </CardContent>

              {/* Facility List */}
              <Box sx={{ flexGrow: 1, overflowY: "auto", px: 2, maxHeight: activeCenter ? "220px" : "500px" }}>
                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                    <CircularProgress size={30} />
                  </Box>
                ) : (
                  <List>
                    {filteredCenters.map((center, index) => {
                      const isSelected = activeCenter?.name === center.name;
                      return (
                        <React.Fragment key={index}>
                          <ListItem
                            button
                            onClick={() => handleCenterSelect(center)}
                            selected={isSelected}
                            sx={{
                              borderRadius: 3,
                              my: 0.5,
                              border: isSelected ? "1px solid #602e7d" : "1px solid #f0f0f0",
                              bgcolor: isSelected ? "rgba(96, 46, 125, 0.05)" : "transparent",
                              transition: "all 0.2s",
                              "&:hover": { bgcolor: isSelected ? "rgba(96, 46, 125, 0.08)" : "#f9f9f9" }
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              {center.type === "YOGA" ? (
                                <SelfImprovement color="secondary" />
                              ) : center.type === "GYM" ? (
                                <FitnessCenter color="primary" />
                              ) : (
                                <LocalHospital color="success" />
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Box>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#333" }}>
                                    {center.name}
                                  </Typography>
                                  {center.isAyushCertified && (
                                    <Chip
                                      icon={<VerifiedUser sx={{ fontSize: 12 }} />}
                                      label={center.isYcbApproved ? "AYUSH + YCB Certified" : "AYUSH Certified"}
                                      size="small"
                                      sx={{
                                        mt: 0.3,
                                        height: 20,
                                        fontSize: "0.62rem",
                                        fontWeight: 800,
                                        bgcolor: "linear-gradient(135deg, #b8860b, #daa520)",
                                        background: "linear-gradient(135deg, #b8860b, #daa520)",
                                        color: "#fff",
                                        border: "1px solid #b8860b",
                                        "& .MuiChip-icon": { color: "#fff" }
                                      }}
                                    />
                                  )}
                                </Box>
                              }
                              secondary={
                                <Box sx={{ mt: 0.5 }}>
                                  <Typography variant="caption" color="text.secondary" display="block">
                                    {center.address}
                                  </Typography>
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                                    <Rating value={center.rating} precision={0.1} size="small" readOnly />
                                    <Typography variant="caption" sx={{ fontWeight: 600, color: "#666" }}>
                                      {center.rating}
                                    </Typography>
                                  </Box>
                                </Box>
                              }
                            />
                          </ListItem>
                          <Divider variant="inset" component="li" />
                        </React.Fragment>
                      );
                    })}
                    {filteredCenters.length === 0 && (
                      <Box sx={{ textAlign: "center", py: 6, px: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          No facilities found. Click Search to refresh.
                        </Typography>
                      </Box>
                    )}
                  </List>
                )}
              </Box>

              {/* Selected Facility Details Card */}
              {activeCenter && (
                <Box
                  sx={{
                    p: 2,
                    borderTop: "1px solid #eee",
                    bgcolor: "#fafafa",
                    display: "flex",
                    flexDirection: "column",
                    height: "300px",
                    overflowY: "auto"
                  }}
                >
                  <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
                    <img
                      src={
                        activeCenter.thumbnail || (
                          activeCenter.type === "YOGA"
                            ? "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=150&q=80"
                            : activeCenter.type === "GYM"
                            ? "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=150&q=80"
                            : "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=150&q=80"
                        )
                      }
                      alt={activeCenter.name}
                      style={{ width: "80px", height: "80px", borderRadius: "8px", objectFit: "cover" }}
                    />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#333", lineHeight: 1.2 }}>
                        {activeCenter.name}
                      </Typography>
                      <Chip
                        label={activeCenter.type === "YOGA" ? "Yoga Studio" : activeCenter.type === "GYM" ? "Gym / Fitness" : "AYUSH Clinic"}
                        size="small"
                        color={activeCenter.type === "YOGA" ? "secondary" : activeCenter.type === "GYM" ? "primary" : "success"}
                        sx={{ mt: 0.5, mb: 0.5, height: 18, fontSize: "0.65rem", fontWeight: 700 }}
                      />
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Rating value={activeCenter.rating} precision={0.1} size="small" readOnly />
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {activeCenter.rating} ({activeCenter.reviews || 25})
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  {/* AYUSH Certification Badge in Details */}
                  {activeCenter.isAyushCertified && (
                    <Box sx={{
                      mt: 1, mb: 1, p: 1.2, borderRadius: 2,
                      background: "linear-gradient(135deg, #fdf6e3, #fff8dc)",
                      border: "1.5px solid #b8860b"
                    }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                        <VerifiedUser sx={{ color: "#b8860b", fontSize: 18 }} />
                        <Typography variant="caption" sx={{ fontWeight: 800, color: "#8b6914" }}>
                          {activeCenter.certificationTitle || "AYUSH Govt. Certified Center"}
                        </Typography>
                      </Box>
                      <Typography variant="caption" display="block" sx={{ color: "#666", fontSize: "0.68rem" }}>
                        Reg: {activeCenter.ayushRegNo || "N/A"} {activeCenter.isYcbApproved ? " • YCB Approved ✓" : ""}
                      </Typography>
                      <Button
                        size="small"
                        onClick={() => { setVerifyCenter(activeCenter); setVerifyModalOpen(true); }}
                        sx={{
                          mt: 0.5, textTransform: "none", fontWeight: 700, fontSize: "0.7rem",
                          color: "#b8860b", borderColor: "#b8860b", border: "1px solid", borderRadius: 2, py: 0.2, px: 1
                        }}
                      >
                        🛡️ View Full Certification
                      </Button>
                    </Box>
                  )}
                  <Typography variant="caption" sx={{ color: "#666", display: "block", mb: 1, fontStyle: "italic" }}>
                    "{activeCenter.desc || "A premium space supporting your wellness journey."}"
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mb: 0.5, color: "#444" }}>
                    📍 {activeCenter.address}
                  </Typography>
                  {activeCenter.phone && activeCenter.phone !== "N/A" && (
                    <Typography variant="caption" display="block" sx={{ mb: 1, color: "#444", fontWeight: 600 }}>
                      📞 Call: {activeCenter.phone}
                    </Typography>
                  )}
                  {activeCenter.website && (
                    <Button
                      href={activeCenter.website}
                      target="_blank"
                      size="small"
                      variant="contained"
                      color="secondary"
                      sx={{ mt: "auto", textTransform: "none", py: 0.5, borderRadius: 2, fontWeight: 700 }}
                    >
                      Visit Website
                    </Button>
                  )}
                </Box>
              )}
            </Card>
          </Grid>

          {/* Interactive Map */}
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: 4, height: "650px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid #ddd" }}>
              <MapContainer
                center={mapCenter}
                zoom={13}
                style={{ width: "100%", height: "100%" }}
                zoomControl={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {filteredCenters.map((center, index) => {
                  const isActive = activeCenter?.name === center.name;
                  return (
                    <Marker
                      key={index}
                      position={[center.lat, center.lng]}
                      icon={createCustomIcon(center.type, isActive)}
                      eventHandlers={{
                        click: () => setActiveCenter(center)
                      }}
                    >
                      <Popup>
                        <Box sx={{ p: 0.5, minWidth: 200 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#333", mb: 0.5 }}>
                            {center.name}
                          </Typography>
                          <Chip
                            label={center.type === "YOGA" ? "Yoga" : center.type === "GYM" ? "Gym" : "AYUSH/Wellness"}
                            size="small"
                            color={center.type === "YOGA" ? "secondary" : center.type === "GYM" ? "primary" : "success"}
                            sx={{ mb: 0.5, height: 20, fontSize: "0.7rem", fontWeight: 700 }}
                          />
                          {center.isAyushCertified && (
                            <Box sx={{ mb: 0.5 }}>
                              <Chip
                                icon={<VerifiedUser sx={{ fontSize: 10 }} />}
                                label={center.isYcbApproved ? "AYUSH + YCB ✓" : "AYUSH Certified ✓"}
                                size="small"
                                sx={{
                                  height: 18, fontSize: "0.6rem", fontWeight: 800,
                                  background: "linear-gradient(135deg, #b8860b, #daa520)",
                                  color: "#fff", "& .MuiChip-icon": { color: "#fff" }
                                }}
                              />
                            </Box>
                          )}
                          <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 0.5 }}>
                            📍 {center.address}
                          </Typography>
                          <Typography variant="caption" display="block" color="text.primary" sx={{ mb: 1, fontStyle: "italic" }}>
                            "{center.desc}"
                          </Typography>
                          <Divider sx={{ my: 0.5 }} />
                          <Typography variant="caption" display="block" sx={{ fontWeight: 700 }}>
                            📞 Phone: {center.phone}
                          </Typography>
                        </Box>
                      </Popup>
                    </Marker>
                  );
                })}

                <MapCenterController coords={mapCenter} />
              </MapContainer>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* ── AYUSH Verification Audit Modal ── */}
      <Dialog
        open={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, overflow: "hidden" } }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #b8860b 0%, #daa520 50%, #8b6914 100%)",
            color: "#fff",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: 1.5
          }}
        >
          <VerifiedUser sx={{ fontSize: 28 }} />
          AYUSH Certification Verification
          <IconButton
            onClick={() => setVerifyModalOpen(false)}
            sx={{ ml: "auto", color: "#fff" }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 3 }}>
          {verifyCenter && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#333", mb: 1 }}>
                {verifyCenter.name}
              </Typography>
              <Chip
                icon={<VerifiedUser />}
                label={verifyCenter.certificationTitle || "AYUSH Govt. Certified Center"}
                sx={{
                  mb: 2,
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #b8860b, #daa520)",
                  color: "#fff",
                  "& .MuiChip-icon": { color: "#fff" }
                }}
              />

              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
                <Box sx={{ p: 1.5, bgcolor: "#fdf6e3", borderRadius: 2, border: "1px solid #e8d5a3" }}>
                  <Typography variant="caption" sx={{ color: "#8b6914", fontWeight: 800, display: "block" }}>Registration No.</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "#333" }}>{verifyCenter.ayushRegNo || "N/A"}</Typography>
                </Box>
                <Box sx={{ p: 1.5, bgcolor: "#fdf6e3", borderRadius: 2, border: "1px solid #e8d5a3" }}>
                  <Typography variant="caption" sx={{ color: "#8b6914", fontWeight: 800, display: "block" }}>YCB Status</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: verifyCenter.isYcbApproved ? "#2e7d32" : "#999" }}>
                    {verifyCenter.isYcbApproved ? "✅ YCB Approved" : "Not YCB Registered"}
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, bgcolor: "#fdf6e3", borderRadius: 2, border: "1px solid #e8d5a3" }}>
                  <Typography variant="caption" sx={{ color: "#8b6914", fontWeight: 800, display: "block" }}>AYUSH Status</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: verifyCenter.isAyushCertified ? "#2e7d32" : "#999" }}>
                    {verifyCenter.isAyushCertified ? "✅ Ministry of AYUSH Certified" : "Not Certified"}
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, bgcolor: "#fdf6e3", borderRadius: 2, border: "1px solid #e8d5a3" }}>
                  <Typography variant="caption" sx={{ color: "#8b6914", fontWeight: 800, display: "block" }}>Facility Type</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "#333" }}>
                    {verifyCenter.type === "YOGA" ? "🧘 Yoga Institute" : verifyCenter.type === "GYM" ? "🏋️ Gym / Fitness" : "🏥 AYUSH Hospital"}
                  </Typography>
                </Box>
              </Box>

              {verifyCenter.ayushServices && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#8b6914", mb: 1 }}>
                    🕉️ Accredited Services & Specialties
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                    {verifyCenter.ayushServices.split(", ").map((svc, i) => (
                      <Chip
                        key={i}
                        label={svc}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.72rem",
                          bgcolor: "#fff8dc",
                          color: "#8b6914",
                          border: "1px solid #daa520"
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />
              <Typography variant="caption" display="block" sx={{ color: "#666", mb: 0.5 }}>
                📍 {verifyCenter.address}
              </Typography>
              <Typography variant="caption" display="block" sx={{ color: "#666", mb: 0.5 }}>
                📞 {verifyCenter.phone}
              </Typography>
              <Typography variant="caption" display="block" sx={{ fontStyle: "italic", color: "#888", mt: 1 }}>
                ⚠️ Disclaimer: Certification data shown is curated by FitNexus from publicly available AYUSH Ministry & YCB records. Always verify with official sources before enrolling.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setVerifyModalOpen(false)}
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 2,
              background: "linear-gradient(135deg, #b8860b, #daa520)",
              "&:hover": { background: "linear-gradient(135deg, #8b6914, #b8860b)" }
            }}
          >
            Close Verification
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MapPage;
