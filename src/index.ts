import { Binding } from './generated-binding'
import { HttpLink } from 'apollo-link-http'
import * as fetch from 'cross-fetch'

export class GitHubLink extends HttpLink {
  constructor(token: string) {
    if (!token) {
      throw new Error(
        'No Github token provided. Create one here: https://github.com/settings/tokens (Guide: https://developer.github.com/v4/guides/forming-calls/#authenticating-with-graphql)',
      )
    }
    super({
      uri: 'https://api.github.com/graphql',
      headers: { Authorization: `token ${token}` },
      fetch,
    })
  }
}

export class GitHub extends Binding {
  constructor(token: string) {
    super({ link: new GitHubLink(token) })
  }
}

export { typeDefs } from './generated-binding'
