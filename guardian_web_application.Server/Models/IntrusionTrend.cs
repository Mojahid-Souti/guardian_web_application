namespace guardian_web_application.Server.Models
{
    public class IntrusionTrend
    {
        public required string Name { get; set; }
        public int Detected { get; set; }
        public int Blocked { get; set; }
        public double Average { get; set; }
    }
}
