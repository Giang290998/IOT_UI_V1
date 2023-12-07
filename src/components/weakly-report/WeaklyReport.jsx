import LineChart from "../line-chart/LineChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTemperatureThreeQuarters, faWandMagicSparkles, faFlaskVial, faDroplet } from "@fortawesome/free-solid-svg-icons";
function WeaklyReport() {
    return (
        <div>
            <LineChart
                borderColor={"blue"} icon={<FontAwesomeIcon icon={faTemperatureThreeQuarters} />}
                icon_color={'blue'} icon_size={'30px'} title={'Nhiệt độ'} title_size={'14px'}
                title_weight={400} content={'28 °C'} content_size={'24px'} content_weight={500}
            />
            <LineChart borderColor={"red"} icon={<FontAwesomeIcon icon={faWandMagicSparkles} />}
                icon_color={'red'} icon_size={'30px'} title={'pH'} title_size={'14px'}
                title_weight={400} content={'28 °C'} content_size={'24px'} content_weight={500}
            />
            <LineChart borderColor={"green"} icon={<FontAwesomeIcon icon={faFlaskVial} />}
                icon_color={'green'} icon_size={'30px'} title={'Nồng độ chất tan'} title_size={'14px'}
                title_weight={400} content={'28 °C'} content_size={'24px'} content_weight={500}
            />
            <LineChart borderColor={"purple"} icon={<FontAwesomeIcon icon={faDroplet} />}
                icon_color={'purple'} icon_size={'30px'} title={'Mực nước'} title_size={'14px'}
                title_weight={400} content={'28 °C'} content_size={'24px'} content_weight={500}
            />
        </div>
    );
};

export default WeaklyReport;