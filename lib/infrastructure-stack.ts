import * as cdk from 'aws-cdk-lib';
import * as k8s from 'cdk8s';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import {Service} from "cdk8s-plus-25";
import App from "./app";

export class InfrastructureApp {
  constructor() {

    const service = new Service(App.scope('k8s'), 'Service', {
        ports: [{ port: 80, targetPort: 8080 }]
    });

    // example resource
    const queue = new sqs.Queue(App.scope('aws'), 'Queue', {
        visibilityTimeout: cdk.Duration.seconds(300)
    });

  }
}
