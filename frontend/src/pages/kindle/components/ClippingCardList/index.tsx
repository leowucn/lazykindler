import { ClippingDataType } from '@/pages/data';
import { addHighlight, deleteClipping, deleteHighlight, updateClipping } from '@/services';
import { handleClippingContent } from '@/util';
import { SettingOutlined } from '@ant-design/icons';
import { GridContent } from '@ant-design/pro-layout';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import TablePagination from '@mui/material/TablePagination';
import { Card } from 'antd';
import { Menu } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import Highlighter from 'react-highlight-words';
import { v4 as uuidv4 } from 'uuid';

import ChangeInfo from '../../../book_list/components/ChangeInfoDialog';
import ChangeClippingColl from './ChangeClippingColl';
import ClippingDialog from './ClippingDialog';
import hetiStyles from './heti.min.css';

const { SubMenu } = Menu;

type ClippingCardListProps = {
    data: any;
    fetchClippings: any;
    height: Number;
    columns: number;
};

const initialDialogInfo = {
    title: '',
    allowEmptyStr: false,
    handleOK: null,
    open: false,
};

const initialHighlightInfo = {
    uuid: '',
    selectedText: '',
    open: false,
};

const initialClippingDialogInfo = {
    uuid: '',
    open: false,
    // handleClose
    clippingContent: '',
    // highlights: [],
    book_name: '',
};

