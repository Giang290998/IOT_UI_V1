import { memo, } from 'react';
import './home.scss';
import Leftbar from '../../components/leftbar/Leftbar.jsx';
import Rightbar from '../../components/rightbar/Rightbar';
import Newsfeed from '../../components/newsfeed/Newsfeed';
import ShortVideo from '../../components/short-video/ShortVideo';
import { useSelector } from 'react-redux/es/hooks/useSelector';

function Home() {
    const themeMode = useSelector(state => state.auth.themeMode) === 'dark' ? ' dark' : '';
    const content = useSelector(state => state.auth.content)
    document.title = 'GSocial - Home' 
    return (
        <div className={"home-wrapper"+themeMode}>
            <div className="grid home-page">
                <div className="row content">
                    <div className="col l-3 m-0 s-0 left-bar">
                    </div>
                    <Leftbar />
                    <div className="col l-6 m-8 s-12 content">
                        {
                            content === 'post' && <Newsfeed />
                        }
                        {
                            content === 'short-video' && <ShortVideo />
                        }
                    </div>
                    <div className="col l-3 m-4 s-0 right-bar">
                    </div>
                    <Rightbar />
                </div>
            </div>
        </div>
    );
}

export default memo(Home);