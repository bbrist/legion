# Legion

Legion is a CDK Multi-Stack starter project. 
By default, it is configured for both aws cdk and cdk8s.

## Design

The lib/app.ts file contains the logic that manages the various construct scopes.

For example, `App.scope('aws');` will return the root CloudFormation Stack construct for AWS
resources.

`App.scope('k8s');` will return the root Kubernetes manifest construct for Kubernetes resources.

The `App` object is implemented as a singleton so that it can be referenced from anywhere in the codebase.

### Registering new scopes

You may want to register new scopes as you go along. The `App.register('my-scope', <construct>)` method
allows you to register a new construct that can be referenced elsewhere.

Make sure to register scopes before they are used in other constructs.

## Initialization

The `App` object will need to be initialized. This is done in the `bin/infrastructure.ts` file.

```ts
const aws = new cdk.App();
const k8s = new cdk8s.App();

App.initialize({
    apps: {
        aws,
        k8s,
    },
    scopes: {
        aws: new cdk.Stack(aws, 'Stack', {
            /* If you don't specify 'env', this stack will be environment-agnostic.
            * Account/Region-dependent features and context lookups will not work,
            * but a single synthesized template can be deployed anywhere. */

            /* Uncomment the next line to specialize this stack for the AWS Account
             * and Region that are implied by the current CLI configuration. */
            // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

            /* Uncomment the next line if you know exactly what Account and Region you
             * want to deploy the stack to. */
            // env: { account: '123456789012', region: 'us-east-1' },

            /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
        }),
        k8s: new cdk8s.Chart(k8s, 'Chart', {
            // namespace: 'default'
            /*labels: {
                app: 'my-app',
                chart: 'my-chart',
                release: 'my-release',
                heritage: 'cdk8s',
            }*/
        })
    }
});
```