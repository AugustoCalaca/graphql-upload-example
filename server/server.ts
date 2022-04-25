import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import { GraphQLUpload, graphqlUploadExpress } from "graphql-upload";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { join } from "path";
import fs from "fs";
import { finished } from "stream/promises";

import { useOrCreateFolder, FOLDER } from './useOrCreateFolder'

const typeDefs = gql`
  scalar Upload
  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Query {
    test: String
  }

  type Mutation {
    singleUpload(file: Upload!): File!
    singleUploadStream(file: Upload!): File!
  }
`;

const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    test: () => "ok",
  },
  Mutation: {
    singleUpload: async (_root: undefined, { file }) => {
      console.log({ file, _root });
      const { createReadStream, filename, encoding, mimetype } = await file;

      useOrCreateFolder();
      
      const fileStream = createReadStream();
      const path = join(__dirname, `${FOLDER}/${filename}`);
      const output = fs.createWriteStream(path);

      fileStream.pipe(output);
      await finished(output);

      return {
        filename,
        encoding,
        mimetype,
      };
    },
  },
};

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });
  await server.start();

  const app = express();
  app.use(graphqlUploadExpress());
  server.applyMiddleware({ app });

  await new Promise<void>((res) => app.listen({ port: 4000 }, res));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
};

startServer();
