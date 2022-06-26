import BookIcon from '@mui/icons-material/Book';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import MultipleStopIcon from '@mui/icons-material/MultipleStop';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import IconButton from '@mui/material/IconButton';

const ControlIconBtn = ({ type, active, isSelected, onClick }: Props) => {
    let HeaderIcon = null;
    switch (type) {
        case 'ScrollVertical':
            HeaderIcon = SwapVertIcon;
            break;
        case 'ScrollHorizontal':
            HeaderIcon = MultipleStopIcon;
            break;
        case 'BookOpen':
            HeaderIcon = ImportContactsIcon;
            break;
        case 'BookClose':
            HeaderIcon = BookIcon;
            break;
    }

    const onClickBtn = () => {
        if (active) onClick();
    };

    return (
        <IconButton
            color="primary"
            aria-selected={isSelected}
            disabled={isSelected}
            component="span"
            onClick={onClickBtn}
        >
            <HeaderIcon />
        </IconButton>
    );
};

type HeaderIcon = 'ScrollHorizontal' | 'ScrollVertical' | 'BookOpen' | 'BookClose';

interface Props {
    type: HeaderIcon;
    alt: string;
    active: boolean;
    isSelected: boolean;
    onClick: () => void;
}

export default ControlIconBtn;
