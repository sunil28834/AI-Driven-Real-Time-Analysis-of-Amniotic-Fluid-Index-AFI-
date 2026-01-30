import React from "react";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import doctors from "./DD"; // Import your doctor database

export default function Doctors() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Our Doctors
      </Typography>

      <Grid container spacing={3}>
        {doctors.map((doc) => (
          <Grid item xs={12} sm={6} md={4} key={doc.id}>
            <Card
              sx={{
                p: 2,
                borderRadius: 3,
                boxShadow: 3,
                transition: "0.3s",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                },
              }}
            >
              <CardContent>
                {/* Doctor Name */}
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {doc.name}
                </Typography>

                <Typography sx={{ color: "gray", mb: 1 }}>
                  {doc.specialty}
                </Typography>

                {/* Experience */}
                <Typography variant="body2">
                  Experience: {doc.experience}
                </Typography>

                {/* Rating */}
                <Typography variant="body2" sx={{ mt: 1 }}>
                  ⭐ Rating: {doc.rating}
                </Typography>

                {/* Education */}
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Education: {doc.education}
                </Typography>

                {/* College */}
                {doc.college && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    College: {doc.college}
                  </Typography>
                )}

                {/* Hospital */}
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Hospital: {doc.Hospital}
                </Typography>

                {/* Fee */}
                <Typography
                  variant="body2"
                  sx={{ mt: 1, fontWeight: 600, color: "#2E7D32" }}
                >
                  Fee: {doc.consultationFee}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}