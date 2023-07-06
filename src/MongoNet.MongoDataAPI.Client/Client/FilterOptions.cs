using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MongoNet.MongoDataAPI.Client
{
    public class FilterOptions
    {
         public object? Filter { get; set; }
         public object? Sort { get; set; }
         public object? Limit { get; set; }
         public object? Skip { get; set; }
        public object? Projection { get; set; }
    }
}
