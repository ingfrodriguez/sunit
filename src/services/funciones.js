import moment from 'moment'

export const func = {
    format_date: (value) => {
        if (value) return moment(String(value)).format('DD-MM-YYYY')            
     }
 }

 export var IpGlobal ='http://localhost:8080'