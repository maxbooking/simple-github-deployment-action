import * as core from '@actions/core'
import { context, getOctokit } from '@actions/github'

export async function run(): Promise<void> {
  try {
    const token = core.getInput('github-token', { required: true })
    const ref = core.getInput('ref', { required: true })
    const target = core.getInput('target', { required: true })
    const description = core.getInput('description')
    core.debug(`Deployment of ${ref} to ${target}`)
    const github = getOctokit(token)
    await github.rest.repos.createDeployment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      ref,
      environment: target,
      description: description
        ? description
        : `Deployment of ${ref} to ${target}`,
      // Disable auto merge when the requested ref
      // is behind the repository's default branch
      auto_merge: false
    })
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}
