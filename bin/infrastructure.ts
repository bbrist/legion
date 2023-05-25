#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import * as cdk8s from 'cdk8s';
import App from "../lib/app";
import {InfrastructureApp} from "../lib/infrastructure-stack";

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

new InfrastructureApp();

App.synth();