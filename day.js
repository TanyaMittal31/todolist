module.exports.getDate = getDate ;
module.exports.getDay = getDay;

function getDate(){
    var today = new Date();
    var currentDay = today.getDay();
    var options = {
        weekday : "long",
        day : "numeric",
        month : "long"
    };
    var day = today.toLocaleDateString("en-US",options);
    return day;
}

function getDay(){
    var today = new Date();
    var currentDay = today.getDay();
    var options = {
        day : "numeric",
    };
    var day = today.toLocaleDateString("en-US",options);
    return day;
}

// note - instead of module.exports we can only