import * as k8s from "@pulumi/kubernetes";
import * as kx from "@pulumi/kubernetesx";
import { config } from "./config";

// Create a k8s provider to the cluster.
const provider = new k8s.Provider("provider", {kubeconfig: config.kubeconfig});

// Create a Secret from the DB connection information.
const dbConnSecret = new kx.Secret("aurora-db-conn",
    {
        metadata: { namespace: config.appsNamespaceName },
        stringData: {
            connUrl: "http://example.com",
        },
    },
    {provider},
);

const appLabels = { app: "nginx-app-stack" };
const appDeployment = new k8s.apps.v1.Deployment("nginx-app-stack", {
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
}, { provider });
