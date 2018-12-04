const handleError = (message) => {
    $("#boxErrorMessage").text(message);
    $("#boxErrorMessage")
    .transition('fade')
    .transition('fade', 500);
};

const handleSuccess = (message) => {
    $("#boxSuccessMessage").text(message.success);
    $("#boxSuccessMessage")
    .transition('fade')
    .transition('fade', 500);
};

const redirect = (response) => {
    $("#boxErrorMessage").animate({width:'hide'}, 350);
    window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        success: success,
        error: function (xhr, status, error) {
            let messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};