// Tips.jsx
import React, { useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Link as MuiLink,
  Stack,
  IconButton,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SpaIcon from '@mui/icons-material/Spa';
import BedtimeIcon from '@mui/icons-material/Bedtime';

/**
 * Pregnancy Health Guide - React (MUI) component
 * - Self-contained layout + styling with sx
 * - Smooth scrolling, reveal-on-scroll, hover/focus animations
 *
 * Save as Tips.jsx and import: import Tips from './Tips';
 * Dependencies: @mui/material, @mui/icons-material
 */

const monthData = [
  {
    id: 'month-1',
    title: 'Month 1: Early Changes',
    items: [
      'Start taking prenatal vitamins with folic acid (400–800 mcg).',
      'Schedule your first prenatal appointment.',
      'Avoid alcohol, smoking, and harmful substances.',
      'Eat balanced meals with plenty of fruits and vegetables.',
      'Stay hydrated with at least 8 glasses of water daily.',
    ],
  },
  {
    id: 'month-2',
    title: 'Month 2: Managing Symptoms',
    items: [
      'Eat small, frequent meals to combat nausea.',
      'Get plenty of rest to fight fatigue.',
      'Continue taking prenatal vitamins.',
      'Avoid raw or undercooked foods.',
      'Begin light exercise like walking.',
    ],
  },
  {
    id: 'month-3',
    title: 'Month 3: First Trimester Wrap-up',
    items: [
      'Schedule your first ultrasound.',
      'Discuss genetic screening with your doctor.',
      'Wear comfortable, non-restrictive clothing.',
      'Practice stress-reduction techniques.',
      'Continue healthy eating habits.',
    ],
  },
  {
    id: 'month-4',
    title: 'Month 4: Second Trimester Begins',
    items: [
      'Increase calorie intake by about 300 calories per day.',
      'Start sleeping on your side.',
      'Consider prenatal yoga or swimming.',
      'Begin moisturizing your belly to prevent stretch marks.',
      'Schedule your anatomy scan (around 18–22 weeks).',
    ],
  },
  {
    id: 'month-5',
    title: 'Month 5: Feeling Movement',
    items: [
      'Pay attention to fetal movements.',
      'Wear supportive shoes to accommodate weight changes.',
      'Continue regular prenatal check-ups.',
      'Practice good posture to reduce back strain.',
      'Consider childbirth education classes.',
    ],
  },
  {
    id: 'month-6',
    title: 'Month 6: Growing Bump',
    items: [
      'Monitor for signs of gestational diabetes.',
      'Elevate feet when sitting to reduce swelling.',
      'Wear compression stockings if needed.',
      'Practice Kegel exercises.',
      'Stay active with moderate exercise.',
    ],
  },
  {
    id: 'month-7',
    title: 'Month 7: Third Trimester',
    items: [
      "Start preparing for baby's arrival.",
      'Watch for signs of preterm labor.',
      'Sleep with extra pillows for support.',
      "Continue monitoring baby's movements.",
      'Discuss birth plan with your healthcare provider.',
    ],
  },
  {
    id: 'month-8',
    title: 'Month 8: Final Preparations',
    items: [
      'Pack your hospital bag.',
      'Install car seat.',
      "Finalize baby's name.",
      'Practice relaxation techniques for labor.',
      'Rest as much as possible.',
    ],
  },
  {
    id: 'month-9',
    title: 'Month 9: Ready for Delivery',
    items: [
      'Know the signs of labor.',
      'Have important phone numbers readily available.',
      'Eat light, easily digestible foods.',
      'Stay hydrated.',
      'Trust your body and your healthcare team.',
    ],
  },
];

const tipsData = [
  {
    title: 'Nutrition',
    icon: <LocalHospitalIcon />,
    text:
      'Eat a balanced diet rich in fruits, vegetables, whole grains, lean proteins, and dairy. Stay hydrated and avoid empty calories.',
  },
  {
    title: 'Exercise',
    icon: <SpaIcon />,
    text:
      'Engage in moderate exercise for 30 minutes most days. Walking, swimming, and prenatal yoga are excellent options.',
  },
  {
    title: 'Rest & Sleep',
    icon: <BedtimeIcon />,
    text:
      'Get plenty of rest. Sleep on your side in later pregnancy, using pillows for support. Nap when needed.',
  },
  {
    title: 'Stress Management',
    icon: <SpaIcon />,
    text:
      'Practice relaxation techniques like deep breathing, meditation, or prenatal massage to reduce stress.',
  },
  {
    title: 'Prenatal Care',
    icon: <LocalHospitalIcon />,
    text:
      'Attend all scheduled prenatal appointments. Discuss any concerns with your healthcare provider promptly.',
  },
  {
    title: 'Avoid Harmful Substances',
    icon: <CalendarMonthIcon />,
    text:
      'Avoid alcohol, tobacco, recreational drugs, and limit caffeine. Check with your doctor before taking any medications.',
  },
];

const resourcesData = [
  { title: 'Pregnancy Apps', text: "Track your pregnancy progress, symptoms, and baby's development with recommended apps." },
  { title: 'Nutrition Guides', text: 'Detailed meal plans and recipes tailored for each trimester of pregnancy.' },
  { title: 'Exercise Videos', text: 'Safe workout routines designed specifically for pregnant women.' },
  { title: 'Support Groups', text: 'Connect with other expectant mothers for advice and encouragement.' },
];

const TipCardSmall = ({ icon, title, text }) => (
  <Card
    elevation={3}
    sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 2,
      transition: 'transform .28s ease, box-shadow .28s ease',
      ':hover': { transform: 'translateY(-6px)', boxShadow: '0 14px 30px rgba(0,0,0,0.12)' },
    }}
    role="article"
    aria-label={title}
  >
    <Box sx={{ bgcolor: 'background.paper' }}>
      <Box
        sx={{
          bgcolor: '#2E7D32',
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          color: '#ffffff',
        }}
      >
        <IconButton size="large" sx={{ color: '#ffffff' }} aria-hidden>
          {icon}
        </IconButton>
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1" sx={{ color: '#0f172a', mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: '#475569' }}>
          {text}
        </Typography>
      </CardContent>
    </Box>
  </Card>
);

