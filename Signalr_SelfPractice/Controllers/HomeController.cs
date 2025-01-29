using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Signalr_SelfPractice.Hubs;
using Signalr_SelfPractice.Models;
using System.Diagnostics;

namespace Signalr_SelfPractice.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IHubContext<VoteHubs> _voteHub;

        public HomeController(ILogger<HomeController> logger, IHubContext<VoteHubs> voteHub)
        {
            _logger = logger;
            _voteHub = voteHub;
        }

        public IActionResult Index()
        {
            return View();
        }


        public  async Task<IActionResult> VoteAction(string type) 
        {
            if (Vote.VoteCount.ContainsKey(type))
            {
                Vote.VoteCount[type]++;
            }
            await _voteHub.Clients.All.SendAsync("UpdateVoteCount",
                Vote.VoteCount[Vote.Bjp],
                Vote.VoteCount[Vote.Aap],
                Vote.VoteCount[Vote.Congress]
            );
            return Accepted();
        }
        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
