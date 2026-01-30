import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
// MUI
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  IconButton,
  Button,
  TextField,
  Chip,
  Stack,
} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import SearchIcon from "@mui/icons-material/Search";
import ShareIcon from "@mui/icons-material/Share";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";


const defaultVideoData = [
  { id: 1, title: "Advanced Animation Techniques", category: "technique", duration: "15:30", saved: false },
  { id: 2, title: "Character Design Inspiration", category: "inspiration", duration: "22:15", saved: true },
  { id: 3, title: "Digital Painting Tutorial", category: "tutorial", duration: "45:20", saved: false },
  { id: 4, title: "3D Modeling Workflow", category: "tutorial", duration: "38:45", saved: false },
  { id: 5, title: "Color Theory Masterclass", category: "technique", duration: "28:10", saved: true },
  { id: 6, title: "Storyboarding for Animation", category: "technique", duration: "33:25", saved: false },
  { id: 7, title: "Creative Concept Art", category: "inspiration", duration: "19:50", saved: false },
  { id: 8, title: "Rigging Characters in Blender", category: "tutorial", duration: "52:15", saved: false },
  { id: 9, title: "Motion Graphics Principles", category: "technique", duration: "26:40", saved: true },
  { id: 10, title: "Visual Development Process", category: "inspiration", duration: "41:30", saved: false },
  { id: 11, title: "UI/UX Design Patterns", category: "tutorial", duration: "35:55", saved: false },
  { id: 12, title: "Photorealistic Rendering", category: "technique", duration: "47:20", saved: false },
];

const embedUrls = [
  "https://www.youtube.com/embed/aGNrDRQ1PAw?si=tlmyrS_zcjHcoXc7",
  "https://www.youtube.com/embed/SPDKgRwLCtE?si=m4SNja-zwhVQRTwP",
  "https://www.youtube.com/embed/zjD9Ky4zFME?si=7mLoYLFOQ5AYC1ZA",
  "https://www.youtube.com/embed/Ra-GtEDB2bQ?si=dvw7KblV4ESRp5T9",
  "https://www.youtube.com/embed/z78X4RNwmtY?si=evxo1m-YhTTguu9p",
  "https://www.youtube.com/embed/311yHRnUm7c?si=HnfmLhIpRww5sxzM",
  "https://www.youtube.com/embed/2rlwYjpn-Ks?si=r4WDwZEkVWfdqnMN",
  "https://www.youtube.com/embed/ztdZanqFjW0?si=-vv23r5OPynv3DgK",
  "https://www.youtube.com/embed/VjsWHil3rBc?si=nCgL-sNSdrR5-Nq5",
  "https://www.youtube.com/embed/vXC5bjxdroI?si=STIhU3AFBRkn-f48",
  "https://www.youtube.com/embed/0fPQV8fdaYg?si=Lb_UA2mh0xmj-dM_",
  "https://www.youtube.com/embed/6HauVCW3I9Q?si=IBbmmZ73Blw7ZSO5",
];

function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch (e) {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {}
  }, [key, state]);
  return [state, setState];
}

export default function RefVideos({ initialData = defaultVideoData }) {
  // Persisted state for saved marks
  const [videos, setVideos] = useLocalStorage("refvideos:data", initialData);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  // derived list of categories for chips
  const categories = useMemo(() => ["all", ...Array.from(new Set(videos.map((v) => v.category)))], [videos]);

  useEffect(() => {
    // keep number of embedUrls in sync with videos length
    if (videos.length > embedUrls.length) console.warn("Not enough embed URLs for videos array");
  }, [videos]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = videos;
    if (q) list = list.filter((v) => v.title.toLowerCase().includes(q));
    if (filter !== "all") list = list.filter((v) => v.category === filter);
    return list;
  }, [videos, query, filter]);

  function toggleSave(id) {
    setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, saved: !v.saved } : v)));
  }

  function shareVideo(id) {
    const idx = videos.findIndex((v) => v.id === id);
    if (idx === -1) return;
    const url = embedUrls[idx].replace("/embed/", "/watch?v=").split("?")[0];
    if (navigator.share) {
      navigator.share({ title: videos[idx].title, url }).catch(() => {});
    } else {
      // fallback: copy to clipboard & alert
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url);
        alert("Video URL copied to clipboard:" + url);
      } else {
        prompt("Copy this URL", url);
      }
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
      <Box component="header" sx={{ bgcolor: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", py: 2 }}>
        <Container maxWidth="lg" sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PlayCircleFilledWhiteIcon sx={{ color: "#4cc9f0", fontSize: 36 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              RefVideos
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <TextField
              size="small"
              placeholder="Search videos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1 }} />,
                sx: { bgcolor: "rgba(255,255,255,0.06)", borderRadius: 6 },
              }}
            />
            <Button variant="contained" onClick={() => document.getElementById("grid-top")?.scrollIntoView({ behavior: "smooth" })}>
              Browse
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" align="center" sx={{ fontWeight: 800, mb: 3, background: "linear-gradient(90deg,#4cc9f0,#4361ee)", WebkitBackgroundClip: "text", color: "transparent" }}>
          Reference Videos Collection
        </Typography>

        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 3, flexWrap: "wrap" }}>
          {categories.map((cat) => (
            <Chip key={cat} label={cat === "all" ? "All Videos" : capitalize(cat)} color={filter === cat ? "primary" : "default"} onClick={() => setFilter(cat)} clickable sx={{ textTransform: "capitalize" }} />
          ))}
        </Stack>

        <Box id="grid-top">
          {filtered.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary">
                No videos found matching your criteria
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {filtered.map((video, idx) => (
                <Grid item xs={12} sm={6} md={4} key={video.id}>
                  <Paper sx={{ overflow: "hidden", borderRadius: 2, boxShadow: 3 }}>
                    <Box sx={{ position: "relative", pb: "56.25%", height: 0 }}>
                      <iframe
                        src={embedUrls[videos.findIndex((v) => v.id === video.id)]}
                        title={video.title}
                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      ></iframe>
                    </Box>
                    <Box sx={{ p: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {video.title}
                      </Typography>
                      <Box sx={{ display: "flex", justifyContent: "space-between", color: "text.secondary", fontSize: 13 }}>
                        <Typography variant="body2">{video.duration}</Typography>
                        <Typography variant="body2" sx={{ textTransform: "capitalize" }}>{video.category}</Typography>
                      </Box>

                      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1 }}>
                        <IconButton aria-label="save" onClick={() => toggleSave(video.id)} color={video.saved ? "primary" : "default"}>
                          {video.saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                        </IconButton>
                        <IconButton aria-label="share" onClick={() => shareVideo(video.id)}>
                          <ShareIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        <Box component="footer" sx={{ mt: 6, textAlign: "center", color: "text.secondary" }}>
          <Typography variant="body2">Reference Videos Collection &copy; {new Date().getFullYear()} | Created with ❤</Typography>
        </Box>
      </Container>
    </Box>
  );
}

RefVideos.propTypes = {
  initialData: PropTypes.array,
};

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}