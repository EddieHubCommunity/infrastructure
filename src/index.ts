import * as kubernetes from "@pulumi/kubernetes";
import * as fs from "fs";
import domain from "./networking/domain";
// import {
// kubernetesProvider,
// createCluster,
// kubeconfig,
// } from "./kubernetes/cluster";
import spaces from "./storage/spaces";
import nginx from "./networking/nginx";
import project from "./project";
import cert from "./networking/cert";
import { deployMongoDBCluster } from "./databases/mongo";

import ingress from "./networking/ingress";
import linkfreeApp from "./apps/linkfree";
import secrets from "./kubernetes/secrets";
import finderApp from "./apps/finder";
import apiApp from "./apps/api/deployment";

const name = "eddiehub2";
const url = "eddiehubcommunity.org";

// DO NOT DO THIS IN PRODUCTION
const kubernetesProvider = new kubernetes.Provider("digitalocean", {
  kubeconfig: fs
    .readFileSync("../production-189803e-kubeconfig.yaml")
    .toString(),
});

const domainResource = domain(name, url);
const secretsResource = secrets(kubernetesProvider);

const loadBalancerResource = cert(domainResource);

const nginxResource = nginx(kubernetesProvider, loadBalancerResource);
// const spacesResource = spaces(name, url);

const mongoDb = deployMongoDBCluster("mongo", kubernetesProvider);

ingress(kubernetesProvider);
linkfreeApp(kubernetesProvider);
finderApp(kubernetesProvider, secretsResource);
apiApp(kubernetesProvider, []);

// mongodb;
// mongodb - credentials;

project(name, [
  loadBalancerResource.loadBalancerUrn,
  domainResource.domainUrn,
  // spacesResource,
]);

import { deployGrafana } from "./monitoring/grafana";
const grafana = deployGrafana("production", kubernetesProvider);

import { deployLoki } from "./monitoring/loki";
const loki = deployLoki("production", kubernetesProvider);

import { deployPromTail } from "./monitoring/promtail";
const promtail = deployPromTail("production", kubernetesProvider);

import { deployTeleport } from "./teleport";
const teleport = deployTeleport("production", kubernetesProvider);

// export { kubeconfig };