export default function Tips() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current ?? document;
    // Smooth scrolling for internal nav links inside this component
    const handleNavClick = (e) => {
      const a = e.currentTarget;
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = root.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // focus for accessibility
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    };

    const anchors = Array.from(root.querySelectorAll('a[href^="#"]'));
    anchors.forEach((a) => a.addEventListener('click', handleNavClick));

    // Reveal on scroll (IntersectionObserver)
    const revealElements = Array.from(root.querySelectorAll('.reveal-on-scroll'));
    let obs;
    if ('IntersectionObserver' in window && revealElements.length > 0) {
      obs = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
              entry.target.style.transition = 'opacity .6s ease, transform .6s ease';
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      revealElements.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(14px)';
        obs.observe(el);
      });
    } else {
      // fallback
      revealElements.forEach((el) => (el.style.opacity = '1'));
    }

    // Hover/focus scale for timeline items: also enable keyboard focus
    const timelineItems = Array.from(root.querySelectorAll('.timeline-item'));
    timelineItems.forEach((item) => {
      item.setAttribute('tabindex', '0');
      const enter = () => {
        item.style.transform = 'scale(1.02)';
        item.style.boxShadow = '0 12px 26px rgba(0,0,0,0.12)';
      };
      const leave = () => {
        item.style.transform = 'scale(1)';
        item.style.boxShadow = '';
      };
      item.addEventListener('mouseenter', enter);
      item.addEventListener('mouseleave', leave);
      item.addEventListener('focus', enter);
      item.addEventListener('blur', leave);
    });

    return () => {
      anchors.forEach((a) => a.removeEventListener('click', handleNavClick));
      if (obs) obs.disconnect();
      timelineItems.forEach((item) => {
        item.removeEventListener('mouseenter', () => {});
        item.removeEventListener('mouseleave', () => {});
      });
    };
  }, []);

  return (
    <Box ref={rootRef} sx={{ bgcolor: '#fff', minHeight: '100vh' }}>
      {/* Skip to content link */}
      <a
        href="#maincontent"
        style={{
          position: 'fixed',
          left: 12,
          top: 12,
          zIndex: 9999,
          background: '#111',
          color: '#fff',
          padding: '8px 12px',
          borderRadius: 6,
          transform: 'translateY(-120%)',
        }}
        onFocus={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        onBlur={(e) => (e.currentTarget.style.transform = 'translateY(-120%)')}
      >
        Skip to content
      </a>

      {/* Header */}
      <Box
        component="header"
        sx={{
          background: 'linear-gradient(to right,#ff99cc,#b3e0ff)',
          py: 2,
          position: 'sticky',
          top: 0,
          zIndex: 1200,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}
      >
        <Container maxWidth="lg">
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ gap: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box component="span" sx={{ fontSize: 28, color: '#fff' }} aria-hidden>
                🤰
              </Box>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
                Pregnancy Health Guide
              </Typography>
            </Stack>

            <Box component="nav" aria-label="Main navigation">
              <Stack direction="row" spacing={2}>
                <MuiLink href="#timeline" underline="none" sx={{ color: '#030303', fontWeight: 600 }}>
                  Month by Month
                </MuiLink>
                <MuiLink href="#tips" underline="none" sx={{ color: '#030303', fontWeight: 600 }}>
                  Health Tips
                </MuiLink>
                <MuiLink href="#resources" underline="none" sx={{ color: '#030303', fontWeight: 600 }}>
                  Resources
                </MuiLink>
                <MuiLink href="#contact" underline="none" sx={{ color: '#030303', fontWeight: 600 }}>
                  Contact
                </MuiLink>
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Main */}
      <Box component="main" id="maincontent" tabIndex={-1}>
        {/* Hero */}
        <Box
          sx={{
            backgroundImage:
              'linear-gradient(rgba(255,153,204,0.82),rgba(179,224,255,0.82)), url("https://images.unsplash.com/photo-1516627145497-ae69578b5b84?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: '#fff',
            py: { xs: 6, md: 10 },
            textAlign: 'center',
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
              Your Journey to Motherhood Starts Here
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 720, mx: 'auto', mb: 3 }}>
              Get expert health tips and guidance for each stage of pregnancy, from the first month through delivery.
            </Typography>
            <Button
              href="#timeline"
              variant="contained"
              sx={{
                bgcolor: 'rgb(186,246,195)',
                color: '#ff99cc',
                fontWeight: 700,
                borderRadius: '30px',
                px: 3,
                py: 1,
                boxShadow: '0 4px 6px rgba(0,0,0,0.08)',
                '&:hover': { transform: 'translateY(-3px)' },
              }}
            >
              Explore Month-by-Month Guide
            </Button>
          </Container>
        </Box>

        {/* Timeline */}
        <Box component="section" id="timeline" sx={{ py: { xs: 4, md: 6 }, bgcolor: '#fff' }}>
          <Container maxWidth="lg">
            <Typography variant="h5" align="center" sx={{ mb: 3, fontWeight: 700 }}>
              Pregnancy Health Timeline
            </Typography>

            <Box
              sx={{
                position: 'relative',
                maxWidth: 1000,
                mx: 'auto',
                px: 2,
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: '50%',
                  width: 4,
                  bgcolor: '#b3e0ff',
                  transform: 'translateX(-50%)',
                },
              }}
            >
              <Grid container spacing={4}>
                {monthData.map((m, idx) => {
                  const isEven = idx % 2 === 1;
                  return (
                    <Grid
                      key={m.id}
                      item
                      xs={12}
                      sx={{
                        width: '100%',
                        position: 'relative',
                        pl: { xs: 8, md: isEven ? 6 : 0 },
                        pr: { xs: 2, md: isEven ? 0 : 6 },
                        display: 'flex',
                        justifyContent: isEven ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <Box
                        className="timeline-item reveal-on-scroll"
                        sx={{
                          width: { xs: '100%', md: '48%' },
                          transformOrigin: 'center',
                        }}
                        role="article"
                        aria-label={m.title}
                      >
                        <Card
                          elevation={3}
                          sx={{
                            borderRadius: 2,
                            p: 2,
                            position: 'relative',
                            '&:after': {
                              content: '""',
                              position: 'absolute',
                              top: 28,
                              width: 20,
                              height: 20,
                              bgcolor: '#ff99cc',
                              border: '4px solid white',
                              borderRadius: '50%',
                              right: isEven ? 'auto' : -10,
                              left: isEven ? -10 : 'auto',
                            },
                          }}
                        >
                          <CardContent sx={{ p: 1.5 }}>
                            <Typography variant="subtitle1" sx={{ color: 'primary.main', mb: 1 }}>
                              {m.title}
                            </Typography>
                            <Box component="ul" sx={{ pl: 2, mt: 0 }}>
                              {m.items.map((it, i) => (
                                <Box component="li" key={i} sx={{ mb: 0.6 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    {it}
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          </CardContent>
                        </Card>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </Container>
        </Box>

        {/* General Tips */}
        <Box component="section" id="tips" sx={{ py: { xs: 4, md: 6 }, bgcolor: '#fff5f5' }}>
          <Container maxWidth="lg">
            <Typography variant="h5" align="center" sx={{ mb: 3, fontWeight: 700 }}>
              Essential Pregnancy Health Tips
            </Typography>

            <Grid container spacing={3}>
              {tipsData.map((t, i) => (
                <Grid item xs={12} sm={6} md={4} key={t.title}>
                  <Box className="reveal-on-scroll">
                    <TipCardSmall icon={t.icon} title={t.title} text={t.text} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Resources */}
        <Box component="section" id="resources" sx={{ py: { xs: 4, md: 6 }, bgcolor: '#fff' }}>
          <Container maxWidth="lg">
            <Typography variant="h5" align="center" sx={{ mb: 3, fontWeight: 700 }}>
              Helpful Resources
            </Typography>

            <Grid container spacing={2}>
              {resourcesData.map((r) => (
                <Grid item xs={12} sm={6} md={3} key={r.title}>
                  <Box
                    className="reveal-on-scroll"
                    sx={{
                      p: 2,
                      borderLeft: '4px solid',
                      borderColor: 'primary.main',
                      bgcolor: '#fff9f9',
                      borderRadius: 1,
                      height: '100%',
                    }}
                    role="region"
                    aria-label={r.title}
                  >
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      {r.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {r.text}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        id="contact"
        sx={{
          bgcolor: '#333',
          color: '#fff',
          py: 4,
          mt: 2,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3} sx={{ mb: 2 }}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ color: 'primary.main', mb: 1 }}>
                About Us
              </Typography>
              <Typography variant="body2">
                Providing evidence-based pregnancy health information to support mothers through every stage of their journey by{' '}
                <strong>Team SPSY...</strong>
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ color: 'primary.main', mb: 1 }}>
                Quick Links
              </Typography>
              <Stack component="ul" spacing={1} sx={{ listStyle: 'none', pl: 0 }}>
                <li>
                  <MuiLink href="#timeline" color="inherit" underline="none">
                    Month-by-Month Guide
                  </MuiLink>
                </li>
                <li>
                  <MuiLink href="#tips" color="inherit" underline="none">
                    Health Tips
                  </MuiLink>
                </li>
                <li>
                  <MuiLink href="#resources" color="inherit" underline="none">
                    Resources
                  </MuiLink>
                </li>
              </Stack>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ color: 'primary.main', mb: 1 }}>
                Contact
              </Typography>
              <Stack spacing={0.5}>
                <Typography variant="body2">Email: suniltr28@gmail.com</Typography>
                <Typography variant="body2">Phone: 9686270145</Typography>
                <Typography variant="body2">Phone: 8217056187</Typography>
                <Typography variant="body2">Phone: 8431161338</Typography>
                <Typography variant="body2">Phone: 7411271392</Typography>
                <Typography variant="body2">
                  Address: GEC Chaalakere(577522), Chitradurga(D) Ballari Road Sujimalleshwara Temple Near.
                </Typography>
              </Stack>
            </Grid>
          </Grid>

          <Box sx={{ textAlign: 'center', pt: 2, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <Typography variant="body2">&copy; 2025-26 Pregnancy Health Guide. All rights reserved.</Typography>
            <Typography variant="body2">Designed by <strong>Team SPSY....</strong></Typography>
            <Box sx={{ mt: 1 }}>
              <MuiLink href="https://github.com/Sanjay837" target="_blank" rel="noopener" sx={{ color: '#21df8d' }}>
                GitHub
              </MuiLink>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
