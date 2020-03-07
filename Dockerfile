FROM node:10.11.0-alpine

COPY ./src /action

RUN chmod +x /action/entrypoint.sh

ENTRYPOINT ["/action/entrypoint.sh"]

LABEL "com.github.actions.name"="Generate SecretPage"
LABEL "com.github.actions.description"="GitHub Actions for Generate SecretPage"
LABEL "com.github.actions.icon"="book-open"
LABEL "com.github.actions.color"="blue"
LABEL "repository"="https://github.com/bunniescc/SecretPage"
LABEL "homepage"="https://github.com/bunniescc/SecretPage"
LABEL "maintainer"="https://github.com/bunniescc"
