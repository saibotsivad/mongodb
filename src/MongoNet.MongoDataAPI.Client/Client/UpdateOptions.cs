namespace MongoNet.MongoDataAPI.Client
{
    public class UpdateOptions
    {
        public object? UpdateDefinition { get; set; }
        public object? Replacement { get; set; }
        public bool IsUpsert { get; set; }
    }
}
