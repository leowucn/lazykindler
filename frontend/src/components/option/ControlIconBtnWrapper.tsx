import styled from 'styled-components';

import OptionTitle from '../../components/option/OptionTitle';
// components
import OptionWrapper from '../../components/option/OptionWrapper';

const ControlIconBtnWrapper = ({ title, children }: Props) => {
    return (
        <OptionWrapper>
            <OptionTitle>{title}</OptionTitle>
            <BtnWrapper>{children}</BtnWrapper>
        </OptionWrapper>
    );
};

const BtnWrapper = styled.div`
    display: flex;
    width: 400px;
    align-items: center;
    justify-content: space-around;
    padding: 8px 0;
`;

interface Props {
    title: string;
    children: any[];
}

export default ControlIconBtnWrapper;
