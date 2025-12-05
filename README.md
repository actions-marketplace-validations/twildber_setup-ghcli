# setup-ghcli

[![build & test](https://github.com/twildber/setup-ghcli/actions/workflows/test.yaml/badge.svg)](https://github.com/twildber/setup-ghcli/actions/workflows/test.yaml)
[![release](https://github.com/twildber/setup-ghcli/actions/workflows/release.yaml/badge.svg)](https://github.com/twildber/setup-ghcli/actions/workflows/release.yaml)

This is a GitHub action to install the [GitHub CLI](https://cli.github.com/).

## How it works

```yaml
steps:
  - name: twildber/setup-ghcli@main
    with:
      version: 2.28.0 #optional, defaults to 'latest'
```
