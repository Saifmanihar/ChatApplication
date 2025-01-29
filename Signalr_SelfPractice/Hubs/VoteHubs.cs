using Microsoft.AspNetCore.SignalR;

namespace Signalr_SelfPractice.Hubs
{
    public class VoteHubs:Hub
    {
        public Dictionary<string,int> GetVoteCount()
        {
            return Vote.VoteCount;
        }
    }
}
