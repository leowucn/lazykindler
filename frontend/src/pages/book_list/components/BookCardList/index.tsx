import { deleteBook, downloadBook, updateBookCover, updateBookMeta } from '@/services';
import { humanFileSize, toBase64 } from '@/util';
import { SettingOutlined } from '@ant-design/icons';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import StarIcon from '@mui/icons-material/Star';
import StraightenIcon from '@mui/icons-material/Straighten';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormHelperText,
    Snackbar,
    Typography,
} from '@mui/material';
import Divider from '@mui/material/Divider';
import { Menu } from 'antd';
import { List as AntList, Card } from 'antd';
import { useState } from 'react';
import Dropzone from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';

import { BookMetaDataType } from '../../../data';
import ChangeInfo from '../ChangeInfoDialog';
import Cover from '../Cover';
import ChangeBookColl from './ChangeBookColl';
// import Reader from './Reader';
import ReaderV2 from './ReaderV2';

const { SubMenu } = Menu;

type BookCardListProps = {
    data: any;
    fetchBooks: any;
    height: Number;
};

const initialDialogInfo = {
    title: '',
    allowEmptyStr: false,
    handleOK: null,
    open: false,
};

const initialDialogInfoForReadBook = {
    open: false,
    book_title: '',
    book_uuid: null,
};

