console.log('Hello World');

$(document).ready(function() {
    var timer;

    var parseTime = function() {
        var timeString = $("#time").html();
        var pieces = timeString.split(":");

        var hours = parseInt(pieces[0],10);
        var minutes = parseInt(pieces[1],10);
        var seconds = parseInt(pieces[2],10);

        var secondsInHour = 60 * 60;
        var secondsInMinute = 60;

        return ( hours * secondsInHour ) + ( minutes * secondsInMinute ) + seconds;
    };

    var formatTime = function( hours, minutes, seconds ) {
        var hoursString = ( hours > 9 ) ? hours.toString() : "0" + hours.toString();
        var minutesString = ( minutes > 9 ) ? minutes.toString() : "0" + minutes.toString();
        var secondsString = ( seconds > 9 ) ? seconds.toString() : "0" + seconds.toString();

        return hoursString + ":" + minutesString + ":" + secondsString;
    };

    var setTime = function( time ) {
        var secondsInHour = 60 * 60;
        var secondsInMinute = 60;

        var hours = Math.floor( time / secondsInHour );
        var secondsAfterHours = time - ( hours * secondsInHour );
        var minutes = Math.floor( secondsAfterHours / secondsInMinute );
        var seconds = secondsAfterHours - ( minutes * secondsInMinute );

        var timeString = formatTime( hours, minutes, seconds );

        $("#time").html( timeString );
    };

    function round(value, decimals) {
        return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    }

    var setEarned = function( time ) {
        var secondsInHour = 60 * 60;
        var rate = $("#hourlyRate").val();
        var earned = round( rate * ( time / secondsInHour ), 2 );
        var earnedString = "$" + earned.toString();

        $("#earned").html(earnedString);
    };

    var getFutureValue = function( value, rate, years ) {
        if ( years <= 0 ) return value;
        var valueAtEndOfYear = value * ( 1 + rate );

        return getFutureValue( valueAtEndOfYear, rate, years - 1 );
    };

    var setFutureValue = function( years, target ) {
        var earned = parseFloat($("#earned").html().split("$")[1]);
        var rate = $("#returnRate").val();

        var fv = round( getFutureValue( earned, rate, years ), 2 );
        var fvString = "$" + fv;

        $(target).html(fvString);
    };

    var step = function( time ) {
        time = ( typeof time !== 'undefined' ) ? time : parseTime();

        setTime( time );
        setEarned( time );
        setFutureValue(10, "#valInTen");
        setFutureValue(50, "#valInFifty");

        var newTime = time + 1;

        timer = setTimeout(
            step,
            1000,
            newTime
        );
    };

    $("#start").on("click", function(e) {
        e.preventDefault();

        step();
    });

    $("#pause").on("click", function(e) {
        e.preventDefault();

       clearTimeout(timer);
    });

    $("#reset").on("click", function(e) {
        e.preventDefault();

        clearTimeout(timer);
        setTime(0,0,0);
    });
});