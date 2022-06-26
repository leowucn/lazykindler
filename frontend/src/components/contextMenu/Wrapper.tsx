import styled, { css } from 'styled-components';

import * as styles from '../../lib/styles/styles';
// lib
import { contextmenuWidth } from '../../lib/styles/viewerLayout';
import zIndex from '../../lib/styles/zIndex';

const Wrapper = styled.div<Props>`
    position: absolute;
    left: ${({ x }) =>
        window.innerWidth < x + contextmenuWidth
            ? `${window.innerWidth - contextmenuWidth}px`
            : `${x}px`};
    top: ${({ y }) => (window.innerHeight < y + 40 ? `${window.innerHeight - 40}px` : `${y}px`)};
    width: ${({ width }) => width + 'px'};
    height: ${({ height }) => height + 'px'};
    box-sizing: border-box;
    padding: ${({ width }) => (width > 0 ? `4px` : ``)};
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.8);
    box-shadow: ${styles.boxShadow.regular};
    z-index: ${zIndex.menu};

    & > div:first-child {
        height: 100%;
        overflow-y: auto;
        ${styles.scrollbar(0)};
    }

    &::before {
        position: absolute;
        left: 80px;
        display: ${({ width }) => (width > 0 ? `black` : `none`)};
        border: 8px solid rgba(0, 0, 0, 0);
        content: '';
        ${({ isReverse }) =>
            isReverse
                ? css`
                      bottom: -16px;
                  `
                : css`
                      top: -16px;
                  `}
        transform: translateX(-8px);
        ${({ isReverse }) =>
            isReverse
                ? css`
                      border-top: 8px solid rgba(0, 0, 0, 0.8);
                  `
                : css`
                      border-bottom: 8px solid rgba(0, 0, 0, 0.8);
                  `}
        z-index: 1;
    }
`;

interface Props {
    x: number;
    y: number;
    width: number;
    height: number;
    isReverse: boolean;
}

export default Wrapper;
