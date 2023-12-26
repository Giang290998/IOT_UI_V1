import { memo, useCallback, useState } from 'react';
import './home.scss';
import Leftbar from '../../components/leftbar/Leftbar.jsx';
import RealTimeLineChart from '../../components/line-chart/RealTimeLineChart.jsx';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import WeaklyReport from '../../components/weakly-report/WeaklyReport.jsx';
import ErrorReport from '../../components/Error-Report/ErrorReport.jsx';
import Manager from '../../components/Manager/Manager.jsx';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTemperatureThreeQuarters, faWandMagicSparkles, faFlaskVial, faDroplet, faGear, faXmark } from "@fortawesome/free-solid-svg-icons";
import mqttClient from '../../utils/mqttClient.js';
import TextInput from '../../components/text-input/TextInput.jsx';
import store from '../../redux/store.js';
import { GetAllAlarm, GetAllDeviceData } from '../../redux/sensorSlice.js';
import { GetProjectDetail } from '../../redux/projectSlice.js';

function Home() {
    const $ = document.querySelector.bind(document);
    const [ppm, setPPM] = useState(null);
    const [pH, setPH] = useState(null);
    const themeMode = useSelector(state => state.auth.themeMode) === 'dark' ? ' dark' : '';
    const RT_temp = useSelector(state => state.sensor.RT_temp);
    const RT_pH = useSelector(state => state.sensor.RT_pH);
    const RT_concentration = useSelector(state => state.sensor.RT_concentration);
    const RT_water = useSelector(state => state.sensor.RT_water);
    let page = useSelector(state => state.auth.page)
    document.title = 'AgriIOT - Home'

    useEffect(() => {
        store.dispatch(GetProjectDetail())
        store.dispatch(GetAllDeviceData())
        store.dispatch(GetAllAlarm())
    }, [])

    const handleChangeTDS = useCallback((event) => {
        setPPM(event.target.value)
    }, [])

    const handleChangePH = useCallback((event) => {
        setPH(event.target.value)
    }, [])


    function UICallESPMonitor() {
        const payload = ppm + ", " + pH;
        console.log(payload)
        mqttClient.client.publish("ui_to_esp/monitor", payload);
    }
    function viewSettingModal() {
        const addStaffModal = $('div[id="setting-number-modal"]');
        addStaffModal.classList.remove("hidden");
    }
    function exitSettingModal() {
        const addStaffModal = $('div[id="setting-number-modal"]');
        addStaffModal.classList.add("hidden");
    }
    function exitSettingModalAndMonitor() {
        const addStaffModal = $('div[id="setting-number-modal"]');
        addStaffModal.classList.add("hidden");
        UICallESPMonitor()
    }

    return (
        <div className={"home-wrapper" + themeMode}>
            <div className="grid home-page">
                <div className="row content">
                    <div className="col l-3 m-0 s-0 left-bar">
                    </div>
                    <Leftbar />
                    <div className="col l-9 m-8 s-12 content">
                        {
                            page === 0
                            &&
                            <>
                                <div className="" style={{ display: 'flex' }}>
                                    <RealTimeLineChart
                                        data={RT_temp.data} label={RT_temp.time} unit={"°C"} max_y_axis={RT_temp.data[RT_temp.data.length - 1] + 0.5}
                                        step_size={0.25} min_y_axis={RT_temp.data[RT_temp.data.length - 1] - 0.5}
                                        borderColor={"blue"} icon={<FontAwesomeIcon icon={faTemperatureThreeQuarters} />}
                                        icon_color={'blue'} icon_size={'30px'} title={'Nhiệt độ'} title_size={'14px'}
                                        title_weight={400}
                                        content_size={'24px'} content_weight={500}
                                    />
                                    <RealTimeLineChart
                                        data={RT_pH.data} label={RT_pH.time}
                                        max_y_axis={RT_pH.data[RT_pH.data.length - 1] + 0.5} min_y_axis={RT_pH.data[RT_pH.data.length - 1] - 0.5}
                                        borderColor={"red"} icon={<FontAwesomeIcon icon={faWandMagicSparkles} />}
                                        icon_color={'red'} icon_size={'30px'} title={'pH'} title_size={'14px'}
                                        title_weight={400}
                                        content_size={'24px'} content_weight={500}
                                    />
                                </div>
                                <div className="" style={{ display: 'flex', width: '100%' }}>
                                    <RealTimeLineChart
                                        data={RT_concentration.data} label={RT_concentration.time} unit={"ppm"}
                                        max_y_axis={RT_concentration.data[RT_concentration.data.length - 1] + 100} min_y_axis={0}
                                        borderColor={"green"} icon={<FontAwesomeIcon icon={faFlaskVial} />}
                                        icon_color={'green'} icon_size={'30px'} title={'Nồng độ chất tan'} title_size={'14px'}
                                        title_weight={400}
                                        content_size={'24px'} content_weight={500}
                                    />
                                    <RealTimeLineChart
                                        data={RT_water.data} label={RT_water.time}
                                        max_y_axis={10} min_y_axis={0}
                                        borderColor={"purple"} icon={<FontAwesomeIcon icon={faDroplet} />}
                                        icon_color={'purple'} icon_size={'30px'} title={'Mực nước'} title_size={'14px'}
                                        title_weight={400}
                                        content_size={'24px'} content_weight={500}
                                    />
                                </div>
                                <div className="">
                                    <div
                                        id="add-staff-btn" className="btn btn--primary add-staff-btn disable-select"
                                        style={{ width: '100%', height: '40px', fontSize: '20px', marginBottom: '20px' }}
                                        onClick={() => viewSettingModal()}
                                    >
                                        <FontAwesomeIcon icon={faGear} className="action-icon promote" />
                                        <p className="add-staff-btn-title" style={{ paddingLeft: '10px' }}>Cài đặt thông số</p>
                                    </div>
                                    <div id="setting-number-modal" className="modal hidden">
                                        <div className="modal__overlay">
                                        </div>
                                        <div className="modal__body">
                                            <div className="register disable-select">
                                                <div className="register__container">
                                                    <div className="register-top">
                                                        <div className="register-title">
                                                            <span className="main-title">Cài đặt thông số</span>
                                                        </div>
                                                        <div className="register-exit"
                                                            onClick={() => exitSettingModal()}
                                                        >
                                                            <FontAwesomeIcon icon={faXmark} className="exit-register-icon" />
                                                        </div>
                                                    </div>
                                                    <form className="register-contain">
                                                        <div className="create-account-wrapper">
                                                            <TextInput
                                                                type='text' placeholder='ppm' inputId="tds" title="Nhập nồng độ"
                                                                onChange={handleChangeTDS}
                                                            />
                                                        </div>
                                                        <div className="create-account-wrapper">
                                                            <TextInput
                                                                type='text' placeholder='pH' inputId="ph" title="Nhập pH"
                                                                onChange={handleChangePH}
                                                            />
                                                        </div>
                                                        <div
                                                            className="btn btn--primary"
                                                            onClick={() => exitSettingModalAndMonitor()}
                                                            style={{ height: '46px', fontSize: '18px', backgroundColor: 'rgb(47, 204, 47)' }}
                                                        >Xác nhận</div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        }
                        {
                            page === 1
                            &&
                            <WeaklyReport />
                        }
                        {
                            page === 2 && <ErrorReport />
                        }
                        {
                            page === 3 && <Manager />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(Home);