export default function BookCardList(props: BookCardListProps) {
    const { data, fetchBooks, height } = props;

    const [dialogInfo, setDialogInfo] = useState<any>(initialDialogInfo);
    const [changeBookCollInfo, setChangeBookCollInfo] = useState<any>({
        item_uuid: '',
        open: false,
    });
    const [openReadBook, setOpenReadBook] = useState<any>(initialDialogInfoForReadBook);
    const [openDeleteBook, setOpenDeleteBook] = useState(false);
    const [deleteBookUUID, setDeleteBookUUID] = useState('');
    const [uuid, setUUID] = useState(uuidv4());

    const [formData, setFormData] = useState<any>({});

    const [uuidForEditCover, setUUIDForEditCover] = useState<any>();
    const [openForEditCover, setOpenForEditCover] = useState(false);

    const [snackBar, setSnackBar] = useState<any>({
        message: '',
        open: false,
    });

    const handleOpenForEditCover = () => {
        setOpenForEditCover(true);
    };

    const handleCloseForEditCover = () => {
        setOpenForEditCover(false);
    };

    const handleCloseDialog = () => {
        setDialogInfo(initialDialogInfo);
    };

    const handleClickOpen = (uuid: string) => {
        setDeleteBookUUID(uuid);
        setOpenDeleteBook(true);
    };

    const handleClose = () => {
        setOpenDeleteBook(false);
    };

    const handleEditCollCover = () => {
        let cover = formData['cover'];

        if (cover == null || cover.trim() == '') {
            return false;
        }

        cover = cover.trim();

        updateBookCover(uuidForEditCover, cover);
        return true;
    };

    return (
        <div style={{ paddingLeft: 5 }}>
            <div style={{ height: '100%', overflow: 'auto' }}>
                <AntList
                    style={{ width: '99%', height: `${height}vh` }}
                    rowKey="id"
                    grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 1,
                        md: 2,
                        lg: 3,
                        xl: 4,
                        xxl: 5,
                    }}
                    pagination={{
                        position: 'bottom',
                        defaultPageSize: 40,
                        hideOnSinglePage: true,
                        style: { paddingBottom: 10 },
                    }}
                    dataSource={data}
                    renderItem={(item: BookMetaDataType) => (
                        <AntList.Item>
                            <Card
                                hoverable
                                cover={<Cover uuid={item.uuid} />}
                                actions={[
                                    // eslint-disable-next-line react/jsx-key
                                    <Menu mode="vertical" selectable={false}>
                                        <SubMenu
                                            key="sub4"
                                            icon={<SettingOutlined />}
                                            title="操作"
                                            style={{ zIndex: 10 }}
                                        >
                                            <Menu.Item
                                                key="1"
                                                onClick={() => {
                                                    setDialogInfo({
                                                        title: '修改评分',
                                                        oldValue: item.stars,
                                                        allowEmptyStr: false,
                                                        handleOK: (newValue: any) => {
                                                            updateBookMeta(
                                                                item.uuid,
                                                                'stars',
                                                                newValue,
                                                            ).then(() => {
                                                                fetchBooks();
                                                            });
                                                        },
                                                        open: true,
                                                    });
                                                }}
                                            >
                                                修改评分
                                            </Menu.Item>
                                            <Menu.Item
                                                key="2"
                                                onClick={() => {
                                                    setDialogInfo({
                                                        title: '修改标签',
                                                        oldValue: item.subjects,
                                                        allowEmptyStr: true,
                                                        handleOK: (newValue: any) => {
                                                            updateBookMeta(
                                                                item.uuid,
                                                                'subjects',
                                                                newValue,
                                                            ).then(() => {
                                                                fetchBooks();
                                                            });
                                                        },
                                                        open: true,
                                                    });
                                                }}
                                            >
                                                修改标签
                                            </Menu.Item>
                                            <Menu.Item
                                                key="3"
                                                onClick={() => {
                                                    setUUID(uuidv4());
                                                    setChangeBookCollInfo({
                                                        item_uuid: item.uuid,
                                                        open: true,
                                                    });
                                                }}
                                            >
                                                修改集合
                                            </Menu.Item>
                                            <Menu.Item
                                                key="4"
                                                onClick={() => {
                                                    setDialogInfo({
                                                        title: '修改作者',
                                                        oldValue: item.author,
                                                        allowEmptyStr: true,
                                                        handleOK: (newValue: any) => {
                                                            updateBookMeta(
                                                                item.uuid,
                                                                'author',
                                                                newValue,
                                                            ).then(() => {
                                                                fetchBooks();
                                                            });
                                                        },
                                                        open: true,
                                                    });
                                                }}
                                            >
                                                修改作者
                                            </Menu.Item>
                                            <Menu.Item
                                                key="5"
                                                onClick={() => {
                                                    setDialogInfo({
                                                        title: '修改出版社',
                                                        oldValue: item.publisher,
                                                        allowEmptyStr: true,
                                                        handleOK: (newValue: any) => {
                                                            updateBookMeta(
                                                                item.uuid,
                                                                'publisher',
                                                                newValue,
                                                            ).then(() => {
                                                                fetchBooks();
                                                            });
                                                        },
                                                        open: true,
                                                    });
                                                }}
                                            >
                                                修改出版社
                                            </Menu.Item>
                                            <Menu.Item
                                                key="6"
                                                onClick={() => {
                                                    handleOpenForEditCover();
                                                    setUUIDForEditCover(item.uuid);
                                                }}
                                            >
                                                修改封面
                                            </Menu.Item>
                                            <Menu.Item
                                                key="7"
                                                onClick={() => {
                                                    downloadBook(item.uuid).then(() => {
                                                        setSnackBar({
                                                            message: '下载成功!',
                                                            open: true,
                                                        });
                                                    });
                                                }}
                                            >
                                                下载书籍
                                            </Menu.Item>
                                            <Menu.Item
                                                key="8"
                                                onClick={() => {
                                                    setOpenReadBook({
                                                        open: true,
                                                        book_uuid: item.uuid,
                                                        book_title: item.name,
                                                    });
                                                }}
                                            >
                                                阅读书籍
                                            </Menu.Item>
                                            <Menu.Item
                                                key="9"
                                                onClick={() => {
                                                    handleClickOpen(item.uuid);
                                                }}
                                            >
                                                <span style={{ color: 'red' }}>删除</span>
                                            </Menu.Item>
                                        </SubMenu>
                                    </Menu>,
                                ]}
                                bodyStyle={{
                                    paddingTop: 8,
                                    paddingLeft: 4,
                                    paddingRight: 4,
                                    paddingBottom: 8,
                                }}
                            >
                                <Card.Meta
                                    title={
                                        <div
                                            style={{
                                                maxHeight: '30vh',
                                                overflow: 'auto',
                                                marginTop: 5,
                                            }}
                                        >
                                            <Typography
                                                variant="h6"
                                                display="block"
                                                style={{
                                                    wordBreak: 'break-all',
                                                    whiteSpace: 'break-spaces',
                                                    fontSize: 13,
                                                }}
                                                gutterBottom
                                            >
                                                {item.name}
                                            </Typography>
                                        </div>
                                    }
                                    description={
                                        <div
                                            style={{
                                                maxHeight: '40vh',
                                                overflow: 'auto',
                                                marginTop: 10,
                                            }}
                                        >
                                            <Divider style={{ marginBottom: 10 }} />
                                            <Box
                                                display="flex"
                                                alignItems="center"
                                                style={{ marginBottom: 10 }}
                                            >
                                                <StarIcon style={{ height: 20 }} />
                                                <Typography
                                                    variant="body2"
                                                    style={{ paddingTop: 1.2, paddingLeft: 15 }}
                                                >
                                                    {item.stars}
                                                </Typography>
                                            </Box>

                                            <Box
                                                display="flex"
                                                alignItems="center"
                                                style={{ marginBottom: 10 }}
                                            >
                                                <StraightenIcon style={{ height: 20 }} />
                                                <Typography
                                                    variant="body2"
                                                    style={{ paddingTop: 1.2, paddingLeft: 15 }}
                                                >
                                                    {humanFileSize(item.size, true)}
                                                </Typography>
                                            </Box>

                                            <Box
                                                display="flex"
                                                alignItems="center"
                                                style={{ marginBottom: 10 }}
                                            >
                                                <ArchiveIcon style={{ height: 16 }} />
                                                <Typography
                                                    variant="body2"
                                                    style={{ paddingTop: 1.2, paddingLeft: 15 }}
                                                >
                                                    {item.coll_names == 'None' ||
                                                    item.coll_names == null
                                                        ? ''
                                                        : item.coll_names}
                                                </Typography>
                                            </Box>

                                            <Box
                                                display="flex"
                                                alignItems="center"
                                                style={{ marginBottom: 10 }}
                                            >
                                                <LocalOfferIcon style={{ height: 20 }} />
                                                <Typography
                                                    variant="body2"
                                                    style={{ paddingTop: 1.2, paddingLeft: 15 }}
                                                >
                                                    {item.subjects == null ? '' : item.subjects}
                                                </Typography>
                                            </Box>

                                            <Box
                                                display="flex"
                                                alignItems="center"
                                                style={{ marginBottom: 10 }}
                                            >
                                                <AccountCircleIcon style={{ height: 20 }} />
                                                <Typography
                                                    variant="body2"
                                                    style={{ paddingTop: 1.2, paddingLeft: 15 }}
                                                >
                                                    {item.author == null ? '' : item.author}
                                                </Typography>
                                            </Box>

                                            <Box
                                                display="flex"
                                                alignItems="center"
                                                style={{ marginBottom: 10 }}
                                            >
                                                <AccountBalanceIcon style={{ height: 20 }} />
                                                <Typography
                                                    variant="body2"
                                                    style={{ paddingTop: 1.2, paddingLeft: 15 }}
                                                >
                                                    {item.publisher == null ? '' : item.publisher}
                                                </Typography>
                                            </Box>
                                        </div>
                                    }
                                />
                            </Card>
                        </AntList.Item>
                    )}
                />
            </div>
            <ChangeInfo
                title={dialogInfo['title']}
                oldValue={dialogInfo['oldValue']}
                allowEmptyStr={dialogInfo['allowEmptyStr']}
                handleClose={handleCloseDialog}
                handleOK={dialogInfo['handleOK']}
                open={dialogInfo['open']}
            />

            <div>
                <Dialog
                    open={openDeleteBook}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">警告</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            确定删除这本书吗？
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>取消</Button>
                        <Button
                            onClick={() => {
                                handleClose();
                                deleteBook(deleteBookUUID).then(() => {
                                    fetchBooks();
                                });
                            }}
                            autoFocus
                        >
                            确定
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>

            <Dialog
                open={openForEditCover}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle id="alert-dialog-title">{'修改集合封面'}</DialogTitle>
                <DialogContent style={{ margin: '0 auto' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            '& .MuiTextField-root': { width: '25ch' },
                        }}
                    >
                        <FormControl variant="standard" sx={{ m: 1, mt: 3, width: '25ch' }}>
                            <Typography
                                style={{ position: 'relative', paddingTop: 5 }}
                                variant="subtitle1"
                                gutterBottom
                                component="div"
                            >
                                封面:
                            </Typography>
                            <div style={{ position: 'absolute', paddingLeft: 45 }}>
                                <Dropzone
                                    onDrop={async (acceptedFiles) => {
                                        let base64Str = await toBase64(acceptedFiles[0]);
                                        setFormData({ ...formData, cover: base64Str });
                                    }}
                                >
                                    {({ getRootProps, getInputProps }) => (
                                        <section>
                                            <div {...getRootProps()}>
                                                <input {...getInputProps()} />
                                                {formData.cover == null ? (
                                                    <Button variant="contained">上传</Button>
                                                ) : (
                                                    <Chip
                                                        label="封面"
                                                        onDelete={() => {
                                                            setFormData({
                                                                ...formData,
                                                                cover: null,
                                                            });
                                                        }}
                                                        deleteIcon={<DeleteIcon />}
                                                        variant="outlined"
                                                    />
                                                )}
                                            </div>
                                        </section>
                                    )}
                                </Dropzone>
                                <FormHelperText id="standard-weight-helper-text">
                                    不能为空
                                </FormHelperText>
                            </div>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseForEditCover}>取消</Button>
                    <Button
                        onClick={() => {
                            let ok = handleEditCollCover();
                            if (ok) {
                                handleCloseForEditCover();
                            }
                        }}
                        autoFocus
                    >
                        确认
                    </Button>
                </DialogActions>
            </Dialog>

            <ChangeBookColl
                key={uuid}
                item_uuid={changeBookCollInfo['item_uuid']}
                open={changeBookCollInfo['open']}
                fetchBooks={fetchBooks}
                handleClose={() => {
                    setChangeBookCollInfo({
                        item_uuid: '',
                        open: false,
                    });
                }}
            />

            <Snackbar
                open={snackBar.open}
                onClose={() => {
                    setSnackBar({
                        message: '',
                        open: false,
                    });
                }}
                autoHideDuration={3000}
                message={snackBar.message}
                key={snackBar.message}
            />

            {/* <Reader
                open={openReadBook.open}
                book_title={openReadBook.book_title}
                book_uuid={openReadBook.book_uuid}
                onClose={() => {
                    setOpenReadBook(initialDialogInfoForReadBook);
                }}
            /> */}

            <ReaderV2
                open={openReadBook.open}
                book_title={openReadBook.book_title}
                book_uuid={openReadBook.book_uuid}
                onClose={() => {
                    setOpenReadBook(initialDialogInfoForReadBook);
                }}
            />
        </div>
    );
}
