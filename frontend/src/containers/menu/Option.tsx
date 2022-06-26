import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';
import React from 'react';
import { useEffect, useState } from 'react';

import ControlIconBtn from '../../components/option/ControlIconBtn';
import ControlIconBtnWrapper from '../../components/option/ControlIconBtnWrapper';
import OptionDropdown from '../../components/option/Dropdown';
import OptionSlider from '../../components/option/Slider';
// components
import { MenuControl } from '../../lib/hooks/useMenu';
// types
import { BookFlow, BookFontFamily, BookStyle } from '../../types/book';
import { BookOption } from '../../types/book';

const Option = (
    {
        control,
        bookStyle,
        bookOption,
        bookFlow,
        onToggle,
        emitEvent,
        onBookStyleChange,
        onBookOptionChange,
    }: Props
) => {
    const [fontFamily, setFontFamily] = useState<BookFontFamily>(bookStyle.fontFamily);
    const [fontSize, setFontSize] = useState<number>(bookStyle.fontSize);
    const [lineHeight, setLineHeight] = useState<number>(bookStyle.lineHeight);
    const [marginHorizontal, setMarginHorizontal] = useState<number>(bookStyle.marginHorizontal);
    const [marginVertical, setMarginVertical] = useState<number>(bookStyle.marginVertical);
    const [isScrollHorizontal, setIsScrollHorizontal] = useState<boolean>(true);
    const [viewType, setViewType] = useState<ViewType>({
        active: true,
        spread: true,
    });

    /** Change font family */
    const onSelectFontFamily = (font: BookFontFamily) => setFontFamily(font);

    /** Change font style and layout */
    const onChangeSlider = (type: SliderType, e: any) => {
        if (!e || !e.target) return;
        switch (type) {
            case 'FontSize':
                setFontSize(e.target.value);
                break;
            case 'LineHeight':
                setLineHeight(e.target.value);
                break;
            case 'MarginHorizontal':
                setMarginHorizontal(e.target.value);
                break;
            case 'MarginVertical':
                setMarginVertical(e.target.value);
                break;
            default:
                break;
        }
    };

    /**
     * Select view direction
     * @param type Direction
     */
    const onClickDirection = (type: 'Horizontal' | 'Vertical') => {
        if (type === 'Horizontal') {
            setIsScrollHorizontal(true);
            setViewType({ ...viewType, active: true });
            onBookOptionChange({
                ...bookOption,
                flow: 'paginated',
            });
        } else {
            setIsScrollHorizontal(false);
            setViewType({ ...viewType, active: false });
            onBookOptionChange({
                ...bookOption,
                flow: 'scrolled-doc',
            });
        }
    };

    /**
     * Select isSpread
     * @param isSpread Whether spread view
     */
    const onClickViewType = (isSpread: boolean) => {
        if (isSpread) {
            setViewType({ ...viewType, spread: true });
            onBookOptionChange({
                ...bookOption,
                spread: 'auto',
            });
        } else {
            setViewType({ ...viewType, spread: false });
            onBookOptionChange({
                ...bookOption,
                spread: 'none',
            });
        }
    };

    /* Save userdata */
    // TODO Fix the infinite re-rendering issue, when inlcude `onBookStyleChange` to dependencies array.
    /* eslint-disable */
    useEffect(() => {
        const timer = window.setTimeout(() => {
            onBookStyleChange({
                fontFamily,
                fontSize,
                lineHeight,
                marginHorizontal,
                marginVertical,
            });
        }, 250);

        return () => window.clearTimeout(timer);
    }, [fontFamily, fontSize, lineHeight, marginHorizontal, marginVertical]);
    /* eslint-enable */

    /** Re-register close event, when after set */
    useEffect(() => emitEvent(), [bookStyle, emitEvent]);

    return (
        <>
            {control.display && (
                <React.Fragment>
                    {/* <CssBaseline /> */}
                    <Container>
                        <Box>
                            <Drawer
                                anchor={'right'}
                                open={control.open}
                                title="设置"
                                onClose={onToggle}
                                // ref={ref}
                                sx={{
                                    display: {
                                        boxSizing: 'border-box',
                                        zIndex: 100000,
                                    },
                                }}
                            >
                                <ControlIconBtnWrapper title="水平视图">
                                    <ControlIconBtn
                                        type="ScrollHorizontal"
                                        alt="Horizontal View"
                                        active={true}
                                        isSelected={isScrollHorizontal}
                                        onClick={() => onClickDirection('Horizontal')}
                                    />
                                    <ControlIconBtn
                                        type="ScrollVertical"
                                        alt="Vertical View"
                                        active={true}
                                        isSelected={!isScrollHorizontal}
                                        onClick={() => onClickDirection('Vertical')}
                                    />
                                </ControlIconBtnWrapper>
                                <ControlIconBtnWrapper title="垂直视图">
                                    <ControlIconBtn
                                        type="BookOpen"
                                        alt="Two Page View"
                                        active={viewType.active}
                                        isSelected={viewType.spread}
                                        onClick={() => onClickViewType(true)}
                                    />
                                    <ControlIconBtn
                                        type="BookClose"
                                        alt="One Page View"
                                        active={viewType.active}
                                        isSelected={!viewType.spread}
                                        onClick={() => onClickViewType(false)}
                                    />
                                </ControlIconBtnWrapper>
                                <OptionDropdown
                                    title="字体"
                                    defaultValue={fontFamily}
                                    valueList={['Origin', 'Roboto']}
                                    onSelect={onSelectFontFamily}
                                />
                                <OptionSlider
                                    active={true}
                                    title="字体大小"
                                    minValue={8}
                                    maxValue={36}
                                    defaultValue={fontSize}
                                    step={1}
                                    onChange={(e) => onChangeSlider('FontSize', e)}
                                />
                                <OptionSlider
                                    active={true}
                                    title="行高"
                                    minValue={1}
                                    maxValue={3}
                                    defaultValue={lineHeight}
                                    step={0.1}
                                    onChange={(e) => onChangeSlider('LineHeight', e)}
                                />
                                <OptionSlider
                                    active={true}
                                    title="水平边距"
                                    minValue={0}
                                    maxValue={100}
                                    defaultValue={marginHorizontal}
                                    step={1}
                                    onChange={(e) => onChangeSlider('MarginHorizontal', e)}
                                />
                                <OptionSlider
                                    active={bookFlow === 'paginated'}
                                    title="垂直边距"
                                    minValue={0}
                                    maxValue={100}
                                    defaultValue={marginVertical}
                                    step={1}
                                    onChange={(e) => onChangeSlider('MarginVertical', e)}
                                />
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
    bookStyle: BookStyle;
    bookOption: BookOption;
    bookFlow: BookFlow;
    onToggle: () => void;
    emitEvent: () => void;
    onBookStyleChange: (bookStyle: BookStyle) => void;
    onBookOptionChange: (bookOption: BookOption) => void;
}

type SliderType = 'FontSize' | 'LineHeight' | 'MarginHorizontal' | 'MarginVertical';

type ViewType = {
    active: boolean;
    spread: boolean;
};

export default React.forwardRef(Option);
