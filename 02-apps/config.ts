import * as pulumi from "@pulumi/pulumi";
import * as fs from "fs";

let pulumiConfig = new pulumi.Config();

// Existing Pulumi stack reference in the format:
// <organization>/<project>/<stack> e.g. "myUser/myProject/dev"
const clusterStackRef = new pulumi.StackReference(pulumiConfig.require("clusterStackRef"));

export const config = {
    // Cluster
    kubeconfig: clusterStackRef.getOutput("kubeconfig"),
    appsNamespaceName: clusterStackRef.getOutput("appsNamespaceName"),
};
