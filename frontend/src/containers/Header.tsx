// components
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Layout, { AutoLayout } from '../components/header/Layout';
import Logo from '../components/header/Logo';
import Wrapper from '../components/header/Wrapper';

const Header = ({ onNavToggle, onOptionToggle, onLearningToggle, book_title }: Props) => {
    return (
        <Wrapper>
            <Layout>
                <AutoLayout>
                    <Logo />
                    <Typography variant="h6" gutterBottom>
                        {book_title}
                    </Typography>
                    <Stack spacing={2} direction="row">
                        <Button variant="text" onClick={onNavToggle}>
                            目录
                        </Button>
                        <Button variant="text" onClick={onLearningToggle}>
                            高亮
                        </Button>
                        <Button variant="text" onClick={onOptionToggle}>
                            设置
                        </Button>
                    </Stack>
                </AutoLayout>
            </Layout>
        </Wrapper>
    );
};

interface Props {
    onNavToggle: () => void;
    onOptionToggle: () => void;
    onLearningToggle: () => void;
    book_title: string;
}

export default Header;
