import { ReactNode, useRef, useState } from 'react';
import { ReactEpubViewer } from 'react-epub-viewer';
import { useDispatch, useSelector } from 'react-redux';
import { Provider } from 'react-redux';

import LoadingView from '../LoadingView';
// components
import useHighlight from '../lib/hooks/useHighlight';
// hooks
import useMenu from '../lib/hooks/useMenu';
// styles
import '../lib/styles/readerStyle.css';
import viewerLayout from '../lib/styles/viewerLayout';
// slices
import store from '../slices';
// types
import { RootState } from '../slices';
import { updateBook, updateCurrentPage, updateToc } from '../slices/book';
import { ViewerRef } from '../types';
import Book, { BookOption, BookStyle } from '../types/book';
import Page from '../types/page';
import Toc from '../types/toc';
import Footer from './Footer';
// containers
import Header from './Header';
import ContextMenu from './commons/ContextMenu';
import Nav from './menu/Nav';
import Learning from './menu/Note';
import Option from './menu/Option';

const Reader = ({ url, book_title, loadingView }: Props) => {
    const dispatch = useDispatch();
    const currentLocation = useSelector<RootState, Page>((state) => state.book.currentLocation);

    const viewerRef = useRef<ViewerRef | any>(null);
    const navRef = useRef<HTMLDivElement | null>(null);
    const optionRef = useRef<HTMLDivElement | null>(null);
    const learningRef = useRef<HTMLDivElement | null>(null);

    const [isContextMenu, setIsContextMenu] = useState<boolean>(false);

    const [bookStyle, setBookStyle] = useState<BookStyle>({
        fontFamily: 'Origin',
        fontSize: 15,
        lineHeight: 1.4,
        marginHorizontal: 15,
        marginVertical: 5,
    });

    const [bookOption, setBookOption] = useState<BookOption>({
        flow: 'paginated',
        resizeOnOrientationChange: true,
        spread: 'auto',
    });

    const [navControl, onNavToggle] = useMenu(navRef, 300);
    const [optionControl, onOptionToggle, emitEvent] = useMenu(optionRef, 300);
    const [learningControl, onLearningToggle] = useMenu(learningRef, 300);
    const {
        selection,
        onSelection,
        onClickHighlight,
        onAddHighlight,
        onRemoveHighlight,
        onUpdateHighlight,
    } = useHighlight(viewerRef, setIsContextMenu, bookStyle, bookOption.flow);

    /**
     * Change Epub book information
     * @param book Epub Book Info
     */
    const onBookInfoChange = (book: Book) => dispatch(updateBook(book));

    /**
     * Change Epub location
     * @param loc epubCFI or href
     */
    const onLocationChange = (loc: string) => {
        if (!viewerRef.current) return;
        viewerRef.current.setLocation(loc);
    };

    /**
     * Move page
     * @param type Direction
     */
    const onPageMove = (type: 'PREV' | 'NEXT') => {
        const node = viewerRef.current;
        if (!node || !node.prevPage || !node.nextPage) return;

        type === 'PREV' && node.prevPage();
        type === 'NEXT' && node.nextPage();
    };

    /**
     * Set toc
     * @param toc Table of Epub contents
     */
    const onTocChange = (toc: Toc[]) => dispatch(updateToc(toc));

    /**
     * Set Epub viewer styles
     * @param bokkStyle_ viewer style
     */
    const onBookStyleChange = (bookStyle_: BookStyle) => setBookStyle(bookStyle_);

    /**
     * Set Epub viewer options
     * @param bookOption_ viewer option
     */
    const onBookOptionChange = (bookOption_: BookOption) => setBookOption(bookOption_);

    /**
     * Change current page
     * @param page Epub page
     */
    const onPageChange = (page: Page) => dispatch(updateCurrentPage(page));

    /**
     * ContextMenu on
     * @param cfiRange CfiRange
     */
    const onContextMenu = (cfiRange: string) => {
        const result = onSelection(cfiRange);
        setIsContextMenu(result);
    };

    /** ContextMenu off */
    const onContextmMenuRemove = () => setIsContextMenu(false);

    return (
        <div>
            <div>
                <Header
                    onNavToggle={onNavToggle}
                    onOptionToggle={onOptionToggle}
                    onLearningToggle={onLearningToggle}
                    book_title={book_title}
                />

                <div style={{ height: '73vh' }}>
                    <ReactEpubViewer
                        url={url}
                        viewerLayout={viewerLayout}
                        viewerStyle={bookStyle}
                        viewerOption={bookOption}
                        onBookInfoChange={onBookInfoChange}
                        onPageChange={onPageChange}
                        onTocChange={onTocChange}
                        onSelection={onContextMenu}
                        loadingView={loadingView || <LoadingView />}
                        ref={viewerRef}
                    />
                </div>

                <Footer
                    title={currentLocation.chapterName}
                    nowPage={currentLocation.currentPage}
                    totalPage={currentLocation.totalPage}
                    onPageMove={onPageMove}
                />
            </div>

            <Nav
                control={navControl}
                onToggle={onNavToggle}
                onLocation={onLocationChange}
                ref={navRef}
            />

            <Option
                control={optionControl}
                bookStyle={bookStyle}
                bookOption={bookOption}
                bookFlow={bookOption.flow}
                onToggle={onOptionToggle}
                emitEvent={emitEvent}
                onBookStyleChange={onBookStyleChange}
                onBookOptionChange={onBookOptionChange}
                ref={optionRef}
            />

            {/* <Learning
                control={learningControl}
                onToggle={onLearningToggle}
                onClickHighlight={onClickHighlight}
                emitEvent={emitEvent}
                viewerRef={viewerRef}
                ref={learningRef}
            /> */}

            <ContextMenu
                active={isContextMenu}
                viewerRef={viewerRef}
                selection={selection}
                onAddHighlight={onAddHighlight}
                onRemoveHighlight={onRemoveHighlight}
                onUpdateHighlight={onUpdateHighlight}
                onContextmMenuRemove={onContextmMenuRemove}
            />
        </div>
    );
};

const ReaderWrapper = ({ url, book_title, loadingView }: Props) => {
    return (
        <Provider store={store}>
            <Reader url={url} book_title={book_title} loadingView={loadingView} />
        </Provider>
    );
};

interface Props {
    url: string;
    book_title: string;
    loadingView?: ReactNode;
}

export default ReaderWrapper;
