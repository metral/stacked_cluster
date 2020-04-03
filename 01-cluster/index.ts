import * as aws from "@pulumi/aws";
import * as eks from "@pulumi/eks";
import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";

const projectName = pulumi.getProject();

// Create an EKS cluster.
const cluster = new eks.Cluster(`${projectName}`, {
    deployDashboard: false,
});

// Export the cluster details.
export const kubeconfig = cluster.kubeconfig.apply(JSON.stringify);
export const clusterName = cluster.core.cluster.name;

// Create a namespace
const appsNamespace = new k8s.core.v1.Namespace("apps", undefined, { provider: cluster.provider });
export const appsNamespaceName = appsNamespace.metadata.name;

// Deploy nginx.
const appLabels = { app: "nginx-cluster-stack" };
const appDeployment = new k8s.apps.v1.Deployment("nginx-cluster-stack", {
    spec: {
        selector: { matchLabels: appLabels },
        replicas: 1,
        template: {
            metadata: { labels: appLabels },
            spec: {
                containers: [{
                    name: "nginx",
                    image: "nginx",
                    ports: [{name: "http", containerPort: 80}],
                }],
            },
        },
    },
}, { provider: cluster.provider });
