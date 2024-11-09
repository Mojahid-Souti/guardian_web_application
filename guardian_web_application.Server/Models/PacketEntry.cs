namespace guardian_web_application.Server.Models
{
    public class PacketEntry
    {
        public int Id { get; set; }
        public required string Src { get; set; }
        public required string Dst { get; set; }
        public int Port { get; set; }
        public required string Service { get; set; }
        public required string Info { get; set; }
        public required string Attack { get; set; }
        public required string ThreatLevel { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
