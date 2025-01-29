var connectionUserCount = new signalR.HubConnectionBuilder().withUrl("/Hubs/voteHubs", signalR.HttpTransportType.WebSockets).build();

//vote Count starts
var bjp = $("#BJPID");
var aap = $("#AAPID");
var congress = $("#CONGRESSID");

connectionUserCount.on("UpdateVoteCount", (Bjp, Aap, Congress) => {
    bjp.text(Bjp.toString());
    aap.text(Aap.toString());
    congress.text(Congress.toString());
});
function SuccessReponse() {
    //connectionUserCount.invoke("OnWindowLoad");
    connectionUserCount.invoke("GetVoteCount").then((count) => {
        console.log(count);
        bjp.text(count.BJP ? count.BJP.toString() : 0);
        aap.text(count.Aap ? count.Aap.toString() : 0);
        congress.text(count.Congress ? count.Congress.toString() : 0);
    });
    console.log("Success");
}

function FailedReponse() {
    console.log("failed");
}

connectionUserCount.start().then(SuccessReponse, FailedReponse);