import React from 'react';
import { Chip } from '@mui/material';

interface StatusBadgeProps {
    isPosted: boolean;
    size?: 'small' | 'medium';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ isPosted, size = 'small' }) => {
    const getStatusConfig = (isPosted: boolean) => {
        if (isPosted) {
            return {
                label: 'Posted',
                backgroundColor: '#dcfce7', // green-50
                color: '#16a34a', // green-600
                border: '1px solid #4ade80', // green-400
            };
        } else {
            return {
                label: 'Draft',
                backgroundColor: '#fef3c7', // yellow-50
                color: '#d97706', // yellow-600
                border: '1px solid #fbbf24', // yellow-400
            };
        }
    };

    const config = getStatusConfig(isPosted);

    return (
        <Chip
            label={config.label}
            size={size}
            sx={{
                backgroundColor: config.backgroundColor,
                color: config.color,
                border: config.border,
                fontWeight: 500,
                textTransform: 'capitalize',
                fontSize: '0.75rem',
                height: '24px',
                '& .MuiChip-label': {
                    px: 1.5,
                },
                '&:hover': {
                    backgroundColor: config.backgroundColor,
                    opacity: 0.8,
                },
            }}
        />
    );
};

export default StatusBadge;
