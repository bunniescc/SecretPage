# SecretPage 

## Example Action

you **must** add those KEY in repo's secret.

| KEY | Description |
| :--- | :--- |
| DIST_PAGE_REPO | the repo for Github Page like ```username/repo``` |
| SECRET_PAGE_DEPLOY_KEY | the SSH key for deploying |
| GITHUB_EMAIL | the email of Committer of dist while update |
| GITHUB_USERNAME | the username of Committer of dist while update |

```yaml
name: PubPage

on:
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]
jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
      with:
        path: src
    
    - name: configSSH
      env:
        SECRET_PAGE_DEPLOY_KEY: ${{ secrets.SECRET_PAGE_DEPLOY_KEY }}
      run: |
        mkdir -p ~/.ssh/
        echo "$SECRET_PAGE_DEPLOY_KEY" | tr -d '\r' > ~/.ssh/id_rsa
        chmod 600 ~/.ssh/id_rsa
        ssh-keyscan github.com >> ~/.ssh/known_hosts
    
    - name: configGit
      env:
        GITHUB_EMAIL: ${{ secret.GITHUB_EMAIL }}
        GITHUB_USERNAME: ${{ secret.GITHUB_USERNAME }}
      run: |
        git config --global user.email "$GITHUB_EMAIL"
        git config --global user.name "$GITHUB_USERNAME"
    
    - name: clone dist page repo
      env:
        PAGE_REPO: ${{ secret.PAGE_REPO }}
      run: |
        git clone git@github.com:$PAGE_REPO.git dist

    - name: mkdir
      run: |
        mkdir -p dist/asset

    - name: generate pages
      uses: bunniescc/SecretPage@master
      with:
        src: "src"
        dist: "dist"
    - name: commit and push
      run: |
        cd dist
        echo $(date "+%Y-%m-%d %H:%M:%S") > version.txt
        git add .
        git commit -am "Update"
        git push origin master -f
```
