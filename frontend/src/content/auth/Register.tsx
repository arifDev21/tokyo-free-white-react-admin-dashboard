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
    PersonAdd as PersonAddIcon,
    Security as SecurityIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { register, isLoading, error, isAuthenticated } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

        if (!formData.username || !formData.password || !formData.confirmPassword) {
            setLocalError('All fields are required');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setLocalError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setLocalError('Password must be at least 6 characters long');
            return;
        }

        try {
            await register(formData.username, formData.password);
            const from = (location.state as any)?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        } catch (err) {
            // Error is handled by the auth context
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
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
                    <Container maxWidth="sm">
                        <Slide direction="up" in timeout={600}>
                            <Card
                                elevation={24}
                                sx={{
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                }}
                            >
                                <CardContent sx={{ p: 4 }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            mb: 4,
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                bgcolor: 'primary.main',
                                                width: 64,
                                                height: 64,
                                                mb: 2,
                                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                            }}
                                        >
                                            <PersonAddIcon sx={{ fontSize: 32 }} />
                                        </Avatar>
                                        <Typography
                                            component="h1"
                                            variant="h4"
                                            sx={{
                                                fontWeight: 700,
                                                color: 'text.primary',
                                                textAlign: 'center',
                                                mb: 1,
                                            }}
                                        >
                                            Create Account
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ textAlign: 'center', mb: 3 }}
                                        >
                                            Sign up to get started with Tokyo Admin Dashboard
                                        </Typography>
                                    </Box>

                                    {(error || localError) && (
                                        <Alert
                                            severity="error"
                                            sx={{
                                                mb: 3,
                                                borderRadius: 2,
                                                '& .MuiAlert-message': {
                                                    width: '100%',
                                                },
                                            }}
                                        >
                                            {error || localError}
                                        </Alert>
                                    )}

                                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    id="username"
                                                    name="username"
                                                    label="Username"
                                                    value={formData.username}
                                                    onChange={handleChange}
                                                    disabled={isLoading}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <PersonIcon color="action" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 2,
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    id="password"
                                                    name="password"
                                                    label="Password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    disabled={isLoading}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <LockIcon color="action" />
                                                            </InputAdornment>
                                                        ),
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    aria-label="toggle password visibility"
                                                                    onClick={togglePasswordVisibility}
                                                                    edge="end"
                                                                >
                                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 2,
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    label="Confirm Password"
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    disabled={isLoading}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <LockIcon color="action" />
                                                            </InputAdornment>
                                                        ),
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    aria-label="toggle confirm password visibility"
                                                                    onClick={toggleConfirmPasswordVisibility}
                                                                    edge="end"
                                                                >
                                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 2,
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>

                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            disabled={isLoading}
                                            sx={{
                                                mt: 4,
                                                mb: 3,
                                                py: 1.5,
                                                borderRadius: 2,
                                                fontSize: '1rem',
                                                fontWeight: 600,
                                                textTransform: 'none',
                                                boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
                                                '&:hover': {
                                                    boxShadow: '0 6px 20px 0 rgba(0, 0, 0, 0.15)',
                                                },
                                            }}
                                        >
                                            {isLoading ? 'Creating Account...' : 'Create Account'}
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
                                                Already have an account?{' '}
                                                <Link
                                                    to="/login"
                                                    style={{
                                                        color: 'inherit',
                                                        textDecoration: 'none',
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    Sign in
                                                </Link>
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Slide>
                    </Container>
                </Fade>
            </Box>
        </Box>
    );
};

export default Register;
