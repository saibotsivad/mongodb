using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MongoNet.MongoDataAPI.Client
{
    public class ApiAccessOptions
    {
        //mongodb data api access configuration
        public string? ApiUrl { get; set; } = null;
        public string? ApiId { get; set; } = null;
        public string? ApiKey { get; set; } = null;
    }
}
