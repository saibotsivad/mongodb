using FluentAssertions;
using Flurl.Http.Testing;
using MongoDB.Bson;
using MongoNet.MongoDataAPI.Client;
using System.Reflection.Metadata;
using System.Security.Cryptography;
using System.Threading;

namespace MongoNet.MongoDataAPI.UnitTests.Client
{
    public class MongoDataAPIClientShould
    {
        private readonly MongoDataAPIClient SUT;
        private readonly CancellationTokenSource cancellationTokenSource;
        private readonly CancellationToken cancellationToken;


        public MongoDataAPIClientShould()
        {
            cancellationTokenSource = new();
            cancellationToken = cancellationTokenSource.Token;
            SUT = new MongoDataAPIClient(dataSource: "Cluster0", dataBase: "general",
                                         collection: "test", apiUrl: "https://test.com",
                                         apiId: "123", apiKey: "456");
        }

        [Fact]
        public async Task WhenExecutingFindOneMethod_ExecuteMethod_ReturnNonNullResult()
        {
            using var httpTest = new HttpTest();

            //arrange
            var idValue = ObjectId.GenerateNewId().ToString();
            var requestOptions = new RequestOptions
            {
                Document = new { _id = idValue, name = "Henrique Martins de Souza", age = "29" }
            };


            //act
            httpTest.RespondWith("OK", 200);
            var insertionResult = await SUT.InsertOne(cancellationToken, requestOptions: requestOptions);

            //act
            var result = await SUT.FindOne(cancellationToken);

            //assert
            Assert.NotNull(result);
            result.StatusCode.Should().Be((int)System.Net.HttpStatusCode.OK);
        }

        [Fact]
        public async Task WhenExecutingFindMethod_ExecuteMethod_ReturnNonNullResult()
        {
            using var httpTest = new HttpTest();
            var filterOptions = new FilterOptions
            {
                Filter = new { name = "Henrique Martins de Souza" },
                Projection = new { name = 1 },
                Limit = 1
            };

            //act
            httpTest.RespondWith("OK", 200);
            var result = await SUT.FindMany(filterOptions: filterOptions, cancellationToken);

            //assert
            Assert.NotNull(result);
            result.Value.StatusCode.Should().Be(200);
        }

        [Fact]
        public async Task WhenExecutingInsertOneMethod_ExecuteMethod_ReturnNonNullResult()
        {
            using var httpTest = new HttpTest();
            var requestOptions = new RequestOptions
            {
                Document = new { name = "Henrique Martins de Souza", age = "29" }
            };

            //act
            httpTest.RespondWith("CREATED", 201);
            var result = await SUT.InsertOne(cancellationToken, requestOptions: requestOptions);

            //assert
            Assert.NotNull(result);
            result.Value.StatusCode.Should().Be(201);
        }

        [Fact]
        public async Task WhenExecutingInsertManyMethod_ExecuteMethod_ReturnNonNullResult()
        {
            using var httpTest = new HttpTest();

            //arrange
            object document1 = new { name = "Henrique Martins de Souza", age = "29" };
            object document2 = new { name = "Zenilda Martins de Souza", age = "29" };
            object document3 = new { name = "Isaias Geraldo de Souza", age = "29" };

            //act
            httpTest.RespondWith("CREATED", 201);
            var result = await SUT.InsertMany(documents: new object[] { document1, document2, document3 }, cancellationToken);

            //assert
            Assert.NotNull(result);
            result.Value.StatusCode.Should().Be(201);
        }

        [Fact]
        public async Task WhenExecutingUpdateOneMethod_ExecuteMethod_ReturnNonNullResult()
        {
            using var httpTest = new HttpTest();


            //act
            httpTest.RespondWith("OK", 200);
            var result = await SUT.UpdateOne(new FilterOptions { Filter = new { _id = new { oid = "64a6e17969e91221037fd74b" } } },
                                             new UpdateOptions { UpdateDefinition = new { set = new { name = "Henrique Martins Souza" } }, IsUpsert = false },
                                             cancellationToken);

            //assert
            Assert.NotNull(result);
            result.Value.StatusCode.Should().Be(200);
            var value = await result.Value.GetStringAsync();
        }

