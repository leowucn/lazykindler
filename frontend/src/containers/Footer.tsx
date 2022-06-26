// components
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const Footer = ({ title, nowPage, totalPage, onPageMove }: Props) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <IconButton
                style={{ paddingBottom: 5 }}
                color="primary"
                aria-label="add to shopping cart"
                onClick={() => onPageMove('PREV')}
            >
                <ChevronLeftIcon />
            </IconButton>

            <Stack direction="row" spacing={50}>
                <Typography variant="body2" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="body2" gutterBottom>
                    {`${nowPage} / ${totalPage}`}
                </Typography>
            </Stack>

            <IconButton
                style={{ paddingBottom: 5 }}
                color="primary"
                aria-label="add to shopping cart"
                onClick={() => onPageMove('NEXT')}
            >
                <ChevronRightIcon />
            </IconButton>
        </div>
    );
};

interface Props {
    title: string;
    nowPage: number;
    totalPage: number;
    onPageMove: (type: 'PREV' | 'NEXT') => void;
}

export default Footer;
