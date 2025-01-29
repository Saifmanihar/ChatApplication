using Microsoft.AspNetCore.SignalR;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Signalr_SelfPractice.Hubs
{
    public class UserHub:Hub
    {
        private static int TotalUser { get; set; } = 0;
        private static int TotalView { get; set; } = 0;
        private static int Id { get; set; } = 0;

        public override Task OnConnectedAsync()
        {
            TotalUser++;
            Clients.All.SendAsync("TotalUserCount", TotalUser).GetAwaiter().GetResult();
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            TotalUser--;
            Clients.All.SendAsync("TotalDisUserCount", TotalUser).GetAwaiter().GetResult();
            return base.OnDisconnectedAsync(exception);
        }

        public async Task OnWindowLoad()
        {
            TotalView++;
            await Clients.All.SendAsync("WindowLoadFunction", TotalView);
        }


        //User connection Id 
        public async Task NotifyConnectionId()
        {
            await Clients.Caller.SendAsync("ConnectionIds", Context.ConnectionId);
        }

        //One to one response 
        public async Task<string> oneToOne(string user, string message)
        {
            await Clients.Caller.SendAsync("ReceiveMessage", user, message);
            return $"Message sent {user} :{message}";
        }

        //One to Everyone response
        public async Task<string> oneToEveryOne(string user, string message,string  UserHubId)
        {
            await Clients.Others.SendAsync("ReceiveEveryOne", user, message, UserHubId);
            return $"Message sent {user} :{message}";
        }

        //one to one response 
        public async Task<string> oneToOneResponse(string message, string id)
        {
            await Clients.Client(id).SendAsync("OnetoOne",message,id);
            return $"Message sent :{message}";
        }

        //All except which means leaving some of the clients i want to send the message to everyone 
        //for example leaving A and D i want to send message to everyone 
        public async Task<string> ExceptResponse(string message, string firstId, string secondId)
        {
            await Clients.AllExcept(firstId, secondId).SendAsync("ExceptRecieve", message);
            return $"Message sent :{message}";
        }
    }
}