        [Fact]
        public async Task WhenExecutingUpdateManyMethod_ExecuteMethod_ReturnNonNullResult()
        {
            using var httpTest = new HttpTest();

            //act
            httpTest.RespondWith("OK", 200);
            var result = await SUT.UpdateMany(new FilterOptions { Filter = new { age = "29" } },
                                             new UpdateOptions { UpdateDefinition = new { set = new { name = "Henrique Martins Souza" } }, IsUpsert = false },
                                             cancellationToken);

            //assert
            Assert.NotNull(result);
            result.Value.StatusCode.Should().Be(200);
            var value = await result.Value.GetStringAsync();
        }

        [Fact]
        public async Task WhenExecutingReplaceOneMethod_ExecuteMethod_ReturnNonNullResult()
        {
            using var httpTest = new HttpTest();


            //arrange
            var idValue = ObjectId.GenerateNewId().ToString();
            var requestOptions = new RequestOptions
            {
                Document = new { _id = idValue, name = "Henrique", age = "29" }
            };

            httpTest.RespondWith("OK", 200);

            //act
            var insertionResult = await SUT.InsertOne(cancellationToken, requestOptions: requestOptions);

            //act
            var replacementResult = await SUT.ReplaceOne(new FilterOptions { Filter = new { _id = idValue } },
                                                         new UpdateOptions { Replacement = new { name = "Henrique Martins de Souza", age = "29" }, IsUpsert = false },
                                                         cancellationToken);

            //assert
            Assert.NotNull(replacementResult);
            replacementResult.Value.StatusCode.Should().Be(200);
            var value = await replacementResult.Value.GetStringAsync();
        }

        [Fact]
        public async Task WhenExecutingDeleteOneMethod_ExecuteMethod_ReturnNonNullResult()
        {
            using var httpTest = new HttpTest();


            //arrange
            var idValue = ObjectId.GenerateNewId().ToString();
            var requestOptions = new RequestOptions
            {
                Document = new { _id = idValue, name = "Henrique", age = "29" }
            };

            httpTest.RespondWith("OK", 200);


            //act
            var insertionResult = await SUT.InsertOne(cancellationToken, requestOptions: requestOptions);

            //act
            var replacementResult = await SUT.DeleteOne(new FilterOptions { Filter = new { _id = idValue } }, cancellationToken);

            //assert
            Assert.NotNull(replacementResult);
            replacementResult.Value.StatusCode.Should().Be(200);
            var value = await replacementResult.Value.GetStringAsync();
        }

        [Fact]
        public async Task WhenExecutingDeleteManyMethod_ExecuteMethod_ReturnNonNullResult()
        {
            using var httpTest = new HttpTest();


            //arrange
            var idValue1 = ObjectId.GenerateNewId().ToString();
            var idValue2 = ObjectId.GenerateNewId().ToString();
            var document1 = new { _id = idValue1, name = "Henrique Martins", age = "29" };
            var document2 = new { _id = idValue2, name = "Henrique Souza", age = "29" };

            httpTest.RespondWith("OK", 200);


            //act
            var insertionResult = await SUT.InsertMany(new object[] { document1, document2 }, cancellationToken);

            //act
            var filter = new { _id = new { @in = new object[] { idValue1, idValue2 } } };
            var replacementResult = await SUT.DeleteMany(new FilterOptions { Filter = filter }, cancellationToken);

            //assert
            Assert.NotNull(replacementResult);
            replacementResult.Value.StatusCode.Should().Be(200);
            var value = await replacementResult.Value.GetStringAsync();
        }
    }
}
