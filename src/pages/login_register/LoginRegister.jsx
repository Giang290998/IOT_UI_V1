import { useState, useEffect, memo, useCallback } from 'react';
import './login_register.scss';
import loginWaitingIcon from '../../assets/login.svg';
import logo from '../../assets/logo.png';
import userAPI from '../../services/userAPI';
import facebookIcon from '../../assets/facebookIcon.png';
import googleIcon from '../../assets/googleIcon.png';
import TextInput from '../../components/text-input/TextInput';
import Footer from '../../components/footer-information/Footer';
import { CircularProgress } from 'react-cssfx-loading/lib';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faXmark, faLocationDot, faLemon, faEnvelope, faWifi, faCamera,
    faVideo, faPhotoFilm, faEarthAmericas, faHandshakeAngle, faLink, faFaceSmileWink,
    faLeaf
} from '@fortawesome/free-solid-svg-icons';
import { getInfoUser, saveInfoUser } from '../../redux/apiRequest';
import { useDispatch, useSelector } from 'react-redux';
import { useGoogleLogin } from '@react-oauth/google';
import { loginStart, saveUser, setFriendInfo, modifiedThemeMode, setValid } from '../../redux/authSlice';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import axios from 'axios';
import { getAllMessage, setNoChatRoom } from '../../redux/chatSlice';
import { getNotification } from '../../redux/notificationSlice';
import { getAllPost } from '../../redux/postSlice';
import { getWeatherInfo } from '../../redux/apiRequest';
import HttpStatusCustom from '../../utils/httpStatus';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import bcrypt from 'bcryptjs';
import store from '../../redux/store';

