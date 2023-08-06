# Release Strategy

This is the process for publishing a change to the NPM registry:

1. Make changes as part of PR
2. Once merged into `main` create tags for whichever package(s) changed:
   * `git tag genesys-web-messaging-tester-vX.X.X`
   * `git tag genesys-web-messaging-tester-cli-vX.X.X`
3. Push the tags
   * `git push origin genesys-web-messaging-tester-vX.X.X`
   * `git push origin genesys-web-messaging-tester-cli-vX.X.X`
4. Using GitHub's UI create a Release based on the most recent tag

_If a merged PR increased the version of both packages then create the two tags
(following the format in the step above) then create a release off of the
tag created last._


## Beta releases

1. Suffix the versions with `-beta.0`, increase the number for subsequent publishes
2. Publish the beta version
   ```
   npm publish --tag <tag-name>
   ```
