namespace Signalr_SelfPractice.Hubs
{
    public static class Vote
    {
        static Vote()
        {
            VoteCount = new Dictionary<string, int>();
                VoteCount.Add(Bjp, 0);
                VoteCount.Add(Aap, 0);
                VoteCount.Add(Congress, 0);
        }

        public const string Bjp = "BJP";
        public const string Aap = "Aap";
        public const string Congress = "Congress"; 

        public static Dictionary<string, int> VoteCount;
    }
}
