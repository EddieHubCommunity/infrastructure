// WIP
// // import domain from "./networking/domain";
// // import spaces from "./storage/spaces";
// // import cert from "./networking/cert";
// // import ingress from "./networking/ingress";
// // import secrets from "./kubernetes/secrets";
// Needs GH TOKEN
// import finderApp from "./apps/finder";

// Working
import * as pulumi from "@pulumi/pulumi";
const stackName = pulumi.getStack();

import { createCluster } from "./kubernetes/cluster";
export const { kubeconfig } = createCluster({
  name: stackName,
  region: "lon1",
  mainPool: {
    size: "g4s.kube.medium",
    nodeCount: 4,
  },
});

import * as kubernetes from "@pulumi/kubernetes";
const kubernetesProvider = new kubernetes.Provider("kubernetes", {
  kubeconfig,
});

import { deployIngressController } from "./networking/ingressController";
deployIngressController(kubernetesProvider);

import { deployGrafana } from "./monitoring/grafana";
const grafana = deployGrafana(stackName, kubernetesProvider);

import { deployLoki } from "./monitoring/loki";
const loki = deployLoki(stackName, kubernetesProvider);

import { deployPromTail } from "./monitoring/promtail";
const promtail = deployPromTail(stackName, kubernetesProvider);

import { deployTeleport } from "./teleport";
const teleport = deployTeleport(stackName, kubernetesProvider);

import { deployMongoDBCluster } from "./databases/mongo";
const mongoDb = deployMongoDBCluster(stackName, kubernetesProvider);

import { deployLinkFree } from "./apps/linkfree";
const linkFree = deployLinkFree(kubernetesProvider);

import { deployApi } from "./apps/api/deployment";
deployApi(kubernetesProvider);
