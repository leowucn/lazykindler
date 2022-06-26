import styled from 'styled-components';

// lib
import palette from '../../../lib/styles/palette';
import * as styles from '../../../lib/styles/styles';

const Wrapper = styled.button`
    padding: 16px 24px;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    background-color: ${palette.gray0};
    transition: 0.1s ${styles.transition};
    cursor: pointer;
    outline: none;
    text-align: left;
    border-bottom: 1px solid ${palette.gray1};

    &:nth-child(2) {
        border-top: 1px solid ${palette.gray1};
    }

    & > div {
        flex-grow: 1;
        color: inherit;
    }

    &:hover > *,
    &:focus > * {
        color: ${palette.blue3};
    }
`;

export default Wrapper;
