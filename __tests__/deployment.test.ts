import nock from 'nock'
import { run } from '../src/deployment'

describe('Deployment action test suite', () => {
  it('creates a deployment', async () => {
    const repo = 'foo/bar'
    const ref = 'v0.0.1'
    const target = 'production'
    const githubToken = 'mytoken'
    const description = 'My Deployment'
    process.env['INPUT_REF'] = ref
    process.env['INPUT_TARGET'] = target
    process.env['INPUT_GITHUB-TOKEN'] = githubToken
    process.env['INPUT_DESCRIPTION'] = description

    process.env['GITHUB_REPOSITORY'] = repo
    process.env['GITHUB_TOKEN'] = githubToken

    const scope = nock('https://api.github.com', {
      reqheaders: {
        authorization: `token ${githubToken}`
      }
    })
      .persist()
      .post(`/repos/${repo}/deployments`, {
        ref: ref,
        environment: target,
        description: description // We can also use a regex: /.+/
      })
      .reply(200, [
        {
          url: `https://api.github.com/repos/${repo}/deployments/1`,
          id: 1,
          node_id: 'MDEwOkRlcGxveW1lbnQx',
          sha: 'a84d88e7554fc1fa21bcbc4efae3c782a70d2b9d',
          ref: ref,
          task: 'deploy',
          payload: {},
          original_environment: 'staging',
          environment: target,
          description: description,
          created_at: '2022-03-20T01:19:13Z',
          updated_at: '2022-03-20T01:19:13Z',
          statuses_url: `https://api.github.com/repos/${repo}/deployments/1/statuses`,
          repository_url: `https://api.github.com/${repo}/example`,
          transient_environment: false,
          production_environment: true
        }
      ])

    await run()

    scope.done()
  })
})
