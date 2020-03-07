# SecretPage 

## Get Dist Repo Template

Clone the repo

```shell script
clone https://github.com/bunniescc/secret
```

you should change something.

## Generate a deploy key

you can run in shell like this

```shell script
ssh-keygen -f spdk
```

and you will get two files ```spdk.pub``` and ```spdk```

add content of ```spdk.pub``` to the repo of Github Pages in ```Setting  >  Deploy keys```

and the content of ```spdk``` should add to the repo of origin files in ```Setting  >  Secrets```

## Example Action

you **must** add those KEY in repo's secret.

| KEY | Description |
| :--- | :--- |
| PAGE_REPO | the repo for Github Page like ```username/repo``` |
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
        GITHUB_EMAIL: ${{ secrets.GITHUB_EMAIL }}
        GITHUB_USERNAME: ${{ secrets.GITHUB_USERNAME }}
      run: |
        git config --global user.email "$GITHUB_EMAIL"
        git config --global user.name "$GITHUB_USERNAME"
    
    - name: clone dist page repo
      env:
        PAGE_REPO: ${{ secrets.PAGE_REPO }}
      run: |
        git clone git@github.com:$PAGE_REPO.git dist

    - name: mkdir
      run: |
        mkdir -p dist/site_asset

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
