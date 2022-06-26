import { backend_server_addr } from '@/services/axios';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

import Reader from '../../../../containers/Reader';

type ReaderPropsV2 = {
    open: boolean;
    book_title: string;
    book_uuid: any;
    onClose: () => void;
};

export default function ReaderV2(props: ReaderPropsV2) {
    const { open, book_title, book_uuid, onClose } = props;

    return (
        <div>
            <Dialog open={open} onClose={onClose} maxWidth={'lg'} fullWidth>
                <DialogContent>
                    <div
                        style={{ position: 'relative', height: '85vh', backgroundColor: '#ead8bc' }}
                    >
                        <Reader
                            url={`${backend_server_addr}/api/book/read/uuid/${book_uuid}/file.epub`}
                            book_title={book_title}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
