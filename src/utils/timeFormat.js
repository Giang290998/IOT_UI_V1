import moment from 'moment';
import 'moment/locale/vi';

const timeFormat = {
    timeAgo: (ISO8604_time) => {
        moment.locale('vi')
        const timeFormat = moment(ISO8604_time).format('YYYY-MM-DD hh:mm:ss A Z')
        const timeAgo = moment(timeFormat, 'YYYY-MM-DD hh:mm:ss A Z').fromNow()
        const timeAgoModified1 = timeAgo.includes("trước") ? timeAgo.replace("trước", "") : timeAgo
        const timeAgoModified2 = timeAgoModified1.includes("một") ? timeAgoModified1.replace("một", "1") : timeAgoModified1
        return timeAgoModified2
    },
    timeAgoForPost: (ISO8604_time) => {
        moment.locale('vi')
        const timeFormat = moment(ISO8604_time).format('YYYY-MM-DD hh:mm:ss A Z')
        const timeAgo = moment(timeFormat, 'YYYY-MM-DD hh:mm:ss A Z').fromNow()
        return timeAgo
    }
}

export default timeFormat;