import styled from 'styled-components';

import palette from '../../lib/styles/palette';
// lib
import * as styles from '../../lib/styles/styles';

const NavItem = ({ message, onClick }: Props) => {
    return (
        <Content onClick={onClick}>
            <span>{message}</span>
        </Content>
    );
};

const Content = styled.button`
    width: 400px;
    height: 48px;
    box-sizing: border-box;
    padding: 12px 24px;
    display: flex;
    align-items: center;
    cursor: pointer;
    background-color: ${palette.gray0};
    outline: none;

    & > span {
        font-size: 14px;
        transition: 0.2s ${styles.transition};
    }

    &:focus,
    &:hover {
        & > span {
            margin-left: 12px;
            color: ${palette.blue3};
        }
    }

    &:last-child {
        margin-bottom: 32px;
    }
`;

interface Props {
    message: string;
    onClick: () => void;
}

export default NavItem;
