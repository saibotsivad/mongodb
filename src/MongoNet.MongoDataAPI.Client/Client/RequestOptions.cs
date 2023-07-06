namespace MongoNet.MongoDataAPI.Client
{
    public class RequestOptions
    {
        public string? EndPoint { get; set; } = "data";
        public string? Version { get; set; } = "v1";
        public object? Projection { get; set; } = null;
        public object? Document { get; set;} = null;
    }
}
