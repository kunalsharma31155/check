export function dateFormatConverter(date){
    var new_date = new Date(date);
    new_date.setMinutes( new_date.getMinutes() + new_date.getTimezoneOffset() );
    return new_date;
}