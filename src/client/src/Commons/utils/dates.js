import moment from 'moment'
import config from '../../config/app'

export function formatDateVisualy(date) {
    return moment(date).format(config.dates.visual_format)
}

export function formatDateForStorage(date) {
    return moment(date).format(config.dates.storage_format)
}