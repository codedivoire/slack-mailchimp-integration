module.exports = {
  branches: ['main'],
  plugins: [
    ['@semantic-release/commit-analyzer', {
      preset: 'conventionalcommits',
      releaseRules: [
        {type: 'docs', scope: 'README', release: 'patch'},
        {type: 'refactor', release: 'patch'},
        {type: 'style', release: 'patch'},
        {type: 'perf', release: 'patch'},
        {type: 'chore', release: false}
      ]
    }],
    '@semantic-release/release-notes-generator',
    ['@semantic-release/changelog', {
      changelogFile: 'CHANGELOG.md'
    }],
    ['@semantic-release/git', {
      assets: ['package.json', 'CHANGELOG.md'],
      message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
    }],
    '@semantic-release/github'
  ]
}; 