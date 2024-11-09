namespace guardian_web_application.Server.Models
{
    public class IntrusionType
    {
        public required string Name { get; set; }
        public int Count { get; set; }
        public required string Severity { get; set; }
        public int Risk { get; set; }
    }
}
