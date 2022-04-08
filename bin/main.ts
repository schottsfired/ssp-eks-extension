import { App } from '@aws-cdk/core';
import { EksBlueprint } from '@aws-quickstart/ssp-amazon-eks';
import { SnykMonitorAddOn } from '../dist';
import { pipeline } from '../ci/pipeline'

const app = new App();

// load required parameters from the environment and validate them
const account = process.env.CDK_DEFAULT_ACCOUNT!; // e.g. 492635582501
const region = process.env.CDK_DEFAULT_REGION! || 'us-east-1';
const stackID = process.env.STACK_ID || 'ssp-amazon-eks-snyk';
const integrationId = process.env.INTEGRATION_ID; // e.g. abcd1234-abcd-1234-abcd-1234abcd1234
if (!inputsAreValid()) {
    console.log("Inputs are invalid. Exiting...");
    process.exit(1);
}
const stackProps = { env: { account, region } }

// deploy EKS with the Snyk Monitor addon
EksBlueprint.builder()
    .addOns(new SnykMonitorAddOn({
        integrationId: integrationId,
        version: "1.86.0",
        values: {}
    }))
    .build(app, stackID, stackProps);

function inputsAreValid(): boolean {
    let valid = true;
    if (!account || account.length == 0) {
        console.log("CDK_DEFAULT_ACCOUNT environment variable is empty or unset. Try 'aws configure'.");
        valid = false;
    }
    if (!process.env.REGION) {
        console.log("CDK_DEFAULT_REGION environment variable is unset. Try 'aws configure'. Will default to 'us-east-1'.");
    }
    if (!process.env.STACK_ID) {
        console.log("STACK_ID environment variable is unset. Will default to 'ssp-amazon-eks-snyk'.");
    }
    if (!integrationId || integrationId.length == 0) {
        console.log("INTEGRATION_ID environment variable is empty or unset.");
        valid = false;
    }
    return valid;
}

pipeline.build(app, 'ssp-addon-snyk-monitor-pipeline', stackProps)
