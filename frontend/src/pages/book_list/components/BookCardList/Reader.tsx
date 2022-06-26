import { backend_server_addr } from '@/services/axios';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { color } from '@mui/system';
import { useEffect, useRef, useState } from 'react';
import { ReactReader, ReactReaderStyle } from 'react-reader';

type ReaderProps = {
    open: boolean;
    book_title: string;
    book_uuid: any;
    onClose: () => void;
};

const ownStyles = {
    ...ReactReaderStyle,
    readerArea: {
        ...ReactReaderStyle.readerArea,
        background: '#ead8bc',
    },
    arrow: {
        ...ReactReaderStyle.arrow,
        color: '#808080',
    },
};

export default function Reader(props: ReaderProps) {
    const { open, book_title, book_uuid, onClose } = props;

    const [size, setSize] = useState(100);
    const renditionRef = useRef<any>(null);
    const [page, setPage] = useState('');
    const tocRef = useRef<any>(null);
    const [selections, setSelections] = useState([]);
    const [location, setLocation] = useState(0);

    useEffect(() => {
        if (renditionRef.current) {
            // eslint-disable-next-line no-inner-declarations
            function setRenderSelection(cfiRange: any, contents: any) {
                setSelections(
                    selections.concat({
                        text: renditionRef.current.getRange(cfiRange).toString(),
                        cfiRange,
                    }),
                );
                renditionRef.current.annotations.add('highlight', cfiRange, {}, null, 'hl', {
                    fill: 'red',
                    'fill-opacity': '0.5',
                    'mix-blend-mode': 'multiply',
                });
                contents.window.getSelection().removeAllRanges();
            }
            renditionRef.current.on('selected', setRenderSelection);
            return () => {
                renditionRef.current.off('selected', setRenderSelection);
            };
        }
        return;
    }, [setSelections, selections]);
    useEffect(() => {
        if (renditionRef.current) {
            renditionRef.current.themes.fontSize(`${size}%`);
            renditionRef.current.themes.register({
                body: { backgroundColor: 'purple' },
            });
        }
    }, [size]);

    const locationChanged = (epubcifi: any) => {
        setLocation(epubcifi);
        if (renditionRef.current && tocRef.current) {
            if (renditionRef.current.location != null) {
                const { displayed, href } = renditionRef.current.location.start;
                const chapter = tocRef.current.find((item: any) => item.href === href);
                setPage(
                    `Page ${displayed.page} of ${displayed.total} in chapter ${
                        chapter ? chapter.label : 'n/a'
                    }`,
                );
            }
        }
    };

    const changeSize = (newSize: number) => {
        setSize(newSize);
    };

    return (
        <div>
            <Dialog open={open} onClose={onClose} maxWidth={'lg'} fullWidth>
                <DialogContent>
                    <div style={{ height: '85vh' }}>
                        <ReactReader
                            styles={ownStyles}
                            location={location}
                            epubOptions={{
                                allowScriptedContent: true,

                                // flow: 'scrolled',
                                // manager: 'continuous',
                            }}
                            epubInitOptions={{
                                openAs: 'epub',
                            }}
                            title={book_title}
                            showToc
                            locationChanged={locationChanged}
                            url={`${backend_server_addr}/api/book/read/uuid/${book_uuid}/file.epub`}
                            tocChanged={(toc) => (tocRef.current = toc)}
                            getRendition={(rendition) => {
                                renditionRef.current = rendition;

                                // rendition.themes.register('custom', {
                                //     // background 设置阅读区域的背景色
                                //     // color 设置阅读区域的字体色
                                //     body: { background: '#ead8bc' },
                                // });
                                // rendition.themes.select('custom');

                                renditionRef.current.themes.default({
                                    '::selection': {
                                        background: 'orange',
                                    },
                                });
                                setSelections([]);
                            }}
                        />
                    </div>
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '1rem',
                            right: '1rem',
                            left: '1rem',
                            textAlign: 'center',
                            zIndex: 1,
                        }}
                    >
                        {page}
                    </div>
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '1rem',
                            right: '1rem',
                            left: '1rem',
                            textAlign: 'right',
                            zIndex: 1,
                        }}
                    >
                        <button onClick={() => changeSize(Math.max(80, size - 10))}>-</button>
                        <span>Current size: {size}%</span>
                        <button onClick={() => changeSize(Math.min(130, size + 10))}>+</button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
