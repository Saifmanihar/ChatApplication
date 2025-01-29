
var connectionUserCount = new signalR.HubConnectionBuilder().withUrl('/Hubs/userHub', signalR.HttpTransportType.WebSockets).build();

connectionUserCount.on("WindowLoadFunction", (TotalViewValue) => {
    var totalView = $("#TotalView");
    totalView.text(TotalViewValue.toString());
    console.log(totalView);
});

connectionUserCount.on("TotalUserCount", (TotalUserValue) => {
    var totalUser = $("#TotalUser");
    totalUser.text(TotalUserValue.toString());
    console.log(totalUser);
});

connectionUserCount.on("TotalDisUserCount", (TotalDisUserValue) => {
    var totalDisUser = $("#TotalDisconnectedUser");
    totalDisUser.text(TotalDisUserValue.toString());
    console.log(totalDisUser);
});

//on to one response 
var message, user;
var UserHubId;
var connId = $("#ConId");

    $("#UserName").on("input", function () {
        user = $(this).val();
    });
    $("#UserMessage").on("input", function () {
        message = $(this).val();
    });
    function SubmitForm() {
        console.log(message, user);
        connectionUserCount.invoke("oneToOne", user, message);
         $("#UserMessage").val('');
         $("#UserName").val('');
    }
    connectionUserCount.on("ReceiveMessage", (user, message) => {
        var userField = $("#user");
        var messagefield = $("#message");
        userField.text(user.toString());
        messagefield.text(message.toString());
    });


    //One to everyone 
    function SubmitFormEveryone() {
        console.log(message, user);
        connectionUserCount.invoke("oneToEveryOne", user, message, UserHubId);
        $("#UserMessage").val('');
        $("#UserName").val('');
    }

    connectionUserCount.on("ReceiveEveryOne", (user, message ,uId) => {
        var userField = $("#user");
        var messagefield = $("#message");
        var connectedUserHubId = $("#ConnectedUserHubId");
        userField.text(user.toString());
        messagefield.text(message.toString());
        connectedUserHubId.text(uId.toString());
    });


//One to one response-- 
    var userField = $("#user").text();
    var messagefield = $("#message").text();
//function chatMe(anchor) {
//    var user = $("#user");
//    var message = $("#message");
//    console.log("Setting UserId:", user, message, connId);
//}

function SubmitFormOne() {
    var userField = $("#UserName").val();
    var messagefield = $("#UserMessage").val();
    var FormId = $("#FormId").val();
    console.log(FormId);
    connectionUserCount.invoke("oneToOneResponse", messagefield, FormId);
    console.log(userField, messagefield);
    $("#UserMessage").val('');
    $("#UserName").val('');
}

connectionUserCount.on("OnetoOne", (message,senderId) => {
    const msg = document.createElement("div");
    msg.textContent = `Message from ${senderId}: ${message}`;
    document.getElementById("messagesList").appendChild(msg);
});


//passing the Selected user Id so they can communicate with each other 
function ChatMe(t) {
    var selectUserId = $(t).find("#ConnectedUserHubId").text();
    console.log(selectUserId);
    var formId = $("#FormId");
    formId.val(selectUserId);
}

//connection id starts
function UserConnectionId() {
    connectionUserCount.invoke("NotifyConnectionId");
}
connectionUserCount.on("ConnectionIds", (connectionId) => {
    connId.text(connectionId.toString());
    UserHubId = connectionId;
});

function IdsBtn() {
    var firstId = $("#FirstUserId").val();
    var secondId = $("#SecondUserId").val();
    var messageBoth = $("#MessageForBoth").val();
    console.log("First User id:", firstId);
    console.log("Second User id:", secondId);
    connectionUserCount.invoke("ExceptResponse", messageBoth, firstId, secondId);
}
connectionUserCount.on("ExceptRecieve", (message) => {
    var userM = $("#SpecialMessage");
    var newElement = $('<div></div>').text(message);
    userM.append(newElement);
});

//connection id ends

function newWindowLoadedOnClient() {
    connectionUserCount.invoke("OnWindowLoad");
}

function SuccessReponse() {
    console.log("Success");
    newWindowLoadedOnClient();
    UserConnectionId();
}

function FailedReponse() {
    console.log("failed");
}


var start = async () => {
    try {
        await connectionUserCount.start().then(SuccessReponse, FailedReponse);
        console.log("Connected signal");
    }
    catch (err){
        console.log(err);
        setTimeout(start, 5000);
    }
}
start();
connectionUserCount.onclose(async () => {
    await start();
});
