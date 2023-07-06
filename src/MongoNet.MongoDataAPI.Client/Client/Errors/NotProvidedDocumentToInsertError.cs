using FluentResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MongoNet.MongoDataAPI.Client.Errors
{
    public class NotProvidedDocumentToInsertError : IError
    {
        public List<IError> Reasons => new();

        public string Message => "This errror occurs when attempting to Insert One document " +
                                  "without providing the document to insert.";

        public Dictionary<string, object> Metadata => new();
    }
}