function LoginRegister() {
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);
    const dispatch = useDispatch();
    const themeMode = localStorage.getItem("themeMode") === 'dark' ? ' dark' : '';
    const isActiveUser = useSelector(state => state.auth.login?.user?.isActive)

    const [errorStatusIdLogin, setErrorStatusIdLogin] = useState(null)
    const [errorStatusPassLogin, setErrorStatusPassLogin] = useState(null)
    const [errorStatusId, setErrorStatusId] = useState(null)
    const [warningStatusPass, setWarningStatusPass] = useState(null)
    const [errorStatusPassConfirm, setErrorStatusPassConfirm] = useState(null)

    const [idLogin, setIdLogin] = useState('');
    const [passwordLogin, setPasswordLogin] = useState('');
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dayOfBirth, setDayOfBirth] = useState('1');
    const [monthOfBirth, setMonthOfBirth] = useState('1');
    const [yearOfBirth, setYearOfBirth] = useState(new Date().getFullYear());
    const [avatar, setAvatar] = useState(null)
    const [thirdPartyInfor, setThirdPartyInfor] = useState(false);
    const [waitingResponseLogin, setWaitingResponseLogin] = useState(false);
    const [waitingResponseRegister, setWaitingResponseRegister] = useState(false)
    const [waitingResponseActiveOTP, setWaitingResponseActiveOTP] = useState(false)
    const [loginSuccess, setLoginSuccess] = useState(false)
    const [otpForm, setOtpForm] = useState(false)
    const [otp, setOtp] = useState(null)
    const [errorOtp, setErrorOtp] = useState()
    const persistent_token = Cookies.get("persistent_token");
    let dayInMonth = []
    let monthInYear = []
    let yearInDecade = []
    getTimeValue(dayInMonth, monthInYear, yearInDecade)
    document.title = 'GSocial - Login'

    if (persistent_token) {
        loginWithRememberToken(persistent_token)
    }

    useEffect(() => {
        sideEffectAnimation()
        function sideEffectAnimation() {
            const icons = $$('div[id="icon-login"]')
            icons.forEach((icon, index) => {
                setTimeout(() => {
                    icon.classList.remove('hidden')
                }, (index + 1) * 80)
            })
        }
    }, [$$])

    async function loginWithRememberToken(persistent_token) {
        let res = await userAPI.loginUserWithRememberToken(persistent_token)
        const { new_access_token, new_persistent_token, new_refresh_token, user } = res.data
        Cookies.set("persistent_token", new_persistent_token, { expires: jwtDecode(persistent_token).exp });
        Cookies.set("access_token", new_access_token);
        Cookies.set("refresh_token", new_refresh_token);
        saveInfoUser(user);
        const themeMode = localStorage.getItem('themeMode') ? localStorage.getItem('themeMode') : 'light'
        dispatch(modifiedThemeMode(themeMode))
        // dispatch(saveUser(info))
        // dispatch(getNotification(info.userInformation.userId))
        // dispatch(getAllPost(info.userInformation.userId))
        // if (info.userInformation.chatRoom) {
        //     dispatch(getAllMessage(info.userInformation.chatRoom))
        // } else {
        //     dispatch(setNoChatRoom())
        // }
        // if (info.friendInfo) {
        //     dispatch(setFriendInfo(info.friendInfo))
        // }
        // getWeatherInfo()
    }
    function getTimeValue(dayInMonth, monthInYear, yearInDecade) {
        let currentYear = new Date().getFullYear();
        for (let i = 1; i < 32; i++) {
            dayInMonth.push({
                day: i
            });
        }
        for (let i = 1; i < 13; i++) {
            monthInYear.push({
                month: i
            });
        }
        for (let i = currentYear; i >= 1900; i--) {
            yearInDecade.push({
                year: i
            });
        }
    }

    function handleShowRegisterForm() {
        $('div[class="modal hidden"]').classList.remove("hidden")
    }
    function handleHiddenRegisterForm() {
        $('div[class="modal"]').classList.add("hidden")
    }

    const handleChangeIdLogin = useCallback((event) => {
        setIdLogin(event.target.value)
    }, [])
    const handleKeyDownIdLogin = useCallback((event) => {
        if (event.key === "Enter") {
            document.querySelector('button[id="btn-login"]').click()
        }
    }, [])
    const handleChangePassLogin = useCallback((event) => {
        setPasswordLogin(event.target.value)
    }, [])
    const handleKeyDownPassLogin = useCallback((event) => {
        if (event.key === "Enter") {
            document.querySelector('button[id="btn-login"]').click()
        }
    }, [])

    const handleChangeId = useCallback((event) => {
        setId(event.target.value)
        setErrorStatusId(null)
    }, [])
    const handleChangeActiveOTP = useCallback((event) => {
        setOtp(event.target.value)
    }, [])
    const handleChangePass = useCallback((event) => {
        const password = event.target.value
        setPassword(password)
        if (password.length < 8) {
            setWarningStatusPass('Mật khẩu nên có từ 8-15 ký tự, bao gồm: số, chữ in hoa, chữ thường')
        } else {
            setWarningStatusPass(null)
        }
    }, [])
    const handleChangePassConfirm = useCallback((event) => {
        const passwordConfirm = event.target.value
        setPasswordConfirm(passwordConfirm)
    }, [])
    const handleBlurPassConfirm = useCallback(() => {
        if (passwordConfirm !== password) {
            setErrorStatusPassConfirm('Không trùng khớp với mật khẩu!')
        } else {
            setErrorStatusPassConfirm(null)
        }
    }, [passwordConfirm, password])
    const handleChangeFirstName = useCallback((event) => {
        setFirstName(event.target.value)
    }, [])
    const handleChangeLastName = useCallback((event) => {
        setLastName(event.target.value)
    }, [])

    function animationEnd() {
        const loginForm = document.querySelector('div[id="login-form"]')
        const logo = document.querySelector('div[id="logo-social"]')
        loginForm.setAttribute('style', 'animation: rightOutFast ease 0.6s forwards;')
        logo.setAttribute('style', 'animation: leftOutFast ease 0.6s forwards;')
    }
    async function handleLogin(id, password) {
        dispatch(loginStart())
        if (waitingResponseLogin) {
            return null
        }

        setErrorStatusIdLogin(null)
        setErrorStatusPassLogin(null)
        let userLogin = {
            phone: id,
            password: password,
        }
        if (idLogin === '') {
            setErrorStatusIdLogin("Tài khoản không được bỏ trống!")
        }
        if (passwordLogin === '') {
            setErrorStatusPassLogin("Mật khẩu không được bỏ trống!")
        }

        setWaitingResponseLogin(true)

        try {
            let res = await userAPI.loginUser(userLogin)
            console.log(res)
            setWaitingResponseLogin(false)
            if (HttpStatusCustom.isSuccess(res.status)) {
                animationEnd()
                if (!otpForm) {
                    setLoginSuccess(true)
                }
                const { access_token, persistent_token, refresh_token, user } = res.data
                console.log({ access_token, persistent_token, refresh_token, user })
                Cookies.set("persistent_token", persistent_token, { expires: jwtDecode(persistent_token).exp });
                Cookies.set("access_token", access_token);
                Cookies.set("refresh_token", refresh_token);
                saveInfoUser(user);
            }
        } catch (error) {
            if (HttpStatusCustom.isBadRequest(error.response.status)) {
                setErrorStatusPassLogin("Số điện thoại/mật khẩu không chính xác!")
                setErrorStatusIdLogin("Số điện thoại/mật khẩu không chính xác!")
            }
            if (HttpStatusCustom.isServerError(error.response.status)) {

            }
            setWaitingResponseLogin(false)
        }
    }

    async function handleRegister() {
        const dayOfBirthFormat = ("0" + dayOfBirth).slice(-2)
        const monthOfBirthFormat = ("0" + monthOfBirth).slice(-2)
        const dateOfBirth = `${yearOfBirth}-${monthOfBirthFormat}-${dayOfBirthFormat}`
        let sex = null;
        let hashPass = bcrypt.hashSync(password, 8);

        if ($('input[value="1"]:checked')) {
            sex = "1"
        }
        if ($('input[value="0"]:checked')) {
            sex = "0"
        }

        const newUser = { phone: id, password: hashPass, name: `${firstName.trim() + " " + lastName.trim()}`, sex, dateOfBirth }

        if (avatar || (password === passwordConfirm && id && password && firstName && lastName && sex && dateOfBirth)) {
            setWaitingResponseRegister(true)
            try {
                let res = await userAPI.createNewUser(newUser)

                if (HttpStatusCustom.isSuccess(res.status)) {
                    setOtpForm(true);
                    await handleLogin(id, password);
                    setWaitingResponseRegister(false)
                    userAPI.getOTP();
                }
            } catch (error) {
                if (HttpStatusCustom.isBadRequest(error.response?.status)) {
                    setErrorStatusId("Số điện thoại đã tồn tại!");
                }
                if (HttpStatusCustom.isServerError(error.response?.status)) {

                }
                setWaitingResponseRegister(false)
            }
        }
    }

    const handleLoginWithGoogle = useGoogleLogin({
        onSuccess: async (response) => {
            const resGoogle = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${response.access_token}`)
            const res = await userAPI.loginWithThirdPartyInformation(resGoogle.data.email)
            switch (res.data.errCode) {
                case 0:
                    animationEnd()
                    setLoginSuccess(true)
                    saveInfoUser(res.data)
                    break;
                case 1:
                    setAvatar(resGoogle.data.picture)
                    setId(resGoogle.data.email)
                    setPassword(null)
                    setPasswordConfirm(null)
                    setThirdPartyInfor(true)
                    handleShowRegisterForm()
                    break;
                default:
                    break;
            }
        }
    })
    async function responseFacebook(response) {
        const res = await userAPI.loginWithThirdPartyInformation(response.email)
        switch (res.data.errCode) {
            case 0:
                animationEnd()
                setLoginSuccess(true)
                saveInfoUser(res.data)
                break;
            case 1:
                setAvatar(response.picture.data.url)
                setId(response.email)
                setPassword(null)
                setPasswordConfirm(null)
                setThirdPartyInfor(true)
                handleShowRegisterForm()
                break;
            default:
                break;
        }
    }

    async function handleSendActiveOTP() {
        setWaitingResponseActiveOTP(true)
        try {
            let res = await userAPI.verifyOTP(otp);
            if (HttpStatusCustom.isSuccess(res.status)) {
                store.dispatch(setValid())
            }
        } catch (error) {
            if (HttpStatusCustom.isBadRequest(error.response.status)) {
                setErrorOtp("OTP không đúng, vui lòng nhập lại!")
            }
            if (HttpStatusCustom.isServerError(error.response.status)) {

            }
            console.log(error)
        }
    }

    if ((persistent_token && isActiveUser) || (persistent_token && !otpForm)) {
        return (
            <div className={"login-with-token" + themeMode}>
                <img src={logo} alt="" className="logo" />
                <h3 className="login-desc">Login</h3>
            </div>
        )
    }

    return (
        <>
            <div className={"grid login-register disable-select" + themeMode}>
                <div className="row no-gutters login-register">
                    <div id="logo-social" className="col l-5 left-wrapper">
                        <div className="left-wrapper-top">
                            <div id="icon-login" className="wrap-icon-login hidden">
                                <FontAwesomeIcon icon={faLocationDot} className="login-icon" />
                            </div>
                            <div id="icon-login" className="wrap-icon-login hidden">
                                <FontAwesomeIcon icon={faLeaf} className="login-icon" />
                            </div>
                            <div id="icon-login" className="wrap-icon-login hidden">
                                <FontAwesomeIcon icon={faEnvelope} className="login-icon" />
                            </div>
                            <div id="icon-login" className="wrap-icon-login hidden">
                                <FontAwesomeIcon icon={faWifi} className="login-icon" />
                            </div>
                            <div id="icon-login" className="wrap-icon-login hidden">
                                <FontAwesomeIcon icon={faLemon} className="login-icon" />
                            </div>
                            <div id="icon-login" className="wrap-icon-login hidden">
                                <FontAwesomeIcon icon={faCamera} className="login-icon" />
                            </div>
                            <div id="icon-login" className="wrap-icon-login hidden">
                                <FontAwesomeIcon icon={faVideo} className="login-icon" />
                            </div>
                            <div id="icon-login" className="wrap-icon-login hidden">
                                <FontAwesomeIcon icon={faEarthAmericas} className="login-icon" />
                            </div>
                            <div id="icon-login" className="wrap-icon-login hidden">
                                <FontAwesomeIcon icon={faPhotoFilm} className="login-icon" />
                            </div>
                            <div id="icon-login" className="wrap-icon-login hidden">
                                <FontAwesomeIcon icon={faHandshakeAngle} className="login-icon" />
                            </div>
                            <div id="icon-login" className="wrap-icon-login hidden">
                                <FontAwesomeIcon icon={faLink} className="login-icon" />
                            </div>
                            <div id="icon-login" className="wrap-icon-login hidden">
                                <FontAwesomeIcon icon={faFaceSmileWink} className="login-icon" />
                            </div>
                            <div alt="logo" className="logo-img" style={{ backgroundImage: `url(${logo})`, borderRadius: '50%' }} />
                            <span className="logo-name">for Agri</span>
                        </div>
                        <div className="left-wrapper-bottom">
                            <h2 className="slogan">Gsocial giúp bạn kết nối và chia sẻ đến tất cả mọi người.</h2>
                        </div>
                    </div>
                    {
                        loginSuccess
                        &&
                        <div className="login-waiting-icon">
                            <img src={loginWaitingIcon} alt="login-icon" className="login-icon" />
                            <div className="login-desc">
                                <h3>Login</h3>
                            </div>
                        </div>
                    }
                    <div className="col l-4 right-wrapper">
                        <div id="login-form" className="login-form-wrapper">
                            <TextInput
                                errorStatus={errorStatusIdLogin}
                                type='text' placeholder='Số điện thoại' inputId="id-login"
                                onChange={handleChangeIdLogin}
                                onKeyDown={handleKeyDownIdLogin}
                            />
                            <TextInput
                                errorStatus={errorStatusPassLogin}
                                type='password' placeholder='Mật khẩu' inputId="password-login"
                                onChange={handleChangePassLogin}
                                onKeyDown={handleKeyDownPassLogin}
                            />
                            <button id="btn-login" onClick={() => handleLogin(idLogin, passwordLogin)} type="submit" className="btn btn-login">
                                {
                                    waitingResponseLogin
                                        ?
                                        <div className="wrap-spin-login">
                                            <CircularProgress color='#fff' />
                                        </div>
                                        :
                                        <span>Đăng nhập</span>
                                }
                            </button>
                            <a href="/" className="forgot-password">Quên mật khẩu?</a>
                            <button
                                className="btn btn-create-new-account" id="register-button"
                                onClick={handleShowRegisterForm}
                            >Tạo tài khoản mới</button>
                            <div className="wrapper-btn-another">
                                <FacebookLogin
                                    appId={process.env.REACT_APP_LOGIN_FACEBOOK_ID}
                                    callback={responseFacebook}
                                    fields="name,email,picture"
                                    render={renderProps => (
                                        <div className="btn facebook-login" onClick={renderProps.onClick}>
                                            <img src={facebookIcon} alt="" className="facebook-img" />
                                            <p className="btn-login-desc">Đăng nhập bằng Facebook</p>
                                        </div>
                                    )}
                                />
                                <div
                                    className="btn google-login" role="button"
                                    onClick={handleLoginWithGoogle}
                                >
                                    <button id="login-with-google" hidden></button>
                                    <img src={googleIcon} alt="" className="google-img" />
                                    <p className="btn-login-desc">Đăng nhập bằng Google</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row login-register-footer">
                    <Footer />
                </div>
            </div>
            <div className="modal hidden">
                <div className="modal__overlay">
                </div>
                <div className="modal__body">
                    {/* Register form */}
                    <div className="register disable-select">
                        <div className="register__container">
                            {
                                !thirdPartyInfor
                                    ?
                                    <div className="register-top">
                                        <div className="register-title">
                                            <span className="main-title">Đăng ký</span>
                                        </div>
                                        <div className="register-exit" onClick={handleHiddenRegisterForm}>
                                            <FontAwesomeIcon icon={faXmark} className="exit-register-icon" />
                                        </div>
                                    </div>
                                    :
                                    <div className="register-top">
                                    </div>
                            }
                            {
                                !otpForm &&
                                <form className="register-contain">
                                    {
                                        !thirdPartyInfor &&
                                        <div className="create-account-wrapper">
                                            <TextInput
                                                type='text' placeholder='Số điện thoại' inputId="id" title="Số điện thoại"
                                                errorStatus={errorStatusId}
                                                onChange={handleChangeId}
                                            />
                                            <TextInput
                                                type='password' placeholder='Mật khẩu' inputId="password" title="Mật khẩu"
                                                warningStatus={warningStatusPass}
                                                onChange={handleChangePass}
                                            />
                                            <TextInput
                                                type='password' placeholder='Nhập lại mật khẩu' inputId="password-confirm"
                                                title="Nhập lại mật khẩu"
                                                errorStatus={errorStatusPassConfirm}
                                                onBlur={handleBlurPassConfirm}
                                                onChange={handleChangePassConfirm}
                                            />
                                        </div>
                                    }
                                    <div className="create-info-wrapper">
                                        <div className="create-info-name">
                                            <p className="name-field-title">Thông tin cơ bản</p>
                                            <div className="wrap-name-field">
                                                <div className="name-field-item">
                                                    <TextInput
                                                        type='text' placeholder='Họ' inputId="first-name"
                                                        onChange={(event) => handleChangeFirstName(event)}
                                                    />
                                                </div>
                                                <div className="name-field-item">
                                                    <TextInput
                                                        type='text' placeholder='Tên' inputId="last-name"
                                                        onChange={(event) => handleChangeLastName(event)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <span className="sex-title">Giới tính</span>
                                        <div className="create-info-sex">
                                            <div className="btn sex-male">
                                                <label htmlFor="male">Nam</label>
                                                <input type="radio" id="male" name="sex" value="1" />
                                            </div>
                                            <div className="btn sex-female">
                                                <label htmlFor="female">Nữ</label>
                                                <input type="radio" id="female" name="sex" value="0" />
                                            </div>
                                        </div>
                                        <span className="birthday-title">Sinh nhật</span>
                                        <div className="create-info-birthday">
                                            <select
                                                className="day-of-birth"
                                                onChange={(event) => setDayOfBirth(event.target.value)}
                                            >
                                                {
                                                    dayInMonth.map((temp, index) =>
                                                        <option key={index} value={temp.day}>{temp.day}</option>
                                                    )
                                                }
                                            </select>
                                            <select
                                                className="month-of-birth"
                                                onChange={(event) => setMonthOfBirth(event.target.value)}
                                            >
                                                {
                                                    monthInYear.map((temp, index) =>
                                                        <option key={index} value={temp.month}>Tháng {temp.month}</option>
                                                    )
                                                }
                                            </select>
                                            <select
                                                className="year-of-birth"
                                                onChange={(event) => setYearOfBirth(event.target.value)}
                                            >
                                                {
                                                    yearInDecade.map((temp, index) =>
                                                        <option key={index} value={temp.year}>{temp.year}</option>
                                                    )
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div id="btn-register" onClick={() => handleRegister()} className="btn btn-register">
                                        {
                                            waitingResponseRegister
                                                ?
                                                <div className="wrap-spin-register">
                                                    <CircularProgress color='#fff' />
                                                </div>
                                                :
                                                <span>Đăng ký</span>
                                        }
                                    </div>
                                </form>
                            }
                            {
                                otpForm &&
                                <form className="register-contain">
                                    <div className="create-account-wrapper">
                                        <TextInput
                                            type='text' placeholder='OTP' inputId="otp" title="Nhập OTP"
                                            errorStatus={errorOtp}
                                            onChange={(event) => handleChangeActiveOTP(event)}
                                        />
                                    </div>
                                    <div id="btn-register" onClick={() => handleSendActiveOTP()} className="btn btn-register">
                                        {
                                            waitingResponseActiveOTP
                                                ?
                                                <div className="wrap-spin-register">
                                                    <CircularProgress color='#fff' />
                                                </div>
                                                :
                                                <span>Xác nhận</span>
                                        }
                                    </div>
                                </form>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default memo(LoginRegister);
