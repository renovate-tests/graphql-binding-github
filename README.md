# GraphQL Binding for GitHub

[![CircleCI](https://circleci.com/gh/graphql-binding/graphql-binding-github.svg?style=shield)](https://circleci.com/gh/graphql-binding/graphql-binding-github) [![npm version](https://badge.fury.io/js/graphql-binding-github.svg)](https://badge.fury.io/js/graphql-binding-github)

Embed GitHub's GraphQL API into your server application

## Install

```sh
yarn add graphql-binding-github
```

## Example ([Demo](https://graphqlbin.com/Agjcr))

See [example directory](example) for full example application.

```js
const { GitHub } = require('graphql-binding-github')
const { GraphQLServer } = require('graphql-yoga')
const { importSchema } = require('graphql-import')

const favoriteRepos = [
  { owner: 'graphcool', name: 'graphql-yoga' },
  { owner: 'graphql', name: 'graphql-js' },
]

const token = '__ENTER_YOUR_GITHUB_TOKEN__'
const github = new GitHub(token)

const typeDefs = importSchema('schemas/app.graphql')
const resolvers = {
  Query: {
    hello: (parent, { name }) => `Hello ${name || 'World'}!`,
    favoriteRepos: (parent, args, context, info) => {
      return Promise.all(
        favoriteRepos.map(args => github.query.repository(args, context, info)),
      )
    },
  },
  // the following is needed to make interfaces, unions & custom scalars work
  ...github.remoteResolvers(typeDefs),
}

const server = new GraphQLServer({ resolvers, typeDefs })
server.start(() => console.log('Server running on http://localhost:4000'))
```

## How to create a GitHub Token

Simply follow [this guide](https://developer.github.com/v4/guides/forming-calls/#authenticating-with-graphql) and head over to the [token settings on GitHub](https://github.com/settings/tokens).

## Resources

* Github GraphQL Explorer: https://developer.github.com/v4/explorer/

## Codegen

In order to generate new types, make sure that the env var `GH_AUTH_TOKEN` is set.
If that is the case, just execute `yarn codegen`, which uses the new `graphql codegen` command of the GraphQL CLI.

That command looks into the `.graphqlconfig.yml` file and tries to find an extension called `codegen`.
As you can see in the `.graphqlconfig.yml`, our codegen config looks like this:

```yaml
    extensions:
      codegen:
        generator: graphql-codegen-binding
        language: typescript
        target: src/generated-binding.ts
```

`generator`: This is the generator package, used to generate the code. At the time of writing there are 2 generators: [`graphql-codegen-binding`](https://github.com/graphql-binding/graphql-codegen-binding) and [`graphql-codegen-prisma-binding`](https://github.com/graphcool/prisma-binding/tree/beta/packages/graphql-codegen-prisma-binding).

`language`: The language you want to generate code for. Currently available: `typescript`, `javascript`

`target`: The target file path where you want the binding to be generated to.

## Make package consumable

There are 2 things needed to be able to use this package:

1.  The `GithubBinding` class
2.  The `schema.graphql`

When executing the `yarn build` command, both the binding is generated and the schema fecthed.

If you want to reuse types of this packages, simply import them like this:

```
const schema = require('graphql-binding-github/schema.graphql`)
```
