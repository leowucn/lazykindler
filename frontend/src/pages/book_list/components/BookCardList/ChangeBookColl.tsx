import { BookMetaDataType } from '@/pages/data';
import { getAllCollections, getBooksMetaByUUIDs, updateBookMeta } from '@/services';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import { useEffect, useState } from 'react';
import { CollectionDataType } from '../../book_collections/data';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

type ChangeBookCollProps = {
    item_uuid: string;
    open: boolean;
    handleClose: any;
    fetchBooks: any;
};

export default function ChangeBookColl(props: ChangeBookCollProps) {
    const { item_uuid, open, handleClose } = props;

    const [allColls, setAllColls] = useState<CollectionDataType[]>([]);
    const [selectedBookUUIDs, setSelectedBookUUIDs] = useState<any>([]);

    const handleChange = (event: any) => {
        const {
            target: { value },
        } = event;
        setSelectedBookUUIDs(value);
    };

    useEffect(() => {
        if (item_uuid == null || item_uuid == '') {
            return;
        }
        getBooksMetaByUUIDs(item_uuid).then((l: BookMetaDataType[]) => {
            const coll_uuids = l[0].coll_uuids;
            if (coll_uuids != null) {
                setSelectedBookUUIDs(coll_uuids.split(';'));
            }
        });
        getAllCollections("book").then((data: CollectionDataType[]) => {
            setAllColls(data);
        });
    }, []);

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                // fullWidth
                maxWidth="md"
            >
                <DialogTitle id="alert-dialog-title">修改集合</DialogTitle>
                <DialogContent>
                    <FormControl sx={{ m: 6, width: 620 }}>
                        <InputLabel id="demo-multiple-checkbox-label">选择</InputLabel>
                        <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={selectedBookUUIDs}
                            onChange={handleChange}
                            input={<OutlinedInput label="Tag" />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                        >
                            {allColls.map((coll_info: CollectionDataType, index: number) => (
                                <MenuItem key={index} value={coll_info.uuid}>
                                    <Checkbox
                                        checked={selectedBookUUIDs.indexOf(coll_info.uuid) > -1}
                                    />
                                    <ListItemText primary={coll_info.name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>取消</Button>
                    <Button
                        onClick={() => {
                            handleClose();
                            updateBookMeta(
                                item_uuid,
                                'coll_uuids',
                                selectedBookUUIDs.join(';'),
                            ).then(() => {
                                // fetchBooks();
                            });
                        }}
                        autoFocus
                    >
                        确定
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
