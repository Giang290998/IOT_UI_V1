import { memo } from 'react';
import './newsfeed.scss';
import Post from '../post/Post';
import CreatePostForm from '../create-post-form/CreatePostForm';
import { useSelector } from 'react-redux';
import { CircularProgress } from 'react-cssfx-loading/lib';

function Newsfeed() {
    const postArr = useSelector(state => state.post.postArr)
    const themeMode = useSelector(state => state.auth.themeMode) === 'dark' ? ' dark' : ''

    return (
        <div className={"newsfeed-wrapper"+themeMode}>
            <div className="create-post-form-wrapper"> 
                <CreatePostForm />
            </div>
            <div className="posts-wrapper">
            {
                postArr
                ?
                postArr.map((post) => 
                    <Post 
                        key={post.id} post={post}
                    />
                )
                :
                <div className="wrapper-spin">
                    <CircularProgress width={30} height={30} style={{margin: 6}}/>
                </div>
            }
            </div>
        </div>
    );
}

export default memo(Newsfeed);