const ClippingCardList = (props: ClippingCardListProps) => {
    const { data, fetchClippings, height, columns } = props;

    const [dialogInfo, setDialogInfo] = useState<any>(initialDialogInfo);
    const [changeClippingCollInfo, setChangeClippingCollInfo] = useState<any>({
        item_uuid: '',
        open: false,
    });
    const [openDeleteClipping, setOpenDeleteClipping] = useState(false);
    const [deleteClippingUUID, setDeleteClippingUUID] = useState('');
    const [uuid, setUUID] = useState(uuidv4());
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [highlighInfo, setHighlightInfo] = useState(initialHighlightInfo);
    const [clippingDialogInfo, setClippingDialogInfo] = useState<any>(initialClippingDialogInfo);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleCloseDialog = () => {
        setDialogInfo(initialDialogInfo);
    };

    const handleClickOpen = (uuid: string) => {
        setDeleteClippingUUID(uuid);
        setOpenDeleteClipping(true);
    };

    const handleClose = () => {
        setOpenDeleteClipping(false);
    };

    return (
        <div>
            <GridContent>
                <Box sx={{ overflowY: 'scroll' }} style={{ height: `${height}vh` }}>
                    <ImageList variant="masonry" cols={columns} gap={15}>
                        {data
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((item: ClippingDataType) => (
                                <ImageListItem key={item.uuid}>
                                    <Card
                                        // className={styles.card}
                                        className={`${hetiStyles.entry} ${hetiStyles['heti--ancient']}`}
                                        hoverable
                                        actions={[
                                            <Menu mode="vertical" selectable={false}>
                                                <SubMenu
                                                    key="sub4"
                                                    icon={<SettingOutlined />}
                                                    title="??????"
                                                    style={{ zIndex: 10 }}
                                                >
                                                    <Menu.Item
                                                        key="1"
                                                        onClick={() => {
                                                            setDialogInfo({
                                                                title: '????????????',
                                                                oldValue: item.stars,
                                                                allowEmptyStr: false,
                                                                handleOK: (newValue: any) => {
                                                                    updateClipping(
                                                                        item.uuid,
                                                                        'stars',
                                                                        newValue,
                                                                    ).then(() => {
                                                                        fetchClippings();
                                                                    });
                                                                },
                                                                open: true,
                                                            });
                                                        }}
                                                    >
                                                        ????????????
                                                    </Menu.Item>
                                                    <Menu.Item
                                                        key="2"
                                                        onClick={() => {
                                                            setDialogInfo({
                                                                title: '????????????',
                                                                oldValue: item.subjects,
                                                                allowEmptyStr: true,
                                                                handleOK: (newValue: any) => {
                                                                    updateClipping(
                                                                        item.uuid,
                                                                        'subjects',
                                                                        newValue,
                                                                    ).then(() => {
                                                                        fetchClippings();
                                                                    });
                                                                },
                                                                open: true,
                                                            });
                                                        }}
                                                    >
                                                        ????????????
                                                    </Menu.Item>
                                                    <Menu.Item
                                                        key="3"
                                                        onClick={() => {
                                                            setUUID(uuidv4());
                                                            setChangeClippingCollInfo({
                                                                item_uuid: item.uuid,
                                                                open: true,
                                                            });
                                                        }}
                                                    >
                                                        ????????????
                                                    </Menu.Item>
                                                    <Menu.Item
                                                        key="4"
                                                        onClick={() => {
                                                            setDialogInfo({
                                                                title: '????????????',
                                                                oldValue: item.author,
                                                                allowEmptyStr: true,
                                                                handleOK: (newValue: any) => {
                                                                    updateClipping(
                                                                        item.uuid,
                                                                        'author',
                                                                        newValue,
                                                                    ).then(() => {
                                                                        fetchClippings();
                                                                    });
                                                                },
                                                                open: true,
                                                            });
                                                        }}
                                                    >
                                                        ????????????
                                                    </Menu.Item>
                                                    <Menu.Item
                                                        key="6"
                                                        onClick={() => {
                                                            handleClickOpen(item.uuid);
                                                        }}
                                                    >
                                                        <span style={{ color: 'red' }}>??????</span>
                                                    </Menu.Item>
                                                </SubMenu>
                                            </Menu>,
                                        ]}
                                    >
                                        <Card.Meta
                                            title={<a>{item.book_name}</a>}
                                            description={
                                                <div>
                                                    ??????:{' '}
                                                    <span style={{ paddingLeft: 30 }}>
                                                        {item.author}
                                                    </span>
                                                    <br />
                                                    ????????????:{' '}
                                                    <span style={{ paddingLeft: 1 }}>
                                                        {moment
                                                            .unix(~~item.addDate)
                                                            .format('yyyy-MM-DD HH:mm:ss')}
                                                    </span>
                                                    <br />
                                                    ??????:{' '}
                                                    <span style={{ paddingLeft: 30 }}>
                                                        {item.subjects}
                                                    </span>
                                                </div>
                                            }
                                        />
                                        <article
                                            className={`${hetiStyles.entry} ${hetiStyles['heti--ancient']} ${hetiStyles['heti-hang']} ${hetiStyles['heti-meta heti-small']} `}
                                            style={{
                                                height: '100%',
                                                paddingTop: 10,
                                                fontSize: 15,
                                                whiteSpace: 'pre-wrap',
                                            }}
                                            onClick={() => {
                                                let selectedText = window
                                                    .getSelection()!
                                                    .toString();
                                                if (selectedText.length > 0) {
                                                    return;
                                                }
                                                setClippingDialogInfo({
                                                    uuid: item.uuid,
                                                    open: true,
                                                    handleClose: () => {
                                                        setChangeClippingCollInfo(
                                                            initialClippingDialogInfo,
                                                        );
                                                    },
                                                    clippingContent: item.content,
                                                    highlights: item.highlights,
                                                    book_name: item.book_name,
                                                });
                                            }}
                                            onMouseUp={() => {
                                                let uuid = item.uuid;
                                                let selectedText = window
                                                    .getSelection()!
                                                    .toString();
                                                if (selectedText != '') {
                                                    let info = {
                                                        open: true,
                                                        selectedText: selectedText,
                                                        uuid: uuid,
                                                    };
                                                    setHighlightInfo(info);
                                                }
                                            }}
                                        >
                                            <Highlighter
                                                // style={{ fontSize: 17 }}
                                                highlightStyle={{ color: 'red' }}
                                                searchWords={item.highlights || []}
                                                autoEscape={true}
                                                // textToHighlight={item.content}
                                                textToHighlight={handleClippingContent(
                                                    item.content,
                                                )}
                                            />
                                        </article>
                                    </Card>
                                </ImageListItem>
                            ))}
                    </ImageList>
                </Box>
            </GridContent>
            <TablePagination
                rowsPerPageOptions={[15, 25, 50, 100, 200, 300, 500]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                labelRowsPerPage={<span style={{ paddingTop: 13.5 }}>????????????</span>}
                labelDisplayedRows={(paginationInfo: any) => (
                    <span style={{ paddingTop: 13.5 }}>
                        {paginationInfo.from}-{paginationInfo.to}---??????:
                        {paginationInfo.count}
                    </span>
                )}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

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
                    open={openDeleteClipping}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth
                >
                    <DialogTitle id="alert-dialog-title">??????</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            ????????????????????????
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>??????</Button>
                        <Button
                            onClick={() => {
                                handleClose();
                                deleteClipping(deleteClippingUUID).then(() => {
                                    fetchClippings();
                                });
                            }}
                            autoFocus
                        >
                            ??????
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>

            <div>
                <Dialog
                    open={highlighInfo.open}
                    onClose={() => {
                        setHighlightInfo(initialHighlightInfo);
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth
                >
                    <DialogTitle id="alert-dialog-title">????????????</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            ???????????????????????????! (??????????????????????????????????????????????????????????????????
                            "????????????" ????????????????????????)
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setHighlightInfo(initialHighlightInfo);
                            }}
                        >
                            ??????
                        </Button>
                        <Button
                            onClick={() => {
                                setHighlightInfo(initialHighlightInfo);
                                deleteHighlight(highlighInfo.uuid, highlighInfo.selectedText).then(
                                    () => {
                                        fetchClippings();
                                    },
                                );
                            }}
                        >
                            ????????????
                        </Button>
                        <Button
                            onClick={() => {
                                addHighlight(highlighInfo.uuid, highlighInfo.selectedText).then(
                                    () => {
                                        fetchClippings();
                                    },
                                );
                                setHighlightInfo(initialHighlightInfo);
                            }}
                            autoFocus
                        >
                            ??????
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>

            <ChangeClippingColl
                key={uuid}
                item_uuid={changeClippingCollInfo['item_uuid']}
                open={changeClippingCollInfo['open']}
                fetchClippings={fetchClippings}
                handleClose={() => {
                    setChangeClippingCollInfo({
                        item_uuid: '',
                        open: false,
                    });
                }}
            />

            <ClippingDialog
                uuid={clippingDialogInfo.uuid}
                open={clippingDialogInfo.open}
                handleClose={() => {
                    setClippingDialogInfo({
                        uuid: '',
                        open: false,
                    });
                }}
                clippingContent={clippingDialogInfo.clippingContent}
                highlights={clippingDialogInfo.highlights}
                book_name={clippingDialogInfo.book_name}
                fetchClippings={fetchClippings}
            />
        </div>
    );
};

export default ClippingCardList;
