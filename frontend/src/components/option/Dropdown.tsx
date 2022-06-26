import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import DropdownItem from '../../components/option/DropdownItem';
import DropdownItemWrapper from '../../components/option/DropdownItemWrapper';
import DropdownValue from '../../components/option/DropdownValue';
import OptionTitle from '../../components/option/OptionTitle';
// components
import OptionWrapper from '../../components/option/OptionWrapper';
// types
import { BookFontFamily } from '../../types/book';

const Dropdown = ({ title, defaultValue, valueList, onSelect }: Props) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = useState<boolean>(false);
    const value = defaultValue === 'Origin' ? 'Original' : defaultValue;

    /** Toggle dropdown */
    const onToggle = useCallback(() => setVisible(!visible), [visible]);

    /** Close dropdown */
    const onClose = useCallback(
        (e: any) => {
            if (!ref || !ref.current) return;
            if (![...e.path].includes(ref.current)) {
                onToggle();
            }
        },
        [ref, onToggle],
    );

    const Items = valueList.map((font, index) => (
        <ListItem disablePadding key={index}>
            <ListItemButton
                onClick={() => {
                    onSelect(font);
                    onToggle();
                }}
            >
                <Typography variant="body2" gutterBottom>
                    {font}
                </Typography>
            </ListItemButton>
        </ListItem>
    ));

    /** Register dropdown close event */
    useEffect(() => {
        if (visible) {
            document.addEventListener('click', onClose);
        } else {
            document.removeEventListener('click', onClose);
        }
        return () => {
            document.removeEventListener('click', onClose);
        };
    }, [visible, onClose]);

    return (
        <OptionWrapper>
            <OptionTitle>{title}</OptionTitle>

            <DropdownWrapper ref={ref}>
                <DropdownValue value={value} isDropdown={visible} onClick={onToggle} />
                <DropdownItemWrapper show={visible}>{Items}</DropdownItemWrapper>
            </DropdownWrapper>
        </OptionWrapper>
    );
};

const DropdownWrapper = styled.div`
    position: relative;
`;

interface Props {
    title: string;
    defaultValue: BookFontFamily;
    valueList: BookFontFamily[];
    onSelect: (font: BookFontFamily) => void;
}

export default Dropdown;
