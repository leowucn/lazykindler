import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';
import { useSelector } from 'react-redux';

import BookInfo from '../../components/nav/BookInfo';
import { MenuControl } from '../../lib/hooks/useMenu';
import { RootState } from '../../slices';
import Book from '../../types/book';
import Toc from '../../types/toc';

const Nav = ({ control, onToggle, onLocation }: Props) => {
    const book = useSelector<RootState, Book>((state) => state.book.book);
    const bookToc = useSelector<RootState, Toc[]>((state) => state.book.toc);

    /** Click nav item */
    const onClickItem = (loc: string) => {
        onLocation(loc);
        onToggle();
    };

    const list = () => (
        <Box>
            <List>
                {bookToc.map((t, index) => (
                    <div key={index}>
                        <ListItem key={index} onClick={() => onClickItem(t.href)} disablePadding>
                            <ListItemButton>
                                <ListItemText primary={t.label} />
                            </ListItemButton>
                        </ListItem>
                        <Divider />
                    </div>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            {control.display && (
                <React.Fragment>
                    <CssBaseline />
                    <Container maxWidth="sm">
                        <Box>
                            <Drawer
                                anchor={'right'}
                                open={control.open}
                                title="目录"
                                onClose={onToggle}
                                // ref={ref}
                                sx={{
                                    display: {
                                        boxSizing: 'border-box',
                                        zIndex: 100000,
                                    },
                                }}
                            >
                                <BookInfo
                                    src={book.coverURL}
                                    title={book.title}
                                    publisher={book.publisher}
                                    author={book.author}
                                />
                                {list()}
                            </Drawer>
                        </Box>
                    </Container>
                </React.Fragment>
            )}
        </>
    );
};

interface Props {
    control: MenuControl;
    onToggle: () => void;
    onLocation: (loc: string) => void;
}

export default React.forwardRef(Nav);
