import styled from 'styled-components';

const Post = styled.div<{ color: string }>`
    position: relative;
    font-size: 14px;
    margin-top: 16px;
    padding: 8px;
    box-sizing: border-box;

    &::before {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: ${({ color }) => color};
        border-radius: 8px;
        opacity: 0.3;
        mix-blend-mode: multiply;
        content: '';
    }
`;

export default Post;
