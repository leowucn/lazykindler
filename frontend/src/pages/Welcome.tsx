import {
    deleteAllBooks,
    deleteAllClipping,
    deleteAllTmpBooks,
    downloadAllBooks,
    uploadBooks,
} from '@/services';
import { PageContainer } from '@ant-design/pro-layout';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Menu,
    MenuItem,
    Popover,
    Snackbar,
    Typography,
} from '@mui/material';
import { Alert, Card } from 'antd';
import React, { useState } from 'react';

const Welcome: React.FC = () => {
    const [deleteType, setDeleteType] = useState<number>(0);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [snackBar, setSnackBar] = useState<any>({
        message: '',
        open: false,
    });

    const [anchorEl, setAnchorEl] = React.useState(null);

    const [anchorElForPopover, setAnchorElForPopover] = React.useState<HTMLElement | null>(null);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElForPopover(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorElForPopover(null);
    };
    const openForPopover = Boolean(anchorElForPopover);

    const open = Boolean(anchorEl);
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialog(false);
    };

    const onUploadFiles = () => {
        uploadBooks().then((count: number) => {
            let message = `成功上传 ${count}本 书籍!`;
            if (Number(count) === 0) {
                message = '未发现需要上传的新书籍!';
            }

            setSnackBar({
                message,
                open: true,
            });
        });
    };

    const onDeleteAllTmpBooks = () => {
        deleteAllTmpBooks().then(() => {
            setSnackBar({
                message: '成功删除所有临时书籍!',
                open: true,
            });
        });
    };

    const onDownloadAllBooks = () => {
        downloadAllBooks().then(() => {
            setSnackBar({
                message: '已成功下载所有书籍，请到下载目录查看新建目录 lazykindler',
                open: true,
            });
        });
    };

    return (
        <PageContainer>
            <Card>
                <Alert
                    message={
                        '正在积极添加新功能，欢迎提issue，github地址: https://github.com/leowucn/lazykindler。'
                    }
                    type="success"
                    showIcon
                    banner
                    style={{
                        margin: -12,
                        marginBottom: 24,
                    }}
                />

                <Button
                    variant="outlined"
                    aria-owns={openForPopover ? 'mouse-over-popover' : undefined}
                    aria-haspopup="true"
                    onMouseEnter={handlePopoverOpen}
                    onMouseLeave={handlePopoverClose}
                    onClick={onUploadFiles}
                >
                    上传文件
                </Button>

                <Button variant="outlined" style={{ marginLeft: 20 }} onClick={onDeleteAllTmpBooks}>
                    删除所有临时书籍
                </Button>

                <Button variant="outlined" style={{ marginLeft: 20 }} onClick={onDownloadAllBooks}>
                    下载所有书籍
                </Button>

                <Popover
                    id="mouse-over-popover"
                    sx={{
                        pointerEvents: 'none',
                    }}
                    open={openForPopover}
                    anchorEl={anchorElForPopover}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    onClose={handlePopoverClose}
                    disableRestoreFocus
                >
                    <Typography sx={{ p: 1 }}>
                        平台将递归扫描 ~/Download、~/下载、~/Desktop、~/桌面
                        等目录下受支持的电子书文件。相同文件不会重复上传
                    </Typography>
                </Popover>

                <div style={{ float: 'right' }}>
                    <Button
                        id="basic-button"
                        variant="outlined"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        其他操作
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem
                            onClick={() => {
                                setDeleteDialog(true);
                                setDeleteType(1);
                            }}
                        >
                            删除书籍
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setDeleteDialog(true);
                                setDeleteType(2);
                            }}
                        >
                            删除摘抄
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setDeleteDialog(true);
                                setDeleteType(3);
                            }}
                        >
                            删除所有数据
                        </MenuItem>
                    </Menu>
                </div>

                <div>
                    <Dialog
                        open={deleteDialog}
                        onClose={handleCloseDeleteDialog}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        fullWidth
                    >
                        <DialogTitle id="alert-dialog-title">警告</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                确定删除吗
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={() => {
                                    handleCloseDeleteDialog();
                                    handleClose();
                                }}
                                autoFocus
                            >
                                取消
                            </Button>
                            <Button
                                onClick={() => {
                                    handleCloseDeleteDialog();
                                    handleClose();

                                    if (deleteType === 1) {
                                        deleteAllBooks();
                                    } else if (deleteType === 2) {
                                        deleteAllClipping();
                                    } else {
                                        deleteAllBooks();
                                        deleteAllClipping();
                                    }
                                }}
                            >
                                确定
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </Card>
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
        </PageContainer>
    );
};

export default Welcome;
