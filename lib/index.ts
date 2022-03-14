import { Construct } from '@aws-cdk/core';
import * as ssp from '@aws-quickstart/ssp-amazon-eks';
import { SnykMonitorProvider } from './snyk-monitor-provider';

export interface SnykMonitorAddOnProps extends ssp.HelmAddOnUserProps {
    /**
     * Snyk Integration ID from https://app.snyk.io/org/YOUR-ORGANIZATION-NAME/manage/integrations/kubernetes
     */
    integrationId?: string;

    dockerCfgJson?: string;
}

export const defaultProps: ssp.HelmAddOnProps & SnykMonitorAddOnProps = {
    chart: 'snyk-monitor',
    name: 'snyk-monitor',
    namespace: 'snyk-monitor',
    release: 'snyk-monitor',
    version: '1.83.6',
    repository: 'https://snyk.github.io/kubernetes-monitor/',
    values: {}
}

export class SnykMonitorAddOn extends ssp.HelmAddOn {

    readonly options: SnykMonitorAddOnProps;

    constructor(props: SnykMonitorAddOnProps) {
        super({...defaultProps, ...props});
        this.options = this.props as SnykMonitorAddOnProps;
    }

    deploy(clusterInfo: ssp.ClusterInfo): Promise<Construct> {
        const snykMonitorProvider = new SnykMonitorProvider(this.options);
        return Promise.resolve(snykMonitorProvider.deploy(clusterInfo));
    }
}
