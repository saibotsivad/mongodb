using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MongoNet.MongoDataAPI.Client
{
    public enum ActionsEnum
    {
        [Description("findOne")]
        FindOne,

        [Description("insertOne")]
        InsertOne,

        [Description("find")]
        Find,

        [Description("insertMany")]
        InsertMany,

        [Description("updateOne")]
        UpdateOne,

        [Description("updateMany")]
        UpdateMany,

        [Description("replaceOne")]
        ReplaceOne,

        [Description("deleteOne")]
        DeleteOne,

        [Description("deleteMany")]
        DeleteMany,
    }

    public static class ActionsEnumExtensions
    {
        public static string GetEnumDescription(this ActionsEnum value)
        {
            var type = value.GetType();
            var name = Enum.GetName(type, value);
            if (name == null) return string.Empty;
            var field = type.GetField(name);
            if (field == null) return string.Empty;
            var attr = Attribute.GetCustomAttribute(field, typeof(DescriptionAttribute)) as DescriptionAttribute;
            return attr?.Description ?? string.Empty;
        }
    }
}
