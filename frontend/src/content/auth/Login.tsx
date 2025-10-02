import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
    Container,
    InputAdornment,
    IconButton,
    Grid,
    Avatar,
    CssBaseline,
    alpha,
    Fade,
    Slide
} from '@mui/material';
import {
    Person as PersonIcon,
    Lock as LockIcon,
    Visibility,
    VisibilityOff,
    Dashboard as DashboardIcon,
    Security as SecurityIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';


const Login: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isLoading, error, isAuthenticated } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    useEffect(() => {
        if (isAuthenticated) {
            const from = (location.state as any)?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (localError) setLocalError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        if (!formData.username || !formData.password) {
            setLocalError('Username and password are required');
            return;
        }

        try {
            await login(formData.username, formData.password);
            const from = (location.state as any)?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        } catch (err) {
            // Error is handled by the auth context
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Box>
            <CssBaseline />
            <Box
                sx={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 2,
                }}
            >
                <Fade in timeout={800}>
                    <Container maxWidth="md">
                        <Grid container spacing={4} alignItems="center">
                            {/* Left side - Branding */}
                            <Grid item xs={12} md={6}>
                                <Slide direction="right" in timeout={1000}>
                                    <Box
                                        sx={{
                                            textAlign: 'center',
                                            color: '#1e40af',
                                            mb: 4,
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                bgcolor: '#3b82f6',
                                                mb: 3,
                                                mx: 'auto',
                                                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                                            }}
                                        >
                                            <DashboardIcon sx={{ fontSize: 40, color: 'white' }} />
                                        </Avatar>
                                        <Typography
                                            variant="h3"
                                            component="h1"
                                            gutterBottom
                                            sx={{
                                                fontWeight: 700,
                                                color: '#1e40af',
                                            }}
                                        >
                                            Tokyo Admin
                                        </Typography>
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                color: '#64748b',
                                                fontWeight: 300,
                                            }}
                                        >
                                            Professional Dashboard
                                        </Typography>
                                        <Box sx={{ mt: 4 }}>
                                            <Typography variant="body1" sx={{ color: '#64748b', mb: 2 }}>
                                                Secure • Modern • Efficient
                                            </Typography>
                                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                                                <SecurityIcon sx={{ color: '#3b82f6' }} />
                                                <Typography variant="body2" sx={{ color: '#64748b' }}>
                                                    Enterprise-grade security
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Slide>
                            </Grid>

                            {/* Right side - Login Form */}
                            <Grid item xs={12} md={6}>
                                <Slide direction="left" in timeout={1200}>
                                    <Card
                                        elevation={8}
                                        sx={{
                                            borderRadius: 4,
                                            background: 'white',
                                            border: '1px solid #e2e8f0',
                                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                        }}
                                    >
                                        <CardContent sx={{ p: 4 }}>
                                            <Box sx={{ textAlign: 'center', mb: 4 }}>
                                                <Typography
                                                    variant="h4"
                                                    component="h2"
                                                    gutterBottom
                                                    sx={{
                                                        fontWeight: 600,
                                                        color: '#1e40af',
                                                    }}
                                                >
                                                    Welcome Back
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        color: '#64748b',
                                                    }}
                                                >
                                                    Sign in to your account
                                                </Typography>
                                            </Box>

                                            {(error || localError) && (
                                                <Fade in>
                                                    <Alert
                                                        severity="error"
                                                        sx={{
                                                            mb: 3,
                                                            borderRadius: 2,
                                                        }}
                                                    >
                                                        {error || localError}
                                                    </Alert>
                                                </Fade>
                                            )}

                                            <Box component="form" onSubmit={handleSubmit}>
                                                <TextField
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    id="username"
                                                    label="Username"
                                                    name="username"
                                                    autoComplete="username"
                                                    autoFocus
                                                    value={formData.username}
                                                    onChange={handleChange}
                                                    sx={{
                                                        mb: 2,
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 2,
                                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                                borderColor: '#3b82f6',
                                                            },
                                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                                borderColor: '#3b82f6',
                                                                borderWidth: 2,
                                                            },
                                                        },
                                                    }}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <PersonIcon color="primary" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                                <TextField
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    name="password"
                                                    label="Password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    id="password"
                                                    autoComplete="current-password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    sx={{
                                                        mb: 3,
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 2,
                                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                                borderColor: '#3b82f6',
                                                            },
                                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                                borderColor: '#3b82f6',
                                                                borderWidth: 2,
                                                            },
                                                        },
                                                    }}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <LockIcon color="primary" />
                                                            </InputAdornment>
                                                        ),
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    aria-label="toggle password visibility"
                                                                    onClick={togglePasswordVisibility}
                                                                    edge="end"
                                                                    color="primary"
                                                                >
                                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                                <Button
                                                    type="submit"
                                                    fullWidth
                                                    variant="contained"
                                                    size="large"
                                                    disabled={isLoading}
                                                    sx={{
                                                        mt: 2,
                                                        mb: 2,
                                                        py: 1.5,
                                                        borderRadius: 2,
                                                        fontSize: '1.1rem',
                                                        fontWeight: 600,
                                                        textTransform: 'none',
                                                        background: 'linear-gradient(45deg, #3b82f6 30%, #1d4ed8 90%)',
                                                        boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                                                        '&:hover': {
                                                            background: 'linear-gradient(45deg, #1d4ed8 30%, #1e40af 90%)',
                                                            boxShadow: '0 6px 20px rgba(59, 130, 246, 0.6)',
                                                            transform: 'translateY(-2px)',
                                                        },
                                                        '&:disabled': {
                                                            background: 'rgba(0, 0, 0, 0.12)',
                                                            color: 'rgba(0, 0, 0, 0.26)',
                                                        },
                                                    }}
                                                >
                                                    {isLoading ? 'Signing In...' : 'Sign In'}
                                                </Button>

                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        mt: 3,
                                                    }}
                                                >
                                                    <Typography variant="body2" color="text.secondary">
                                                        Don't have an account?{' '}
                                                        <Link
                                                            to="/register"
                                                            style={{
                                                                color: 'inherit',
                                                                textDecoration: 'none',
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            Sign up
                                                        </Link>
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Slide>
                            </Grid>
                        </Grid>
                    </Container>
                </Fade>
            </Box>
        </Box>
    );
};

export default Login;